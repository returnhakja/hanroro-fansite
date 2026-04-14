// ─── 공연/셋리스트 ───────────────────────────────────────────────
export interface Song {
  title: string;
  albumImageUrl?: string;
  order: number;
}

export interface SetList {
  _id: string;
  concertId?: string;
  day: number;
  date: string;
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
