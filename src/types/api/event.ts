// ─── 일정/이벤트 ─────────────────────────────────────────────────
export interface TicketOutlet {
  label: string;
  url: string;
  /** 대표 예매 링크 — UI에서 채움 칩으로 강조 */
  isPrimary?: boolean;
  note?: string;
  /** 예매 오픈 시각 등 짧은 안내 (ISO 또는 표시용 문자열) */
  opensAt?: string;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  time?: string;
  /** 페스티벌 타임테이블처럼 종료 시각이 있는 경우 (선택) */
  endTime?: string;
  place?: string;
  posterUrl?: string;
  type: 'concert' | 'award' | 'broadcast' | 'other' | 'festival' | 'fanmeeting';
  isPinned: boolean;
  ticketOutlets?: TicketOutlet[];
}

export interface EventReview {
  _id: string;
  eventId: string;
  author: string;
  userId?: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
}

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  endTime: string;
  place: string;
  posterUrl: string;
  type: Event['type'];
  ticketOutlets: TicketOutlet[];
}
