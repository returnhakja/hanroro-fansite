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

export function useRhythmYoutubePlayer(onEnded?: () => void) {
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
    // 로드 직후 음소거 상태가 남아있는 경우를 대비해 명시적으로 풀어준다.
    player.unMute?.();
    player.setVolume?.(100);

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
