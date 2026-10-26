import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import RhythmChart from '@/lib/db/models/RhythmChart';

// GET /api/game/rhythm/charts - 활성화된(= 박자맵 작업이 끝난) 곡 목록(곡 선택 화면용)
export async function GET() {
  try {
    await connectDB();
    const charts = await RhythmChart.find({ isActive: true })
      .select('title youtubeId startSeconds bpm difficulty')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      charts: charts.map((c) => ({
        _id: (c._id as { toString(): string }).toString(),
        title: c.title,
        youtubeId: c.youtubeId,
        startSeconds: c.startSeconds,
        bpm: c.bpm,
        difficulty: c.difficulty,
      })),
    });
  } catch (error) {
    console.error('리듬게임 곡 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '곡 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
