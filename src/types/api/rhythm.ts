export interface RhythmChartSummary {
  _id: string;
  title: string;
  youtubeId: string;
  startSeconds: number;
  bpm: number;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface RhythmNote {
  lane: number;
  timeMs: number;
}

export interface RhythmChartDetail {
  _id: string;
  title: string;
  youtubeId: string;
  startSeconds: number;
  bpm: number;
  offsetMs: number;
  difficulty: 'easy' | 'normal' | 'hard';
  notes: RhythmNote[];
}

export interface RhythmSubmitResponse {
  resultId: string;
}

export interface RhythmRankingRow {
  rank: number;
  resultId: string;
  nickname: string;
  score: number;
  maxCombo: number;
  isMe: boolean;
}
