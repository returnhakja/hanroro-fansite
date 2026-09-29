import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import GameResult from '@/lib/db/models/GameResult';

// GET /api/game/result/[id] - 결과 공유 페이지용 단건 조회
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
    const result = await GameResult.findById(id).lean();
    if (!result) {
      return NextResponse.json({ error: '결과를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({
      result: {
        _id: (result._id as { toString(): string }).toString(),
        nickname: result.nickname,
        difficulty: result.difficulty,
        score: result.score,
        elapsedMs: result.elapsedMs,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error('게임 결과 조회 오류:', error);
    return NextResponse.json(
      { error: '결과를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
