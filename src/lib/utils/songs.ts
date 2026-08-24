import { artistData } from '@/data/artistData';

export interface DiscographySong {
  title: string;
  albumId: string;
  albumTitle: string;
  coverUrl: string;
}

/**
 * 앨범 목록을 곡 단위로 펼친다. 수록곡이 따로 없는 앨범(싱글)은 앨범 제목이
 * 곧 곡 제목이다. 클라이언트(곡 선택 UI)와 서버(세트리스트 유효성 검증)
 * 양쪽에서 같은 목록을 써야 하므로 여기 한 곳에서만 계산한다.
 */
export function getAllSongs(): DiscographySong[] {
  const songs: DiscographySong[] = [];
  const seen = new Set<string>();

  for (const album of artistData.albums) {
    const titles = album.tracks.length > 0 ? album.tracks.map((t) => t.title) : [album.title];

    for (const title of titles) {
      if (seen.has(title)) continue;
      seen.add(title);
      songs.push({ title, albumId: album.id, albumTitle: album.title, coverUrl: album.coverUrl });
    }
  }

  return songs;
}

export function isValidSongTitle(title: string): boolean {
  return getAllSongs().some((song) => song.title === title);
}
