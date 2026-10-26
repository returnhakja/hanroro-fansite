'use client';

import { useCallback, useEffect, useRef } from 'react';

// 유튜브 IFrame Player API로 리듬게임 곡을 재생하면서, 매 프레임 정확한 경과 시간을
// 추정한다. getCurrentTime()은 프레임 단위로 정밀하지 않아 그대로 쓰면 노트가
// 뚝뚝 끊겨 보이므로, performance.now() 기반 로컬 시계로 매끄럽게 보간하고
// 주기적으로 getCurrentTime()과 대조해 드리프트를 보정한다.

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

function loadYoutubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevReady?.();
      resolve();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  });
  return apiLoadPromise;
}

const SYNC_INTERVAL_MS = 500;

// 유튜브 IFrame API의 onError 코드 → 사람이 읽을 수 있는 설명.
// https://developers.google.com/youtube/iframe_api_reference#onError
export const RHYTHM_YT_ERROR_MESSAGES: Record<number, string> = {
  2: '잘못된 영상 ID예요',
  5: 'HTML5 플레이어에서 재생할 수 없는 영상이에요',
  100: '영상을 찾을 수 없어요(비공개거나 삭제됨)',
  101: '영상 소유자가 외부 재생(임베드)을 막아놨어요',
  150: '영상 소유자가 외부 재생(임베드)을 막아놨어요',
};

export function useRhythmYoutubePlayer(onEnded?: () => void, onError?: (message: string) => void) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const readyRef = useRef<Promise<void> | null>(null);
  // player가 이미 준비된 뒤라면(거의 모든 실제 케이스) start()가 await을 전혀 거치지 않고
  // 클릭 이벤트 핸들러 안에서 완전히 동기적으로 playVideo()까지 끝내야 한다.
  // await을 한 번이라도 거치면(마이크로태스크라도) 브라우저가 "사용자 제스처와
  // 무관한 재생"으로 취급해 소리를 막는 경우가 있어서, 이 경로를 아예 없앤다.
  const isReadyRef = useRef(false);
  const startSecondsRef = useRef(0);
  const baseVideoSecRef = useRef(0);
  const localStartPerfRef = useRef(0);
  const syncTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;
    readyRef.current = loadYoutubeApi().then(() => {
      if (cancelled || !containerRef.current) return;
      return new Promise<void>((resolve) => {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '1',
          width: '1',
          playerVars: { autoplay: 0, controls: 0, disablekb: 1 },
          events: {
            onReady: () => {
              isReadyRef.current = true;
              resolve();
            },
            onStateChange: (e: any) => {
              if (e.data === 0) onEndedRef.current?.();
            },
            onError: (e: any) => {
              const message = RHYTHM_YT_ERROR_MESSAGES[e.data] ?? `유튜브 오류 (코드 ${e.data})`;
              console.error('[rhythm] youtube player error', e.data, message);
              onErrorRef.current?.(message);
            },
          },
        });
      });
    });

    return () => {
      cancelled = true;
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
      playerRef.current?.destroy?.();
    };
  }, []);

  const stop = useCallback(() => {
    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    playerRef.current?.pauseVideo?.();
  }, []);

  const beginPlayback = useCallback((player: any, youtubeId: string, startSeconds: number) => {
    startSecondsRef.current = startSeconds;
    baseVideoSecRef.current = startSeconds;
    localStartPerfRef.current = performance.now();

    player.loadVideoById({ videoId: youtubeId, startSeconds });
    player.playVideo();
    player.unMute?.();
    player.setVolume?.(100);

    // 유튜브 플레이어는 "소리 있는 자동재생이 막혔다"고 판단하면 onError 없이
    // 조용히 muted 상태로 전환해 재생을 이어가는 내부 폴백이 있다. 위에서
    // unMute를 호출해도 그 폴백이 그 이후에 비동기로 뒤늦게 발동하면
    // 다시 muted로 덮일 수 있어서, 재생 시작 초반 몇 초간 반복 확인해서
    // muted면 강제로 다시 풀어준다.
    let watchdogTicks = 0;
    const watchdog = setInterval(() => {
      watchdogTicks += 1;
      if (player.isMuted?.()) {
        player.unMute?.();
        player.setVolume?.(100);
      }
      if (watchdogTicks >= 10) clearInterval(watchdog);
    }, 300);

    if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    syncTimerRef.current = setInterval(() => {
      const real = player.getCurrentTime?.();
      if (typeof real === 'number' && real > 0) {
        baseVideoSecRef.current = real;
        localStartPerfRef.current = performance.now();
      }
    }, SYNC_INTERVAL_MS);
  }, []);

  const start = useCallback((youtubeId: string, startSeconds: number) => {
    if (isReadyRef.current && playerRef.current) {
      beginPlayback(playerRef.current, youtubeId, startSeconds);
      return;
    }
    // 아직 준비 안 된 아주 초기 진입 케이스에만 대기한다(사용자 제스처 보존 불가 경로).
    readyRef.current?.then(() => {
      if (playerRef.current) beginPlayback(playerRef.current, youtubeId, startSeconds);
    });
  }, [beginPlayback]);

  // 노트 타이밍의 기준이 되는, startSeconds 시점부터 경과한 ms (매 프레임 호출해도 안전)
  const getElapsedMs = useCallback(() => {
    const estimatedSec =
      baseVideoSecRef.current + (performance.now() - localStartPerfRef.current) / 1000;
    return (estimatedSec - startSecondsRef.current) * 1000;
  }, []);

  return { containerRef, start, stop, getElapsedMs };
}
