export type GameDifficulty = 'easy' | 'normal' | 'hard';

export const DIFFICULTY_SECONDS: Record<GameDifficulty, number> = {
  easy: 10,
  normal: 5,
  hard: 3,
};

export const DIFFICULTY_LABEL: Record<GameDifficulty, string> = {
  easy: '쉬움',
  normal: '보통',
  hard: '어려움',
};

export const QUESTIONS_PER_ROUND = 10;

export function isGameDifficulty(value: unknown): value is GameDifficulty {
  return value === 'easy' || value === 'normal' || value === 'hard';
}
