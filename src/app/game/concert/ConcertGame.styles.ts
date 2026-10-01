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

/* ---- 인트로 ---- */
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
  max-width: 28ch;
  font-size: 0.85rem;
  line-height: 1.6;
  color: ${theme.colors.textSecondary};
`;

export const TeaserBox = styled.div`
  width: 100%;
  height: 150px;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #fff;

  strong { font-size: 0.85rem; font-weight: 700; }
  span { font-size: 0.72rem; color: rgba(255, 255, 255, 0.85); }
`;

export const TargetBadge = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: ${theme.colors.surfaceWarm};
  color: ${theme.colors.primary};
`;

export const PrimaryButton = styled.button`
  width: 100%;
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

/* ---- 플레이 ---- */
export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: ${theme.colors.surfaceWarm};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  width: ${(p) => p.$percent}%;
  height: 100%;
  border-radius: 999px;
  background: ${theme.colors.accent};
  transition: width 0.25s ease;
`;

export const QuestionImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 200px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.textPrimary} url(${(p) => p.$src}) center / cover no-repeat;
`;

export const Credit = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.7rem;
  color: ${theme.colors.textTertiary};
  text-align: right;
`;

export const QuestionCard = styled.div`
  background: ${theme.colors.surfaceAlt};
  border-radius: ${theme.borderRadius.lg};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const QuestionLabel = styled.p`
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${theme.colors.textSecondary};
`;

export const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`;

export const ChoiceButton = styled.button<{ $selected: boolean }>`
  padding: 0.7rem 0.4rem;
  border-radius: ${theme.borderRadius.md};
  border: 1.5px solid ${(p) => (p.$selected ? theme.colors.accent : theme.colors.border)};
  background: ${(p) => (p.$selected ? theme.colors.surfaceWarm : theme.colors.surface)};
  color: ${(p) => (p.$selected ? theme.colors.primaryDark : theme.colors.textPrimary)};
  font-size: 0.78rem;
  font-weight: ${(p) => (p.$selected ? 700 : 600)};
  cursor: pointer;
`;

export const NextButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.primary};
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ---- 결과 ---- */
export const ResultWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
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

export const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  strong { font-size: 2rem; font-weight: 800; line-height: 1; }
  span { font-size: 0.72rem; margin-top: 0.2rem; color: rgba(255, 255, 255, 0.85); }
`;

export const GradeBadge = styled.span`
  font-size: 0.85rem;
  font-weight: 800;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background: ${theme.colors.surfaceWarm};
  color: ${theme.colors.accentDark};
`;

export const BreakdownText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 160px;
  overflow-y: auto;
`;

export const ReviewItem = styled.div`
  background: ${theme.colors.surfaceAlt};
  border-radius: ${theme.borderRadius.md};
  padding: 0.65rem 0.8rem;
  font-size: 0.78rem;
  color: ${theme.colors.textPrimary};
  line-height: 1.5;

  b { color: ${theme.colors.primary}; font-weight: 700; }
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
