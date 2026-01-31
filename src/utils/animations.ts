/**
 * framer-motion 애니메이션 유틸리티
 * 재사용 가능한 애니메이션 variants 정의
 */

import { Variants } from 'framer-motion';

/**
 * 페이드 인 + 위로 슬라이드 애니메이션
 */
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeInUpViewport = {
  once: true,
  margin: '-100px',
};

/**
 * 페이드 인 + 스케일 애니메이션 (Hero Section용)
 */
export const fadeInScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

/**
 * Stagger Container - 자식 요소들을 순차적으로 애니메이션
 */
export const staggerContainer: Variants = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger 아이템 (Container의 자식 요소용)
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
};

/**
 * 호버 시 스케일 + 그림자 강화
 */
export const scaleOnHover = {
  whileHover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  whileTap: {
    scale: 0.98,
  },
};

/**
 * 패럴랙스 효과를 위한 유틸 함수
 */
export const parallaxTransform = (scrollY: number, speed: number = 0.5) => {
  return `translateY(${scrollY * speed}px)`;
};

/**
 * 탭 전환 애니메이션 (AnimatePresence용)
 */
export const tabTransition: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * 버튼 클릭 애니메이션
 */
export const buttonPress = {
  whileTap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
};

/**
 * 이미지 로드 애니메이션
 */
export const imageReveal: Variants = {
  initial: {
    opacity: 0,
    scale: 1.1,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};
