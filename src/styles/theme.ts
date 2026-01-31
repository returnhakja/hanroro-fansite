/**
 * 테마 시스템 - 색상, 타이포그래피, 간격, 그림자 등 디자인 토큰 정의
 */

export const theme = {
  colors: {
    // Primary (한로로 브랜드 컬러 - 보라)
    primary: '#6A4C93',
    primaryLight: '#9B7EBD',
    primaryDark: '#4A3768',

    // Accent (활기찬 핑크)
    accent: '#FF6B9D',
    accentLight: '#FFB5D5',
    accentDark: '#E5478A',

    // Secondary (따뜻한 코랄)
    secondary: '#FFA07A',
    secondaryLight: '#FFD4B8',

    // Neutral
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F5F5',

    // Gradients
    gradientHero: 'linear-gradient(135deg, #6A4C93 0%, #9B7EBD 50%, #FFA07A 100%)',
    gradientCard: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.95) 100%)',
    gradientOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',

    // Text
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    textLight: '#FFFFFF',
  },

  // Typography
  typography: {
    // Hero Title
    hero: {
      fontSize: '4rem',          // 64px
      fontWeight: 900,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },

    // Section Titles
    h1: {
      fontSize: '2.5rem',        // 40px
      fontWeight: 700,
      lineHeight: 1.2,
    },

    h2: {
      fontSize: '2rem',          // 32px
      fontWeight: 600,
      lineHeight: 1.3,
    },

    h3: {
      fontSize: '1.5rem',        // 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },

    // Body
    body: {
      fontSize: '1rem',          // 16px
      fontWeight: 400,
      lineHeight: 1.6,
    },

    // Small
    small: {
      fontSize: '0.875rem',      // 14px
      lineHeight: 1.5,
    },
  },

  // Spacing
  spacing: {
    // Section Padding
    sectionPadding: {
      desktop: '6rem 2rem',      // 96px vertical
      tablet: '4rem 2rem',       // 64px vertical
      mobile: '3rem 1.5rem',     // 48px vertical
    },

    // Element Spacing
    gap: {
      xs: '0.5rem',              // 8px
      sm: '1rem',                // 16px
      md: '1.5rem',              // 24px
      lg: '2rem',                // 32px
      xl: '3rem',                // 48px
    },

    // Grid
    gridGap: {
      desktop: '2rem',
      tablet: '1.5rem',
      mobile: '1rem',
    },
  },

  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 16px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.16)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.24)',
    glow: '0 0 20px rgba(106, 76, 147, 0.3)',
  },

  // Border Radius
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
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
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export type Theme = typeof theme;
