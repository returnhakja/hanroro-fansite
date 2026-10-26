import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import RhythmChart from '@/lib/db/models/RhythmChart';

// GET /api/game/rhythm/charts/[id] - 플레이 시작용 단건 조회(노트 전체 포함, 활성화된 곡만)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    await connectDB();
    const chart = await RhythmChart.findOne({ _id: id, isActive: true }).lean();
    if (!chart) {
      return NextResponse.json({ error: '곡을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({
      chart: {
        _id: (chart._id as { toString(): string }).toString(),
        title: chart.title,
        youtubeId: chart.youtubeId,
        startSeconds: chart.startSeconds,
        bpm: chart.bpm,
        offsetMs: chart.offsetMs,
        difficulty: chart.difficulty,
        notes: chart.notes,
      },
    });
  } catch (error) {
    console.error('리듬게임 차트 조회 오류:', error);
    return NextResponse.json(
      { error: '차트를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
