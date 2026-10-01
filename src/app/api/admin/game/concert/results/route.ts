import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import ConcertGameResult from '@/lib/db/models/ConcertGameResult';

// GET /api/admin/game/concert/results - 전체 랭킹 기록 조회(어뷰징 관리용)
async function handleGet() {
  try {
    await connectDB();
    const results = await ConcertGameResult.find().sort({ createdAt: -1 }).limit(200).lean();

    return NextResponse.json({
      results: results.map((r) => ({
        _id: (r._id as { toString(): string }).toString(),
        nickname: r.nickname,
        score: r.score,
        dateCorrectCount: r.dateCorrectCount,
        venueCorrectCount: r.venueCorrectCount,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('공연 맞추기 결과 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '결과 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
