import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import SongTally from '@/lib/db/models/SongTally';
import { getDiscographySongs } from '@/data/artistData';
import type { SongChartItem, SongChartResponse } from '@/types/api/song';

// 투표 결과가 즉시 반영되도록 매 요청마다 최신 집계를 계산한다.
// (곡 카탈로그는 정적, 득표수는 SongTally find 1회 — 부하가 작아 캐시 없이도 충분)
export const dynamic = 'force-dynamic';

async function getSongChart(): Promise<SongChartResponse> {
  await connectDB();

  const catalog = getDiscographySongs();
  const tallies = await SongTally.find({}, 'songTitle count').lean();

  const countMap = new Map(tallies.map((t) => [t.songTitle, t.count ?? 0]));

  const songs: SongChartItem[] = catalog
    .map((s) => ({
      songTitle: s.title,
      album: s.album,
      albumImageUrl: s.albumImageUrl,
      count: countMap.get(s.title) ?? 0,
    }))
    // 득표순, 동점이면 디스코그래피 순서(최신순) 유지
    .sort((a, b) => b.count - a.count);

  const totalVotes = songs.reduce((sum, s) => sum + s.count, 0);

  return { songs, totalVotes, updatedAt: new Date().toISOString() };
}

// GET /api/songs/chart - 팬 최애곡 실시간 차트 (공개)
export async function GET() {
  try {
    const data = await getSongChart();
    return NextResponse.json(data);
  } catch (error) {
    console.error('곡 차트 조회 오류:', error);
    return NextResponse.json(
      { error: '곡 차트를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
