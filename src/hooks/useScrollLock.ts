import { useEffect } from 'react';

// 동시에 여러 모달이 열려도 안전하도록 잠금 횟수를 센다.
let lockCount = 0;
let savedOverflow = '';
let savedPaddingRight = '';

function lock() {
  lockCount += 1;
  if (lockCount > 1) return;

  const { body } = document;
  // 스크롤바가 사라지며 콘텐츠가 밀리는 레이아웃 점프 방지
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  savedOverflow = body.style.overflow;
  savedPaddingRight = body.style.paddingRight;

  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;
  }
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.body.style.overflow = savedOverflow;
  document.body.style.paddingRight = savedPaddingRight;
}

/**
 * locked가 true인 동안 body 스크롤을 잠근다.
 * 모달/드로어 등 오버레이가 열려 있을 때 배경 스크롤을 막는 용도.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lock();
    return unlock;
  }, [locked]);
}
