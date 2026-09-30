import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const RankTabs = styled.div`
  display: flex;
  gap: 0.4rem;
  padding: 4px;
  background: ${theme.colors.surfaceAlt};
  border-radius: ${theme.borderRadius.lg};
`;

export const RankTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.5rem 0;
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${(p) => (p.$active ? theme.colors.surface : 'transparent')};
  color: ${(p) => (p.$active ? theme.colors.textPrimary : theme.colors.textSecondary)};
  box-shadow: ${(p) => (p.$active ? theme.shadows.sm : 'none')};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
`;

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

  span { color: ${theme.colors.textTertiary}; font-weight: 500; }
`;

export const RankTime = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textTertiary};
  width: 44px;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const RankEmpty = styled.p`
  margin: auto;
  font-size: 0.85rem;
  color: ${theme.colors.textTertiary};
`;
