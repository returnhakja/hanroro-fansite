export interface RorosiSubmitResponse {
  resultId: string;
  elapsedMs: number;
  diffMs: number;
}

export interface RorosiRankingRow {
  rank: number;
  resultId: string;
  nickname: string;
  elapsedMs: number;
  diffMs: number;
  isMe: boolean;
}

export interface RorosiResultDetail {
  _id: string;
  nickname: string;
  elapsedMs: number;
  diffMs: number;
  createdAt: string;
}
