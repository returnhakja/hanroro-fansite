// ─── 공연/셋리스트 ───────────────────────────────────────────────
export interface Song {
  title: string;
  albumImageUrl?: string;
  order: number;
}

export interface SetList {
  _id: string;
  concertId?: string;
  /** 시작 일차 */
  day: number;
  /** 시작 날짜 */
  date: string;
  /** 여러 날 동일한 셋리스트일 때만 존재 */
  endDay?: number;
  endDate?: string;
  songs: Song[];
}

export interface Concert {
  _id: string;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  posterUrl?: string;
  isActive: boolean;
  setlists?: SetList[];
}

export interface ActiveSetlistData {
  concert: Concert | null;
  setlists: SetList[];
}
