import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  padding: 8rem 2rem 6rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 6rem 1.25rem 4rem;
  }
`;

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

export const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  color: ${theme.colors.textPrimary};
  letter-spacing: ${theme.typography.h1.letterSpacing};
  margin-bottom: 0.75rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: ${theme.typography.body.fontSize};
  color: ${theme.colors.textSecondary};
  line-height: ${theme.typography.body.lineHeight};
`;

// ─── 연도 탭 ──────────────────────────────────────────────────────
export const YearTabList = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`;

export const YearTab = styled.button<{ $active: boolean }>`
  padding: 0.6rem 1.5rem;
  border-radius: ${theme.borderRadius.full};
  border: 1.5px solid ${({ $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ $active }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? theme.colors.textLight : theme.colors.textSecondary)};
  font-family: ${theme.typography.fontBody};
  font-size: 0.95rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${({ $active }) => ($active ? theme.colors.textLight : theme.colors.primary)};
  }
`;

// ─── 타임라인 ─────────────────────────────────────────────────────
export const Timeline = styled.div`
  max-width: 860px;
  margin: 0 auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 88px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: ${theme.colors.border};

    @media (max-width: ${theme.breakpoints.mobile}) {
      left: 56px;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    &::before {
      left: 56px;
    }
  }
`;

export const MonthGroup = styled.div`
  margin-bottom: 3rem;
`;

export const MonthLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
`;

export const MonthText = styled.span`
  font-family: ${theme.typography.fontHeading};
  font-size: 1rem;
  font-weight: 500;
  color: ${theme.colors.textTertiary};
  width: 72px;
  text-align: right;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 44px;
    font-size: 0.875rem;
  }
`;

export const MonthDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${theme.colors.accent};
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

export const ActivityList = styled.div`
  padding-left: calc(88px + 1.5rem + 10px);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-left: calc(56px + 1.5rem + 10px);
  }
`;

// ─── 활동 카드 ────────────────────────────────────────────────────
export const ActivityCard = styled(motion.div)`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  display: flex;
  gap: 0;
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

export const CardImage = styled.div<{ $url: string }>`
  width: 120px;
  flex-shrink: 0;
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  background-position: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 90px;
  }
`;

export const CardBody = styled.div`
  padding: 1rem 1.25rem;
  flex: 1;
  min-width: 0;
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
`;

export const TypeBadge = styled.span<{ $type: string }>`
  padding: 0.15rem 0.6rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  background: ${({ $type }) => {
    const map: Record<string, string> = {
      concert: '#EEF4FF',
      release: '#FFF4EC',
      broadcast: '#F5F0FF',
      award: '#FFFBEC',
      etc: theme.colors.surfaceAlt,
    };
    return map[$type] ?? map.etc;
  }};
  color: ${({ $type }) => {
    const map: Record<string, string> = {
      concert: '#3B6FD4',
      release: '#D4703B',
      broadcast: '#7B3BD4',
      award: '#B89000',
      etc: theme.colors.textSecondary,
    };
    return map[$type] ?? map.etc;
  }};
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.35rem;
  line-height: 1.4;
`;

export const CardDescription = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

export const CardLink = styled.a`
  font-size: 0.8125rem;
  color: ${theme.colors.accent};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 5rem 0;
  color: ${theme.colors.textTertiary};
  font-size: ${theme.typography.body.fontSize};
`;
