import styled from 'styled-components';
import Link from 'next/link';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem;
  min-height: 60vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 6rem 1.25rem 4rem;
  }
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  margin-bottom: 1.5rem;

  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

export const ShareWrap = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
`;

export const Poster = styled.div`
  width: 280px;
  aspect-ratio: 3 / 4;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(165deg, ${theme.colors.primaryDark} 0%, ${theme.colors.textPrimary} 65%, #1E1810 100%);
  box-shadow: ${theme.shadows.lg};
  padding: 1.9rem 1.6rem;
  display: flex;
  flex-direction: column;
  color: #F3ECE0;
  flex-shrink: 0;
`;

export const PosterBrand = styled.span`
  font-family: ${theme.typography.fontHeading};
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  color: ${theme.colors.accentLight};
  margin-bottom: auto;
`;

export const PosterTitle = styled.div`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.3;
  margin: 1.4rem 0 1.3rem;
`;

export const PosterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-bottom: 1.3rem;
  overflow-y: auto;
`;

export const PosterRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-size: 0.85rem;

  span {
    font-family: ${theme.typography.fontHeading};
    color: ${theme.colors.accentLight};
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    width: 1.1rem;
    flex-shrink: 0;
  }
`;

export const PosterFoot = styled.span`
  margin-top: auto;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: rgba(243, 236, 224, 0.55);
`;

export const ShareActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-top: 0.5rem;
`;

export const Note = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.7;
  max-width: 24em;
  margin: 0 0 0.4rem;
`;

export const PillLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.3rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  text-decoration: none;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  box-shadow: ${theme.shadows.sm};
  transition: background ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.primaryDark};
  }
`;

export const MakeMineLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.3rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  text-decoration: none;
  background: transparent;
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.textPrimary};

  &:hover {
    border-color: ${theme.colors.accent};
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  color: ${theme.colors.textTertiary};
  padding: 4rem 0;
`;
