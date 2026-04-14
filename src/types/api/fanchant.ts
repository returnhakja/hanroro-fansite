import type { ILyricLine } from '@/lib/db/models/Fanchant';

// ─── 팬챈트 ─────────────────────────────────────────────────────
export interface Fanchant {
  _id: string;
  songTitle: string;
  album: string;
  albumImageUrl?: string;
  order: number;
  lyrics: ILyricLine[];
}

export interface FanchantFormData {
  songTitle: string;
  album: string;
  albumImageUrl?: string;
  order: number;
  lyricsRaw: string;
}
