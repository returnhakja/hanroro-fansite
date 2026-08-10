import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import SetList, { setListShowCount } from '@/lib/db/models/SetList';
import { getDiscographySongs } from '@/data/artistData';
import type { SetlistStatItem, SetlistStatsResponse } from '@/types/api/song';

export const dynamic = 'force-dynamic';

interface Stat {
  title: string; // 화면에 보여줄 대표 제목 (처음 만난 표기를 다듬어 사용)
  count: number; // 등장한 공연 수
  openings: number; // 오프닝(첫 곡)이었던 횟수
  finales: number; // 피날레(마지막 곡)였던 횟수
  albumImageUrl: string | null;
}

/**
 * 셋리스트 곡 제목은 관리자가 공연마다 직접 입력하므로 표기가 흔들린다.
 * 실제로 같은 곡이 이렇게 쪼개져 있었다:
 *   "게임 오버 ? " / "게임 오버 ?"        (앞뒤 공백)
 *   "사랑하게 될 거야" / "사랑하게 될거야"  (중간 띄어쓰기)
 *   "당신의 밤은 나의 밤과 같습니까"        (디스코그래피는 "(feat. 숨비)" 포함)
 * 그래서 공백은 전부 무시하고 괄호 안 부가 표기도 떼고 비교한다.
 * 곡 제목이 띄어쓰기만으로 구분되는 경우는 없어서 과하게 합쳐질 위험은 없다.
 */
const normalizeTitle = (title: string) =>
  title
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // "(feat. 숨비)" 같은 부가 표기 제거
    .replace(/\s+/g, ''); // 모든 공백 제거

function tagFor(s: Stat, totalShows: number): string {
  if (totalShows > 0 && s.count === totalShows) return '매 공연';
  if (s.count > 0 && s.finales / s.count >= 0.4) return '피날레 단골';
  if (s.count > 0 && s.openings / s.count >= 0.4) return '오프닝 단골';
  if (totalShows > 0 && s.count / totalShows >= 0.6) return '셋리스트 단골';
  return '';
}

async function getSetlistStats(): Promise<SetlistStatsResponse> {
  await connectDB();

  const setlists = await SetList.find({}, 'songs day endDay').lean();

  // 이틀 이상 같은 셋리스트로 공연한 경우 문서는 1개지만 공연은 여러 번이다
  const totalShows = setlists.reduce(
    (sum, sl) => sum + setListShowCount(sl),
    0
  );

  // 디스코그래피에서 앨범명/커버 보강용 룩업 (키는 정규화된 제목)
  const catalog = new Map(
    getDiscographySongs().map((d) => [normalizeTitle(d.title), d])
  );

  const stats = new Map<string, Stat>();

  for (const sl of setlists) {
    const songs = sl.songs ?? [];
    if (songs.length === 0) continue;

    // 이 셋리스트로 공연한 횟수 (이틀 동일 셋리스트면 2회 부른 셈)
    const shows = setListShowCount(sl);

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
      const key = normalizeTitle(song.title);
      let st = stats.get(key);
      if (!st) {
        st = {
          title: song.title.trim(),
          count: 0,
          openings: 0,
          finales: 0,
          albumImageUrl: null,
        };
        stats.set(key, st);
      }
      if (!seen.has(key)) {
        st.count += shows;
        seen.add(key);
      }
      if (!st.albumImageUrl && song.albumImageUrl) {
        st.albumImageUrl = song.albumImageUrl;
      }
    }

    const o = stats.get(normalizeTitle(opener.title));
    if (o) o.openings += shows;
    const f = stats.get(normalizeTitle(finale.title));
    if (f) f.finales += shows;
  }

  const songs: SetlistStatItem[] = Array.from(stats.entries())
    .map(([key, s]) => {
      const disc = catalog.get(key);
      return {
        // 디스코그래피에 있으면 공식 표기를 우선 사용
        songTitle: disc?.title ?? s.title,
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
