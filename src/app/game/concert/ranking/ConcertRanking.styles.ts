import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const RankList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
`;

export const RankRow = styled.div<{ $isMe: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.75rem;
  border-radius: ${theme.borderRadius.md};
  background: ${(p) => (p.$isMe ? theme.colors.surfaceWarm : 'transparent')};
`;

export const RankNo = styled.span<{ $top1: boolean }>`
  width: 22px;
  font-size: 0.82rem;
  font-weight: 700;
  color: ${(p) => (p.$top1 ? theme.colors.accentDark : theme.colors.textTertiary)};
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

export const RankName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RankScore = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;

  span { color: ${theme.colors.textTertiary}; font-weight: 500; font-size: 0.72rem; }
`;

export const RankEmpty = styled.p`
  margin: auto;
  font-size: 0.85rem;
  color: ${theme.colors.textTertiary};
`;
