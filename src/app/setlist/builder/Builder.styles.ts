import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  max-width: 920px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 6rem 1.25rem 4rem;
  }
`;

export const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.5rem;
`;

export const PageSubtitle = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0 0 2rem;
`;

export const BuilderFrame = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
`;

export const BuilderTopbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.borderLight};
`;

export const CountPill = styled.span<{ $full: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ $full }) => ($full ? theme.colors.error : theme.colors.accentDark)};
  background: ${theme.colors.surfaceAlt};
  border: 1px solid ${theme.colors.border};
  padding: 0.3rem 0.7rem;
  border-radius: ${theme.borderRadius.full};
`;

export const Panes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const Pane = styled.div<{ $alt?: boolean }>`
  padding: 1.1rem 1.35rem 1.4rem;
  background: ${({ $alt }) => ($alt ? theme.colors.surfaceAlt : 'transparent')};
  border-left: ${({ $alt }) => ($alt ? `1px solid ${theme.colors.borderLight}` : 'none')};

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-left: none;
    border-top: ${({ $alt }) => ($alt ? `1px solid ${theme.colors.borderLight}` : 'none')};
  }
`;

export const PaneLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.textTertiary};
  margin-bottom: 0.75rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.9rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  font-size: 0.85rem;
  font-family: ${theme.typography.fontBody};
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.85rem;

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

export const SongList = styled.div`
  max-height: 360px;
  overflow-y: auto;
`;

export const SongRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.15rem;
  border-bottom: 1px solid ${theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

export const SongSwatch = styled.div<{ $cover: string }>`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  flex-shrink: 0;
  /* 파일명에 공백 등이 섞여 있으면 url() 안에서 값이 깨지므로 인코딩해서 넣는다 */
  background-image: url(${({ $cover }) => encodeURI($cover)});
  background-size: cover;
  background-position: center;
  background-color: ${theme.colors.surfaceWarm};
`;

export const SongTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RoundButton = styled.button<{ $disabled?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  color: ${({ $disabled }) => ($disabled ? theme.colors.textTertiary : theme.colors.primary)};
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

export const PickList = styled.div`
  min-height: 120px;
`;

export const PickRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.15rem;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const PickNum = styled.span`
  font-family: ${theme.typography.fontHeading};
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.accentDark};
  width: 1.2rem;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
`;

export const PickTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ReorderGroup = styled.span`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex-shrink: 0;
`;

export const TinyButton = styled.button<{ $disabled?: boolean }>`
  background: none;
  border: none;
  color: ${({ $disabled }) => ($disabled ? theme.colors.borderLight : theme.colors.textTertiary)};
  font-size: 0.7rem;
  line-height: 1;
  padding: 1px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};

  &:hover:not(:disabled) {
    color: ${theme.colors.accentDark};
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textTertiary};
  font-size: 0.9rem;
  flex-shrink: 0;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.error};
  }
`;

export const EmptyPick = styled.p`
  font-size: 0.82rem;
  color: ${theme.colors.textTertiary};
  text-align: center;
  padding: 2rem 0.5rem;
  line-height: 1.7;
`;

export const FinishButton = styled.button`
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: 0.7rem;
  border-radius: ${theme.borderRadius.full};
  border: none;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${theme.shadows.sm};
  transition: background ${theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
