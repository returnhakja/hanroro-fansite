'use client';

import { useCallback, useEffect, useRef } from 'react';

// 유튜브 IFrame Player API로 리듬게임 곡을 재생하면서, 매 프레임 정확한 경과 시간을
// 추정한다. getCurrentTime()은 프레임 단위로 정밀하지 않아 그대로 쓰면 노트가
// 뚝뚝 끊겨 보이므로, performance.now() 기반 로컬 시계로 매끄럽게 보간하고
// 주기적으로 getCurrentTime()과 대조해 드리프트를 보정한다.
//
// 재생을 트리거하는 부분(loadVideoById + playVideo)은 이미 소리가 정상적으로
// 나오는 것으로 확인된 useYoutubeSnippetPlayer(노래 맞추기 게임)와 동일한
// 순서를 그대로 따른다. unMute/setVolume 같은 추가 호출은 오히려 도움이
// 안 됐어서 넣지 않는다.

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
            onReady: () => resolve(),
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

  // 노래 맞추기 게임의 play()와 동일한 순서: await readyRef.current → loadVideoById → playVideo.
  const start = useCallback(async (youtubeId: string, startSeconds: number) => {
    await readyRef.current;
    const player = playerRef.current;
    if (!player) return;

    startSecondsRef.current = startSeconds;
    baseVideoSecRef.current = startSeconds;
    localStartPerfRef.current = performance.now();

    player.loadVideoById({ videoId: youtubeId, startSeconds });
    player.playVideo();

    if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    syncTimerRef.current = setInterval(() => {
      const real = player.getCurrentTime?.();
      if (typeof real === 'number' && real > 0) {
        baseVideoSecRef.current = real;
        localStartPerfRef.current = performance.now();
      }
    }, SYNC_INTERVAL_MS);
  }, []);

  // 노트 타이밍의 기준이 되는, startSeconds 시점부터 경과한 ms (매 프레임 호출해도 안전)
  const getElapsedMs = useCallback(() => {
    const estimatedSec =
      baseVideoSecRef.current + (performance.now() - localStartPerfRef.current) / 1000;
    return (estimatedSec - startSecondsRef.current) * 1000;
  }, []);

  return { containerRef, start, stop, getElapsedMs };
}
