import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';

// ─── 야간 모드 색상 ──────────────────────────────────────────────
export const night = {
  bg: '#1A1410',
  cardBg: '#2A2018',
  toolbarBg: '#120E09',
  text: '#F5E6C8',
  textSecondary: '#B0A090',
  border: '#3A3028',
  fan: '#DEC596',
  clap: '#B09A7E',
  rest: '#6A5E50',
};

// ─── 폰트 크기 ───────────────────────────────────────────────────
export const fontSizeMap = {
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
} as const;
export type FontSize = keyof typeof fontSizeMap;

// ─── 레이아웃 ────────────────────────────────────────────────────
export const PageWrapper = styled.div<{ $night: boolean }>`
  min-height: 100vh;
  background: ${({ $night }) => ($night ? night.bg : theme.colors.background)};
  transition: background 0.3s ease;
`;

export const ContentArea = styled.div`
  max-width: 740px;
  margin: 0 auto;
  padding: 2rem 1.25rem calc(6rem + env(safe-area-inset-bottom, 0px));

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

// ─── 헤더 ────────────────────────────────────────────────────────
export const PageHeader = styled.div`
  padding: 5rem 1.25rem 0;
  max-width: 740px;
  margin: 0 auto;
  text-align: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-top: 3.5rem;
  }
`;

export const PageTitle = styled.h1<{ $night: boolean }>`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  letter-spacing: ${theme.typography.h1.letterSpacing};
  color: ${({ $night }) => ($night ? night.text : theme.colors.textPrimary)};
  margin: 0 0 0.75rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.h2.fontSize};
  }
`;

export const PageSubtitle = styled.p<{ $night: boolean }>`
  font-size: ${theme.typography.body.fontSize};
  color: ${({ $night }) => ($night ? night.textSecondary : theme.colors.textSecondary)};
  line-height: 1.7;
  margin: 0 0 2.5rem;
`;

// ─── 툴바 (sticky) ───────────────────────────────────────────────
export const ToolBar = styled.div<{ $night: boolean }>`
  position: sticky;
  top: 64px;
  z-index: 40;
  background: ${({ $night }) => ($night ? night.toolbarBg : theme.colors.background)};
  border-bottom: 1px solid ${({ $night }) => ($night ? night.border : theme.colors.border)};
  backdrop-filter: blur(8px);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    top: 56px;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
  }
`;

export const SearchInput = styled.input<{ $night: boolean }>`
  flex: 1;
  min-width: 120px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    flex-basis: 100%;
    order: -1;
  }
  padding: 0.5rem 0.875rem;
  border: 1px solid ${({ $night }) => ($night ? night.border : theme.colors.border)};
  border-radius: ${theme.borderRadius.full};
  background: ${({ $night }) => ($night ? night.cardBg : theme.colors.surface)};
  color: ${({ $night }) => ($night ? night.text : theme.colors.textPrimary)};
  font-size: 0.875rem;
  font-family: ${theme.typography.fontBody};
  outline: none;
  transition: border-color ${theme.transitions.fast};

  &::placeholder {
    color: ${({ $night }) => ($night ? night.rest : theme.colors.textTertiary)};
  }

  &:focus {
    border-color: ${theme.colors.accent};
  }
`;

export const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const ToolButton = styled.button<{ $night: boolean; $active?: boolean }>`
  padding: 0.4rem 0.75rem;
  min-height: 36px;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${({ $night }) => ($night ? night.border : theme.colors.border)};
  background: ${({ $active, $night }) =>
    $active
      ? theme.colors.accent
      : $night
      ? night.cardBg
      : theme.colors.surface};
  color: ${({ $active, $night }) =>
    $active ? '#fff' : $night ? night.text : theme.colors.textPrimary};
  font-size: 0.8125rem;
  font-family: ${theme.typography.fontBody};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    border-color: ${theme.colors.accent};
    color: ${({ $active }) => ($active ? '#fff' : theme.colors.accent)};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-height: 40px;
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
  }
`;

// ─── 곡 목록 ────────────────────────────────────────────────────
export const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const SongCard = styled(motion.div)<{ $night: boolean }>`
  background: ${({ $night }) => ($night ? night.cardBg : theme.colors.surface)};
  border: 1px solid ${({ $night }) => ($night ? night.border : theme.colors.border)};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  transition: border-color ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.accent};
  }
`;

export const SongCardHeader = styled.button<{ $night: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  min-height: 68px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.875rem 1rem;
    gap: 0.75rem;
  }
`;

export const AlbumThumb = styled.img`
  width: 44px;
  height: 44px;
  border-radius: ${theme.borderRadius.md};
  object-fit: cover;
  flex-shrink: 0;
  background: ${theme.colors.surfaceAlt};
`;

export const AlbumPlaceholder = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surfaceWarm};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

