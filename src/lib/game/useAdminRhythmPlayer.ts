'use client';

import { useCallback, useEffect, useRef } from 'react';

// 관리자 차트 에디터에서 쓰는, 눈에 보이고 직접 조작 가능한 유튜브 플레이어.
// 게임 플레이용 useRhythmYoutubePlayer와 달리 정밀 동기화는 필요 없고,
// 재생/탐색/배속 조절만 되면 충분하다(노트 배치는 사람이 보고 찍는 작업이라).

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

export function useAdminRhythmPlayer(onStateChange?: (state: number) => void) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const readyRef = useRef<Promise<void> | null>(null);
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  useEffect(() => {
    let cancelled = false;
    readyRef.current = loadYoutubeApi().then(() => {
      if (cancelled || !containerRef.current) return;
      return new Promise<void>((resolve) => {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '220',
          width: '390',
          playerVars: { autoplay: 0, controls: 1 },
          events: {
            onReady: () => resolve(),
            onStateChange: (e: any) => onStateChangeRef.current?.(e.data),
          },
        });
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
    };
  }, []);

  const loadVideo = useCallback(async (youtubeId: string, startSeconds: number) => {
    await readyRef.current;
    playerRef.current?.cueVideoById?.({ videoId: youtubeId, startSeconds });
  }, []);

  const play = useCallback(() => playerRef.current?.playVideo?.(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo?.(), []);
  const seekTo = useCallback((sec: number) => playerRef.current?.seekTo?.(sec, true), []);
  const setRate = useCallback((rate: number) => playerRef.current?.setPlaybackRate?.(rate), []);
  const getCurrentTime = useCallback((): number => playerRef.current?.getCurrentTime?.() ?? 0, []);
  const getDuration = useCallback((): number => playerRef.current?.getDuration?.() ?? 0, []);

  return { containerRef, loadVideo, play, pause, seekTo, setRate, getCurrentTime, getDuration };
}
