import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import RhythmResult from '@/lib/db/models/RhythmResult';
import RhythmChart from '@/lib/db/models/RhythmChart';

// GET /api/admin/game/rhythm/results - 최근 결과 조회(어뷰징 관리용, 최신 200건까지만)
async function handleGet() {
  try {
    await connectDB();
    const [results, totalCount] = await Promise.all([
      RhythmResult.find().sort({ createdAt: -1 }).limit(200).lean(),
      RhythmResult.countDocuments(),
    ]);

    const chartIds = [...new Set(results.map((r) => r.chartId.toString()))];
    const charts = await RhythmChart.find({ _id: { $in: chartIds } }).select('title').lean();
    const titleById = new Map(charts.map((c) => [(c._id as { toString(): string }).toString(), c.title]));

    return NextResponse.json({
      results: results.map((r) => ({
        _id: (r._id as { toString(): string }).toString(),
        chartTitle: titleById.get(r.chartId.toString()) ?? '(삭제된 곡)',
        nickname: r.nickname,
        score: r.score,
        maxCombo: r.maxCombo,
        perfectCount: r.perfectCount,
        greatCount: r.greatCount,
        missCount: r.missCount,
        createdAt: r.createdAt,
      })),
      totalCount,
    });
  } catch (error) {
    console.error('리듬게임 결과 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '결과 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
