import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const PageWrapper = styled.div`
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

export const IntroWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
`;

export const IntroTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.4rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

export const IntroDesc = styled.p`
  margin: 0;
  max-width: 26ch;
  font-size: 0.85rem;
  line-height: 1.6;
  color: ${theme.colors.textSecondary};
`;

export const TargetBadge = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: ${theme.colors.surfaceWarm};
  color: ${theme.colors.primary};
  font-variant-numeric: tabular-nums;
`;

export const PrimaryButton = styled.button`
  padding: 0.9rem 1.6rem;
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

export const SecondaryLink = styled.a`
  display: block;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-decoration: none;

  &:hover { color: ${theme.colors.primary}; }
`;

/* ---- 플레이 화면 ---- */
export const PlayWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.75rem;
`;

export const StopwatchDisplay = styled.div`
  font-family: ${theme.typography.fontHeading};
  font-size: 3.4rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
`;

export const StopButton = styled.button`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${theme.shadows.md};

  &:active { transform: scale(0.96); }
`;

/* ---- 결과 화면 ---- */
export const ResultWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
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

export const ResultStopwatch = styled.div`
  font-family: ${theme.typography.fontHeading};
  font-size: 2.6rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

export const ResultDiff = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};

  b { color: ${theme.colors.primary}; font-weight: 700; }
`;

export const TimeoutBadge = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${theme.colors.error};
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

export const RetryButton = styled.button`
  padding: 0.7rem 1.4rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${theme.colors.error};
  text-align: center;
`;
