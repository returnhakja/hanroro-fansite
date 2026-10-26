import styled, { keyframes } from 'styled-components';
import { theme } from '@/styles/theme';

export const PageWrapper = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  min-height: 70vh;
`;

/* ---- 인트로/곡 선택 ---- */
export const IntroCard = styled.div`
  background: ${theme.colors.surfaceAlt};
  border-radius: ${theme.borderRadius.xl};
  padding: 1.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const IntroWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`;

export const Eyebrow = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${theme.colors.accentDark};
`;

export const IntroTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.4rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

export const IntroDesc = styled.p`
  margin: 0;
  max-width: 28ch;
  font-size: 0.82rem;
  line-height: 1.6;
  color: ${theme.colors.textSecondary};
`;

export const HowToPlayBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.75rem 0.9rem;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  font-size: 0.76rem;
  color: ${theme.colors.textSecondary};
`;

export const HowToPlayRow = styled.div`
  display: flex;
  gap: 0.5rem;

  strong {
    flex: none;
    width: 44px;
    color: ${theme.colors.textPrimary};
  }
`;

export const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const SongCard = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  border: 1.5px solid ${(p) => (p.$selected ? theme.colors.accent : theme.colors.border)};
  cursor: pointer;
  text-align: left;
`;

export const SongArt = styled.div<{ $coverUrl?: string }>`
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 10px;
  background: ${(p) =>
    p.$coverUrl
      ? `url('${p.$coverUrl}') center / cover no-repeat`
      : `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%)`};
`;

export const SongInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SongTitle = styled.div`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const SongMeta = styled.div`
  font-size: 0.72rem;
  color: ${theme.colors.textTertiary};
  margin-top: 2px;
`;

export const DifficultyPill = styled.span<{ $difficulty: 'easy' | 'normal' | 'hard' }>`
  flex: none;
  font-size: 0.68rem;
  font-weight: 700;
  color: #fff;
  padding: 4px 9px;
  border-radius: 999px;
  background: ${(p) =>
    p.$difficulty === 'hard' ? theme.colors.error : p.$difficulty === 'easy' ? theme.colors.success : theme.colors.primary};
`;

export const PrimaryButton = styled.button`
  width: 100%;
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

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${theme.colors.error};
  text-align: center;