export const SongInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SongTitle = styled.p<{ $night: boolean }>`
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${({ $night }) => ($night ? night.text : theme.colors.textPrimary)};
  margin: 0 0 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AlbumName = styled.p<{ $night: boolean }>`
  font-size: 0.8125rem;
  color: ${({ $night }) => ($night ? night.textSecondary : theme.colors.textSecondary)};
  margin: 0;
`;

export const ExpandIcon = styled.span<{ $expanded: boolean; $night: boolean }>`
  font-size: 1.1rem;
  color: ${({ $night }) => ($night ? night.textSecondary : theme.colors.textTertiary)};
  transition: transform ${theme.transitions.fast};
  transform: ${({ $expanded }) => ($expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

// ─── 응원법 카드 바디 ─────────────────────────────────────────────
export const SongCardBody = styled(motion.div)<{ $night: boolean }>`
  border-top: 1px solid ${({ $night }) => ($night ? night.border : theme.colors.borderLight)};
  padding: 1rem 1.25rem 1.25rem;
  overflow: hidden;
`;

export const LegendRow = styled.div`
  display: flex;
  gap: 0.625rem 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid ${theme.colors.borderLight};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 0.5rem 0.75rem;
  }
`;

export const LegendItem = styled.span<{ $type: 'fan' | 'clap' | 'rest' | 'artist'; $night: boolean }>`
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: ${({ $type, $night }) => {
    if ($type === 'fan') return $night ? night.fan : theme.colors.accent;
    if ($type === 'clap') return $night ? night.clap : theme.colors.primary;
    if ($type === 'rest') return $night ? night.rest : theme.colors.textTertiary;
    return $night ? night.textSecondary : theme.colors.textSecondary;
  }};
`;

export const LyricsBlock = styled.div<{ $fontSize: FontSize }>`
  font-size: ${({ $fontSize }) => fontSizeMap[$fontSize]};
  line-height: 1.9;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

// 줄 래퍼: rest 타입 줄은 중앙 정렬 + 흐리게
export const LyricLine = styled.p<{
  $isRest: boolean;
  $night: boolean;
}>`
  margin: 0;
  padding: 0.15rem 0;
  text-align: ${({ $isRest }) => ($isRest ? 'center' : 'left')};
  opacity: ${({ $isRest }) => ($isRest ? 0.75 : 1)};
  font-size: ${({ $isRest }) => ($isRest ? '0.9em' : '1em')};
  color: ${({ $night }) => ($night ? night.text : theme.colors.textPrimary)};
  word-break: keep-all;
  overflow-wrap: break-word;
`;

// 인라인 세그먼트 span
export const LyricSpan = styled.span<{
  $type: 'artist' | 'fan' | 'clap' | 'rest';
  $night: boolean;
}>`
  color: ${({ $type, $night }) => {
    if ($type === 'fan') return $night ? night.fan : theme.colors.accent;
    if ($type === 'clap') return $night ? night.clap : theme.colors.primary;
    if ($type === 'rest') return $night ? night.rest : theme.colors.textTertiary;
    return 'inherit';
  }};
  font-weight: ${({ $type }) => ($type === 'fan' ? 700 : 400)};
  font-style: ${({ $type }) => ($type === 'clap' ? 'italic' : 'normal')};
`;

// ─── 빈 상태 ─────────────────────────────────────────────────────
export const EmptyMessage = styled.p<{ $night: boolean }>`
  text-align: center;
  color: ${({ $night }) => ($night ? night.textSecondary : theme.colors.textTertiary)};
  padding: 4rem 0;
  font-size: ${theme.typography.body.fontSize};
`;

// ─── 화면 켜짐 유지 플로팅 바 (모바일 전용) ──────────────────────
export const FloatingBar = styled.div<{ $night: boolean }>`
  position: fixed;
  bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
  right: calc(1.5rem + env(safe-area-inset-right, 0px));
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  background: ${({ $night }) => ($night ? night.cardBg : theme.colors.surface)};
  border: 1px solid ${({ $night }) => ($night ? night.border : theme.colors.border)};
  border-radius: ${theme.borderRadius.full};
  box-shadow: ${theme.shadows.lg};
  z-index: 50;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const FloatingLabel = styled.span<{ $night: boolean }>`
  font-size: 0.8125rem;
  color: ${({ $night }) => ($night ? night.textSecondary : theme.colors.textSecondary)};
  white-space: nowrap;
`;

export const Toggle = styled.button<{ $on: boolean; $night: boolean }>`
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: ${theme.borderRadius.full};
  border: none;
  cursor: pointer;
  background: ${({ $on }) => ($on ? theme.colors.accent : theme.colors.surfaceWarm)};
  transition: background ${theme.transitions.fast};
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '21px' : '3px')};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: left ${theme.transitions.fast};
  }
`;
