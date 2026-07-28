'use client';

import styled, { keyframes } from 'styled-components';
import { theme } from '@/styles/theme';

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const barGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

export const PageWrapper = styled.main`
  min-height: 100vh;
  background: ${theme.colors.background};
  padding: 7.5rem 1.5rem 5rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 6rem 1rem 4rem;
  }
`;

export const Inner = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

export const PageHeader = styled.header`
  margin-bottom: 2.25rem;
`;

export const Overline = styled.p`
  font-family: ${theme.typography.fontBody};
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accentDark};
  margin: 0 0 0.75rem;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 2.25rem;
  font-weight: 400;
  line-height: 1.2;
  color: ${theme.colors.textPrimary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.85rem;
  }
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: ${theme.typography.fontBody};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${theme.colors.error};
`;

export const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${theme.colors.error};
  box-shadow: 0 0 8px ${theme.colors.error};
  animation: ${blink} 1.6s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Subtitle = styled.p`
  font-family: ${theme.typography.fontBody};
  font-size: 0.95rem;
  color: ${theme.colors.textSecondary};
  margin: 0.9rem 0 0;
`;

export const IntroCard = styled.div`
  margin-top: 1.25rem;
  padding: 0.9rem 1.1rem;
  background: ${theme.colors.surfaceAlt};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.typography.fontBody};
  font-size: 0.85rem;
  line-height: 1.6;
  color: ${theme.colors.textSecondary};

  strong {
    color: ${theme.colors.textPrimary};
    font-weight: 700;
  }
`;

export const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const Row = styled.li<{ $top: boolean; $mine: boolean }>`
  display: grid;
  grid-template-columns: 2.25rem 3.25rem 1fr auto;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  background: ${theme.colors.surface};
  border: 1px solid
    ${({ $top, $mine }) =>
      $mine
        ? theme.colors.error
        : $top
          ? theme.colors.accent
          : theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${({ $top, $mine }) =>
    $mine || $top ? theme.shadows.md : theme.shadows.sm};
  transition:
    box-shadow ${theme.transitions.normal},
    border-color ${theme.transitions.normal};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1.75rem 2.75rem 1fr auto;
    gap: 0.7rem;
    padding: 0.7rem 0.8rem;
  }
`;

export const VoteButton = styled.button<{ $mine: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  background: ${({ $mine }) => ($mine ? theme.colors.error : 'transparent')};
  border: 1px solid
    ${({ $mine }) => ($mine ? theme.colors.error : theme.colors.border)};
  color: ${({ $mine }) =>
    $mine ? theme.colors.textLight : theme.colors.textTertiary};
  transition:
    background ${theme.transitions.fast},
    color ${theme.transitions.fast},
    border-color ${theme.transitions.fast},
    transform ${theme.transitions.fast};

  &:hover {
    color: ${({ $mine }) => ($mine ? theme.colors.textLight : theme.colors.error)};
    border-color: ${theme.colors.error};
  }

  &:active {
    transform: scale(0.9);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.error};
    outline-offset: 2px;
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 2.25rem;
    height: 2.25rem;
  }
`;

export const Rank = styled.span<{ $tier: number }>`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.35rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: ${({ $tier }) =>
    $tier === 1
      ? theme.colors.accentDark
      : $tier <= 3
        ? theme.colors.accent
        : theme.colors.textTertiary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`;

export const Cover = styled.img`
  width: 3.25rem;
  height: 3.25rem;
  border-radius: ${theme.borderRadius.md};
  object-fit: cover;
  background: ${theme.colors.surfaceWarm};
  box-shadow: ${theme.shadows.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 2.75rem;
    height: 2.75rem;
  }
`;

export const Meta = styled.div`
  min-width: 0;
`;

export const SongTitle = styled.div`
  font-family: ${theme.typography.fontBody};
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

export const AlbumName = styled.div`
  font-family: ${theme.typography.fontBody};
  font-size: 0.75rem;
  color: ${theme.colors.textTertiary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.1rem;
`;

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.5rem;
`;

export const Bar = styled.div`
  flex: 1;
  height: 6px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.surfaceWarm};
  overflow: hidden;
`;

export const BarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.gradientGold};
  transform-origin: left;
  transition: width ${theme.transitions.slow};
  animation: ${barGrow} 0.7s ${theme.transitions.spring};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

export const VoteCount = styled.span`
  font-family: ${theme.typography.fontBody};
  font-size: 0.8rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  min-width: 3.5rem;
  text-align: right;
`;

export const FootNote = styled.p`
  margin-top: 1.75rem;
  font-family: ${theme.typography.fontBody};
  font-size: 0.8rem;
  color: ${theme.colors.textTertiary};
  text-align: center;
  line-height: 1.6;
`;

export const StateBox = styled.div`
  padding: 4rem 1rem;
  text-align: center;
  font-family: ${theme.typography.fontBody};
  font-size: 0.95rem;
  color: ${theme.colors.textTertiary};
`;
