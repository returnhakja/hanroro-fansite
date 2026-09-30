import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import LorosiResult from '@/lib/db/models/LorosiResult';
import { ROROSI_TARGET_MS, ROROSI_TIMEOUT_MS } from '@/lib/game/rorosi';

const VOTER_COOKIE = 'vid';
const ONE_YEAR = 60 * 60 * 24 * 365;

// POST /api/game/rorosi/submit - 스톱워치를 멈춘 시각(ms)을 받아 오차를 기록한다.
// 클라이언트가 측정한 시간을 그대로 신뢰하는 캐주얼 게임(정밀 부정행위 방지는 하지 않음).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const elapsedMs = body.elapsedMs;

    if (typeof elapsedMs !== 'number' || elapsedMs < 0 || elapsedMs > ROROSI_TIMEOUT_MS + 500) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const diffMs = Math.abs(elapsedMs - ROROSI_TARGET_MS);

    let voterId = request.cookies.get(VOTER_COOKIE)?.value;
    const isNewVoter = !voterId;
    if (!voterId) voterId = crypto.randomUUID();

    await connectDB();
    const doc = await LorosiResult.create({
      voterId,
      nickname: '익명',
      elapsedMs,
      diffMs,
    });

    const res = NextResponse.json({
      resultId: doc._id.toString(),
      elapsedMs,
      diffMs,
    });
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
    console.error('로로시 게임 기록 오류:', error);
    return NextResponse.json(
      { error: '기록하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
