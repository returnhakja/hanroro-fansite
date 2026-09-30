import styled from 'styled-components';
import Link from 'next/link';
import { theme } from '@/styles/theme';

export const HubWrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
`;

export const HubHeader = styled.div`
  text-align: center;
  margin-bottom: 1.75rem;
`;

export const HubTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.6rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.4rem;
`;

export const HubSub = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
`;

export const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const GameCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.5rem 1.25rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  text-decoration: none;
  color: inherit;
  transition: transform ${theme.transitions.normal}, box-shadow ${theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

export const GameIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.surfaceWarm};
  color: ${theme.colors.primary};

  svg { width: 24px; height: 24px; }
`;

export const GameName = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const GameDesc = styled.p`
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${theme.colors.textSecondary};
`;
