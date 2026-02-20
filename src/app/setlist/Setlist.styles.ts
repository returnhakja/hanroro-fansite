import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';

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

export const ConcertCard = styled(motion.div)`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};
  transition: box-shadow ${theme.transitions.normal};

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

export const ConcertBody = styled.div`
  padding: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1.5rem;
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
