export const RHYTHM_LANE_COUNT = 4;

export const RHYTHM_LANE_KEYS = ['d', 'f', 'j', 'k'];

export const RHYTHM_LANE_COLORS = [
  { from: '#A7F3EB', to: '#2DD4BF', glow: 'rgba(45,212,191,0.75)' },
  { from: '#FFC2E2', to: '#FF4FA3', glow: 'rgba(255,79,163,0.8)' },
  { from: '#D9C9FF', to: '#9B6DFF', glow: 'rgba(155,109,255,0.75)' },
  { from: '#FFEBA8', to: '#FFC737', glow: 'rgba(255,199,55,0.75)' },
] as const;

// 노트가 화면 상단에서 판정선까지 떨어지는 데 걸리는 시간
export const RHYTHM_NOTE_TRAVEL_MS = 1800;

// 판정 윈도우 (판정 시각과 눌린 시각의 차이, ms)
export const RHYTHM_PERFECT_WINDOW_MS = 60;
export const RHYTHM_GREAT_WINDOW_MS = 140;
// 이 범위를 넘기면 MISS. 노트가 판정선을 지나고도 안 눌리면 자동 MISS.
export const RHYTHM_MISS_WINDOW_MS = 220;

export const RHYTHM_SCORE_PER_HIT = { perfect: 100, great: 60, miss: 0 } as const;

export type RhythmJudgement = 'perfect' | 'great' | 'miss';

export type RhythmDifficultyValue = 'easy' | 'normal' | 'hard';

export const RHYTHM_DIFFICULTY_LABEL: Record<RhythmDifficultyValue, string> = {
  easy: '쉬움',
  normal: '보통',
  hard: '어려움',
};

export function isRhythmDifficulty(value: unknown): value is RhythmDifficultyValue {
  return value === 'easy' || value === 'normal' || value === 'hard';
}
