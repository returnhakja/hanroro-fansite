import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import SetList from '@/lib/db/models/SetList';
import { getDiscographySongs } from '@/data/artistData';
import type { SetlistStatItem, SetlistStatsResponse } from '@/types/api/song';

export const dynamic = 'force-dynamic';

interface Stat {
  count: number; // 등장한 공연 수
  openings: number; // 오프닝(첫 곡)이었던 횟수
  finales: number; // 피날레(마지막 곡)였던 횟수
  albumImageUrl: string | null;
}

function tagFor(s: Stat, totalShows: number): string {
  if (totalShows > 0 && s.count === totalShows) return '매 공연';
  if (s.count > 0 && s.finales / s.count >= 0.4) return '피날레 단골';
  if (s.count > 0 && s.openings / s.count >= 0.4) return '오프닝 단골';
  if (totalShows > 0 && s.count / totalShows >= 0.6) return '셋리스트 단골';
  return '';
}

async function getSetlistStats(): Promise<SetlistStatsResponse> {
  await connectDB();

  const setlists = await SetList.find({}, 'songs').lean();
  const totalShows = setlists.length;

  // 디스코그래피에서 앨범명/커버 보강용 룩업
  const catalog = new Map(
    getDiscographySongs().map((d) => [d.title, d])
  );

  const stats = new Map<string, Stat>();

  for (const sl of setlists) {
    const songs = sl.songs ?? [];
    if (songs.length === 0) continue;

    // 이 공연의 오프닝/피날레 곡
    let opener = songs[0];
    let finale = songs[0];
    for (const song of songs) {
      if (song.order < opener.order) opener = song;
      if (song.order > finale.order) finale = song;
    }

    // 곡 등장은 공연당 1회로 카운트
    const seen = new Set<string>();
    for (const song of songs) {
      let st = stats.get(song.title);
      if (!st) {
        st = { count: 0, openings: 0, finales: 0, albumImageUrl: null };
        stats.set(song.title, st);
      }
      if (!seen.has(song.title)) {
        st.count += 1;
        seen.add(song.title);
      }
      if (!st.albumImageUrl && song.albumImageUrl) {
        st.albumImageUrl = song.albumImageUrl;
      }
    }

    const o = stats.get(opener.title);
    if (o) o.openings += 1;
    const f = stats.get(finale.title);
    if (f) f.finales += 1;
  }

  const songs: SetlistStatItem[] = Array.from(stats.entries())
    .map(([title, s]) => {
      const disc = catalog.get(title);
      return {
        songTitle: title,
        album: disc?.album ?? '',
        albumImageUrl: s.albumImageUrl ?? disc?.albumImageUrl ?? null,
        count: s.count,
        pct: totalShows > 0 ? Math.round((s.count / totalShows) * 100) : 0,
        tag: tagFor(s, totalShows),
      };
    })
    .sort((a, b) => b.count - a.count);

  return { songs, totalShows };
}

// GET /api/songs/setlist-stats - 무대에서 가장 많이 부른 곡 (공개)
export async function GET() {
  try {
    const data = await getSetlistStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error('셋리스트 집계 오류:', error);
    return NextResponse.json(
      { error: '셋리스트 집계를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
