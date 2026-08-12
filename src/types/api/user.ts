// ─── 마이페이지 ─────────────────────────────────────────────────
export interface AttendedConcert {
  _id: string;
  userId: string;
  sourceType: 'event' | 'concert';
  sourceId: string;
  title: string;
  venue: string;
  date: string;
  createdAt: string;
}

export interface UserStats {
  attendedCount: number;
  postCount: number;
  commentCount: number;
}
