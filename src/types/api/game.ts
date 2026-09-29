export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface GameClip {
  youtubeId: string;
  startSeconds: number;
}

export interface GameRoundResponse {
  roundToken: string;
  seconds: number;
  clips: GameClip[];
}

export interface GameQuestionResult {
  answer: string;
  correct: boolean;
}

export interface GameSubmitResponse {
  resultId: string;
  score: number;
  results: GameQuestionResult[];
}

export interface GameRankingRow {
  rank: number;
  resultId: string;
  nickname: string;
  score: number;
  elapsedMs: number;
  isMe: boolean;
}

export interface GameResultDetail {
  _id: string;
  nickname: string;
  difficulty: GameDifficulty;
  score: number;
  elapsedMs: number;
  createdAt: string;
}
