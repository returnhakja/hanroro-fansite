import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const GamePageWrapper = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
  min-height: 70vh;
`;

export const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 420px;
`;

/* ---- 난이도 선택 ---- */
export const DiffIntro = styled.div`
  text-align: center;
`;

export const DiffTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 0.3rem;
  color: ${theme.colors.textPrimary};
`;

export const DiffSub = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
`;

export const DiffList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const DiffCard = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: ${theme.borderRadius.lg};
  border: 1.5px solid ${(p) => (p.$selected ? theme.colors.primary : theme.colors.border)};
  background: ${(p) => (p.$selected ? theme.colors.surfaceWarm : theme.colors.surface)};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
`;

export const DiffInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const DiffName = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const DiffDesc = styled.span`
  font-size: 0.78rem;
  color: ${theme.colors.textTertiary};
`;

export const DiffSeconds = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  white-space: nowrap;
`;

export const PrimaryButton = styled.button`
  padding: 0.9rem;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.primary};
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;

  &:hover { background: ${theme.colors.primaryDark}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ---- 진행/플레이 ---- */
export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TopBarLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

export const QuitLink = styled.button`
  border: none;
  background: none;
  font-size: 0.78rem;
  color: ${theme.colors.textTertiary};
  cursor: pointer;
`;

export const ProgressTrack = styled.div`
  display: flex;
  gap: 4px;
`;

export const ProgressSeg = styled.span<{ $state: 'done' | 'current' | 'upcoming' }>`
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: ${(p) =>
    p.$state === 'done'
      ? theme.colors.accent
      : p.$state === 'current'
        ? theme.colors.primary
        : theme.colors.border};
`;

export const PlayCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  text-align: center;
`;

export const PlayOrb = styled.div<{ $playing: boolean }>`
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.md};

  &::before, &::after {
    content: "";
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 1.5px solid ${theme.colors.accent};
    opacity: 0;
    animation: ${(p) => (p.$playing ? 'pulse-ring 2.2s ease-out infinite' : 'none')};
  }
  &::after { animation-delay: 1.1s; }

  @keyframes pulse-ring {
    0% { opacity: 0.55; transform: scale(0.92); }
    100% { opacity: 0; transform: scale(1.35); }
  }

  svg { width: 40px; height: 40px; color: #fff; }
`;

export const PlayStatus = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
`;

export const GuessForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const GuessRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const GuessInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  font-size: 0.9rem;
  font-family: inherit;

  &:focus { outline: none; border-color: ${theme.colors.primary}; }
`;

export const SubmitButton = styled.button`
  flex: none;
  padding: 0 1.1rem;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.primary};
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const HintText = styled.p`
  margin: 0;
  font-size: 0.72rem;
  color: ${theme.colors.textTertiary};
  text-align: center;
`;

/* ---- 정답 확인 ---- */
export const FeedbackCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  text-align: center;
`;

export const ResultBadge = styled.div<{ $correct: boolean }>`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => (p.$correct ? '#EAF2EA' : '#FBEAEA')};
  color: ${(p) => (p.$correct ? theme.colors.success : theme.colors.error)};

  svg { width: 32px; height: 32px; }
`;

export const FeedbackTitle = styled.h2`
  margin: 0;
  font-family: ${theme.typography.fontHeading};
  font-size: 1.2rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const FeedbackAnswer = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};

  b { color: ${theme.colors.textPrimary}; font-weight: 700; }
`;

/* ---- 최종 결과 ---- */
export const ResultHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
  padding-top: 0.5rem;
`;

export const ResultEyebrow = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.accentDark};
`;

export const ResultScore = styled.div`
  font-family: ${theme.typography.fontHeading};
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  color: ${theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;

  span { font-size: 1.4rem; color: ${theme.colors.textTertiary}; font-weight: 500; }
`;

export const ResultTime = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

export const ResultCard = styled.div`
  background: ${theme.colors.surfaceWarm};
  border-radius: ${theme.borderRadius.lg};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const NicknameLabel = styled.span`
  font-size: 0.78rem;
  color: ${theme.colors.textSecondary};
`;

export const NicknameRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const NicknameInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.65rem 0.8rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 0.85rem;
  font-family: inherit;

  &:focus { outline: none; border-color: ${theme.colors.primary}; }
`;

export const RegisterButton = styled.button`
  flex: none;
  padding: 0 1rem;
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary};
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const RegisteredNote = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: ${theme.colors.success};
  font-weight: 600;
`;

export const ResultActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const RankLink = styled.a`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.textPrimary};
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${theme.colors.error};
  text-align: center;
`;
