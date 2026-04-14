// ─── 일정/이벤트 ─────────────────────────────────────────────────
export interface Event {
  _id: string;
  title: string;
  date: string;
  time?: string;
  place?: string;
  posterUrl?: string;
  type: 'concert' | 'award' | 'broadcast' | 'other' | 'festival' | 'fanmeeting';
  isPinned: boolean;
}

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  place: string;
  posterUrl: string;
  type: Event['type'];
}
