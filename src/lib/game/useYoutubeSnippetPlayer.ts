'use client';

import { useCallback, useEffect, useRef } from 'react';

// 유튜브 IFrame Player API를 문제마다 새로 만들지 않고 재사용한다.
// 플레이어는 화면 밖에 숨겨두고 소리만 재생한다.

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
    window.onYouTubeIframeAPIReady = () => resolve();
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
  return apiLoadPromise;
}

export function useYoutubeSnippetPlayer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyRef = useRef<Promise<void> | null>(null);

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
          },
        });
      });
    });

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      playerRef.current?.destroy?.();
    };
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    playerRef.current?.pauseVideo?.();
  }, []);

  const play = useCallback(
    async (youtubeId: string, startSeconds: number, durationSeconds: number) => {
      await readyRef.current;
      const player = playerRef.current;
      if (!player) return;

      stop();
      player.loadVideoById({ videoId: youtubeId, startSeconds });
      player.playVideo();

      await new Promise<void>((resolve) => {
        timerRef.current = setTimeout(() => {
          player.pauseVideo();
          resolve();
        }, durationSeconds * 1000);
      });
    },
    [stop]
  );

  return { containerRef, play, stop };
}
