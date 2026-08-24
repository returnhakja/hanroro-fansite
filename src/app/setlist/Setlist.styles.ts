import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { theme } from '@/styles/theme';

export const BuilderCta = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.4rem;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentLight} 100%);
  color: #3A2E14;
  text-decoration: none;
  margin: 1.5rem 0 2.5rem;
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

export const BuilderCtaCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  strong {
    font-size: 1rem;
    font-weight: 700;
  }

  span {
    font-size: 0.8rem;
    opacity: 0.85;
  }
`;

export const BuilderCtaArrow = styled.span`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 3rem 6rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 6rem 1.5rem 4rem;
  }
`;

export const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  color: ${theme.colors.textPrimary};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.1rem;
  text-align: center;
  color: ${theme.colors.textSecondary};
  margin-bottom: 4rem;
  font-weight: 400;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: 3rem;
  }
`;

export const ConcertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

export const ConcertCard = styled(motion.div)<{ $highlighted?: boolean }>`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${props =>
    props.$highlighted
      ? `0 0 0 3px ${theme.colors.primary}, ${theme.shadows.xl}`
      : theme.shadows.lg};
  transition: box-shadow ${theme.transitions.normal};

  ${props =>
    props.$highlighted &&
    `
    animation: highlightPulse 1.5s ease-out;
    @keyframes highlightPulse {
      0% { box-shadow: 0 0 0 6px ${theme.colors.primary}80, ${theme.shadows.xl}; }
      100% { box-shadow: 0 0 0 3px ${theme.colors.primary}, ${theme.shadows.xl}; }
    }
  `}

  &:hover {
    box-shadow: ${theme.shadows.xl};
  }
`;

export const ConcertHeader = styled.div<{ $posterUrl?: string }>`
  position: relative;
  width: 100%;
  height: 280px;
  background: ${props =>
    props.$posterUrl
      ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${props.$posterUrl})`
      : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 220px;
    padding: 1.5rem;
  }
`;

export const ConcertTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  text-shadow: ${theme.shadows.lg};
  margin-bottom: 0.5rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

export const ConcertInfo = styled.div`
  font-size: ${theme.typography.small.fontSize};
  color: rgba(255, 255, 255, 0.95);
  text-shadow: ${theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ActiveBadge = styled.span`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 700;
  box-shadow: ${theme.shadows.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    top: 1rem;
    right: 1rem;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

export const HeaderShareSlot = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.mobile}) {
    top: 1rem;
    left: 1rem;
  }
`;

export const ConcertBody = styled.div`
  padding: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

export const ConcertActions = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
`;

export const AttendButton = styled.button<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border: 1px solid ${(props) => (props.$checked ? theme.colors.accent : theme.colors.border)};
  border-radius: ${theme.borderRadius.full};
  background: ${(props) => (props.$checked ? theme.colors.accent : 'transparent')};
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(props) => (props.$checked ? theme.colors.textLight : theme.colors.textSecondary)};
  cursor: pointer;
  white-space: nowrap;
  transition: background ${theme.transitions.fast}, color ${theme.transitions.fast},
    border-color ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.accent};
    ${(props) => !props.$checked && `color: ${theme.colors.accentDark};`}
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const TabWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active ? theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : theme.colors.textSecondary};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? theme.colors.primary : 'transparent'};
  font-weight: 600;
  font-size: ${theme.typography.small.fontSize};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;

  &:hover {
    background: ${props => props.$active ? theme.colors.primaryDark : theme.colors.surfaceAlt};
    color: ${props => props.$active ? 'white' : theme.colors.textPrimary};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

/** 선택된 셋리스트의 공연 날짜. 여러 날이면 '8월 10일 ~ 8월 11일' 로 표시된다 */
export const SetlistDateLabel = styled.p`
  padding: 0 0.5rem 0.6rem;
  color: ${theme.colors.textSecondary};
  font-size: 0.85rem;
  letter-spacing: 0.02em;
`;

export const SetlistCard = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.surfaceAlt};
    border-radius: ${theme.borderRadius.md};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: ${theme.borderRadius.md};

    &:hover {
      background: ${theme.colors.primaryDark};
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-height: 350px;
  }
`;

export const SetListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${theme.colors.surfaceAlt};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 0.75rem;
  transition: background ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.border};
  }

  span {
    font-size: ${theme.typography.body.fontSize};
    color: ${theme.colors.textPrimary};
    font-weight: 500;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 0.75rem;
    padding: 0.875rem;

    span {
      font-size: ${theme.typography.small.fontSize};
    }
  }
`;

export const SongOrder = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
  }
`;

export const AlbumThumb = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.md};
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: ${theme.shadows.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 3rem 1.5rem;
    font-size: 1rem;
  }
`;

export const NoSetlistMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.small.fontSize};
`;
