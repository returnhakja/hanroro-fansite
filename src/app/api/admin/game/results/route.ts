import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import GameResult from '@/lib/db/models/GameResult';

// GET /api/admin/game/results - 최근 게임 결과 목록 (모더레이션용)
async function handleGet() {
  try {
    await connectDB();
    const results = await GameResult.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json({
      results: results.map((r) => ({
        _id: (r._id as { toString(): string }).toString(),
        nickname: r.nickname,
        difficulty: r.difficulty,
        score: r.score,
        elapsedMs: r.elapsedMs,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('게임 결과 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '결과 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
