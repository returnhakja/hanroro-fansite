/**
 * 테마 시스템 - 색상, 타이포그래피, 간격, 그림자 등 디자인 토큰 정의
 * 따뜻한 베이지/크림 톤의 공식 아티스트 사이트 디자인
 */

export const theme = {
  colors: {
    // Primary (따뜻한 브라운)
    primary: '#8B7355',
    primaryLight: '#B09A7E',
    primaryDark: '#6B5740',

    // Accent (골드)
    accent: '#C9A96E',
    accentLight: '#DEC596',
    accentDark: '#A88B4A',

    // Secondary (로즈 베이지)
    secondary: '#C4A882',
    secondaryLight: '#E0D0BC',

    // Neutral
    background: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F0E8',
    surfaceWarm: '#EDE6DA',

    // Gradients
    gradientHero: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
    gradientCard: 'linear-gradient(180deg, rgba(250,247,242,0) 0%, rgba(250,247,242,1) 100%)',
    gradientOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)',
    gradientWarm: 'linear-gradient(135deg, #FAF7F2 0%, #EDE6DA 100%)',
    gradientGold: 'linear-gradient(135deg, #C9A96E 0%, #DEC596 100%)',

    // Text
    textPrimary: '#2C2418',
    textSecondary: '#7A6E5D',
    textTertiary: '#A99E8F',
    textLight: '#FFFFFF',

    // Borders
    border: '#E5DDD0',
    borderLight: '#F0EBE2',

    // Status
    error: '#C75B5B',
    success: '#6B8E6B',
    info: '#7B8FA1',
  },

  // Typography
  typography: {
    // 폰트 패밀리
    fontHeading: "'Playfair Display', 'Noto Serif KR', Georgia, serif",
    fontBody: "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // Hero Title
    hero: {
      fontSize: '5rem',
      fontWeight: 300,
      lineHeight: 1.05,
      letterSpacing: '0.08em',
    },

    // Section Titles
    h1: {
      fontSize: '2.75rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0.02em',
    },

    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.01em',
    },

    h3: {
      fontSize: '1.375rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },

    // Body
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.75,
    },

    bodyLarge: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.8,
    },

    // Small
    small: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },

    // Overline (섹션 라벨)
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.15em',
    },
  },

  // Spacing
  spacing: {
    sectionPadding: {
      desktop: '8rem 4rem',
      tablet: '5rem 2.5rem',
      mobile: '3.5rem 1.25rem',
    },

    gap: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2.5rem',
      xl: '4rem',
      xxl: '6rem',
    },

    gridGap: {
      desktop: '2.5rem',
      tablet: '2rem',
      mobile: '1.5rem',
    },
  },

  // Shadows
  shadows: {
    sm: '0 1px 4px rgba(44, 36, 24, 0.06)',
    md: '0 4px 16px rgba(44, 36, 24, 0.08)',
    lg: '0 8px 32px rgba(44, 36, 24, 0.10)',
    xl: '0 20px 60px rgba(44, 36, 24, 0.12)',
    glow: '0 0 24px rgba(201, 169, 110, 0.2)',
  },

  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Breakpoints
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export type Theme = typeof theme;
