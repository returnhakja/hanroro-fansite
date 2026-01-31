/**
 * useReducedMotion Hook
 * 사용자의 "애니메이션 줄이기" 설정을 감지하는 접근성 훅
 * prefers-reduced-motion 미디어 쿼리를 활용
 */

import { useEffect, useState } from 'react';

export const useReducedMotion = (): boolean => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion 미디어 쿼리 확인
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // 초기값 설정
    setShouldReduceMotion(mediaQuery.matches);

    // 미디어 쿼리 변경 감지 리스너
    const listener = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches);
    };

    // 리스너 등록
    mediaQuery.addEventListener('change', listener);

    // 클린업
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return shouldReduceMotion;
};
