import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import RhythmChart from '@/lib/db/models/RhythmChart';
import RhythmResult from '@/lib/db/models/RhythmResult';

const VOTER_COOKIE = 'vid';
const ONE_YEAR = 60 * 60 * 24 * 365;

// POST /api/game/rhythm/submit - 판정 결과를 그대로 신뢰해서 기록한다.
// 로로시 게임과 같은 캐주얼 게임 트러스트 모델(클라이언트 판정 신뢰, 정밀 부정행위 방지는 안 함).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { chartId, score, maxCombo, perfectCount, greatCount, missCount } = body;

    if (
      typeof chartId !== 'string' ||
      !mongoose.Types.ObjectId.isValid(chartId) ||
      typeof score !== 'number' ||
      score < 0 ||
      typeof maxCombo !== 'number' ||
      maxCombo < 0 ||
      typeof perfectCount !== 'number' ||
      perfectCount < 0 ||
      typeof greatCount !== 'number' ||
      greatCount < 0 ||
      typeof missCount !== 'number' ||
      missCount < 0
    ) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    await connectDB();
    const chart = await RhythmChart.findOne({ _id: chartId, isActive: true }).select('_id').lean();
    if (!chart) {
      return NextResponse.json({ error: '곡을 찾을 수 없습니다' }, { status: 404 });
    }

    let voterId = request.cookies.get(VOTER_COOKIE)?.value;
    const isNewVoter = !voterId;
    if (!voterId) voterId = crypto.randomUUID();

    const doc = await RhythmResult.create({
      chartId,
      voterId,
      nickname: '익명',
      score,
      maxCombo,
      perfectCount,
      greatCount,
      missCount,
    });

    const res = NextResponse.json({ resultId: doc._id.toString() });
    if (isNewVoter) {
      res.cookies.set(VOTER_COOKIE, voterId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: ONE_YEAR,
        path: '/',
      });
    }
    return res;
  } catch (error) {
    console.error('리듬게임 결과 저장 오류:', error);
    return NextResponse.json(
      { error: '결과를 저장하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