`;

/* ---- 플레이 ---- */
export const PlayWrap = styled.div`
  position: relative;
  width: 100%;
  height: 640px;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  background: linear-gradient(165deg, #241a2e 0%, #140f1c 60%, #0d0a12 100%);
  color: #fdfbf8;
  display: flex;
  flex-direction: column;
`;

export const GlowBlob = styled.div<{ $color: string; $top?: number; $left?: number; $right?: number; $bottom?: number }>`
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 9999px;
  top: ${(p) => (p.$top !== undefined ? `${p.$top}px` : 'auto')};
  left: ${(p) => (p.$left !== undefined ? `${p.$left}px` : 'auto')};
  right: ${(p) => (p.$right !== undefined ? `${p.$right}px` : 'auto')};
  bottom: ${(p) => (p.$bottom !== undefined ? `${p.$bottom}px` : 'auto')};
  background: radial-gradient(circle, ${(p) => p.$color} 0%, transparent 70%);
  pointer-events: none;
`;

export const PlayTopBar = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 0 18px;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(253, 251, 248, 0.75);
`;

export const ScoreText = styled.span`
  color: #ffd54a;
  font-size: 0.8rem;
`;


export const ProgressTrack = styled.div`
  position: relative;
  z-index: 2;
  margin: 10px 18px 0 18px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
`;

// width는 매 프레임 바뀌는 값이라 styled-components prop으로 넘기지 않는다.
// 넘기면 바뀌는 값마다 전역 스타일시트에 새 클래스가 계속 쌓여서(한 번 추가된
// 클래스는 지워지지 않음) 몇 분만 플레이해도 스타일시트가 비대해져 페이지가
// 느려지다 멈춘다. 호출부에서 style={{width}}로 직접 DOM에 꽂아야 한다.
export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #5eead4 0%, #ff6fb0 50%, #ffd54a 100%);
`;

export const ComboWrap = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
`;

export const ComboNumber = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 0 16px rgba(255, 111, 176, 0.9), 0 0 34px rgba(94, 234, 212, 0.6);
  line-height: 1;
`;

export const ComboLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #ff9ccb;
  margin-top: 2px;
`;

const flashIn = keyframes`
  0% { opacity: 0; transform: translate(-50%, 6px) scale(0.9); }
  25% { opacity: 1; transform: translate(-50%, 0) scale(1.05); }
  100% { opacity: 0; transform: translate(-50%, -10px) scale(1); }
`;

export const JudgementFlash = styled.div<{ $judgement: 'perfect' | 'great' | 'miss' }>`
  position: absolute;
  left: 50%;
  top: 46%;
  z-index: 5;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 1px;
  animation: ${flashIn} 0.5s ease-out forwards;
  color: ${(p) => (p.$judgement === 'perfect' ? '#ffefa8' : p.$judgement === 'great' ? '#a7f3eb' : '#ff9b9b')};
  text-shadow: 0 0 10px ${(p) => (p.$judgement === 'miss' ? '#c0392b' : '#ff6fb0')}, 0 0 22px rgba(255, 217, 160, 0.9);
`;

export const LaneArea = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  padding: 0 10px 20px;
`;

export const Lane = styled.div`
  position: relative;
  width: 72px;
  height: 100%;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

// top도 ProgressFill의 width와 같은 이유로 styled-components prop이 아니라
// style={{top}}으로 직접 넘겨야 한다(매 프레임 바뀌는 값 → 전역 스타일시트 누적 방지).
export const Note = styled.div<{ $from: string; $to: string; $glow: string }>`
  position: absolute;
  left: 8px;
  right: 8px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(180deg, ${(p) => p.$from} 0%, ${(p) => p.$to} 100%);
  box-shadow: 0 0 14px ${(p) => p.$glow};
`;

const burstPop = keyframes`
  0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.4); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
`;

export const HitBurst = styled.div`
  position: absolute;
  left: 50%;
  bottom: 28px;
  width: 110px;
  height: 110px;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 111, 176, 0.55) 40%,
    rgba(94, 234, 212, 0.25) 65%,
    rgba(255, 213, 74, 0) 85%
  );
  animation: ${burstPop} 0.4s ease-out forwards;
  pointer-events: none;
  z-index: 3;
`;

export const TapButton = styled.button<{ $from: string; $to: string; $glow: string; $pressed: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  height: 56px;
  border: none;
  border-radius: 12px;
  touch-action: none;
  background: ${(p) =>
    p.$pressed
      ? `linear-gradient(180deg, ${p.$from} 0%, ${p.$to} 100%)`
      : `rgba(255,255,255,0.08)`};
  box-shadow: ${(p) => (p.$pressed ? `0 0 24px ${p.$glow}` : `inset 0 0 0 1.5px rgba(255,255,255,0.18)`)};
`;

/* ---- 결과 ---- */
export const ResultWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  text-align: center;
  padding-top: 0.25rem;
`;

export const ScoreCircle = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  strong { font-size: 1.8rem; font-weight: 800; line-height: 1; }
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

export const BreakdownBox = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  box-shadow: ${theme.shadows.sm};
`;

export const BreakdownRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BreakdownLabel = styled.span<{ $color: string }>`
  width: 60px;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${(p) => p.$color};
`;

export const BreakdownTrack = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: ${theme.colors.surfaceAlt};
  overflow: hidden;
`;

export const BreakdownFill = styled.div<{ $percent: number; $color: string }>`
  width: ${(p) => p.$percent}%;
  height: 100%;
  background: ${(p) => p.$color};
`;

export const BreakdownValue = styled.span`
  width: 28px;
  text-align: right;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const NicknameRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const NicknameInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.6rem 0.8rem;
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

export const RankList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const RankRow = styled.div<{ $isMe: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.6rem;
  border-radius: ${theme.borderRadius.md};
  background: ${(p) => (p.$isMe ? theme.colors.surfaceWarm : 'transparent')};
  font-size: 0.8rem;
`;

export const ResultActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SecondaryButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
`;

export const CountdownOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 10, 18, 0.7);
  font-size: 64px;
  font-weight: 800;
  color: #ffd54a;
  text-shadow: 0 0 24px rgba(255, 213, 74, 0.8);
`;
