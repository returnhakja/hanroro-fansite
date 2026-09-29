import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import GameResult from '@/lib/db/models/GameResult';
import { verifyRoundToken } from '@/lib/game/roundToken';
import { isLenientMatch } from '@/lib/utils/gameMatch';

const VOTER_COOKIE = 'vid';
const ONE_YEAR = 60 * 60 * 24 * 365;

// POST /api/game/submit - 라운드 토큰을 검증하고 서버가 보관한 정답과 비교해 채점한다.
// 정답은 이 시점(라운드 종료) 전까지 클라이언트에 노출되지 않는다.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { roundToken, elapsedMs } = body;
    const guesses: unknown = body.guesses;
    const nicknameInput = typeof body.nickname === 'string' ? body.nickname.trim() : '';

    if (typeof roundToken !== 'string' || !Array.isArray(guesses)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    if (typeof elapsedMs !== 'number' || elapsedMs < 0) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const payload = verifyRoundToken(roundToken);
    if (!payload) {
      return NextResponse.json(
        { error: '라운드가 만료되었거나 유효하지 않아요. 다시 시작해주세요.' },
        { status: 410 }
      );
    }
    if (guesses.length !== payload.songs.length) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const results = payload.songs.map((answer, i) => {
      const guess = typeof guesses[i] === 'string' ? (guesses[i] as string) : '';
      const correct = isLenientMatch(guess, answer);
      return { answer, correct };
    });
    const score = results.filter((r) => r.correct).length;

    const nickname = nicknameInput ? nicknameInput.slice(0, 8) : '익명';

    let voterId = request.cookies.get(VOTER_COOKIE)?.value;
    const isNewVoter = !voterId;
    if (!voterId) voterId = crypto.randomUUID();

    await connectDB();
    const doc = await GameResult.create({
      voterId,
      nickname,
      difficulty: payload.difficulty,
      score,
      elapsedMs,
    });

    const res = NextResponse.json({
      resultId: doc._id.toString(),
      score,
      results,
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
    console.error('게임 채점 오류:', error);
    return NextResponse.json(
      { error: '채점 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
