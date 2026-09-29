import { NextRequest, NextResponse } from 'next/server';
import { verifyRoundToken } from '@/lib/game/roundToken';
import { isLenientMatch } from '@/lib/utils/gameMatch';

// POST /api/game/answer - 문제 하나에 대한 즉시 정답 확인(플레이 중 피드백용).
// 최종 점수는 /api/game/submit 이 라운드 토큰으로 다시 채점하므로, 여기서
// 돌려주는 correct 값은 화면 표시용일 뿐 신뢰하지 않는다.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { roundToken, index, guess } = body;

    if (typeof roundToken !== 'string' || typeof index !== 'number' || typeof guess !== 'string') {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const payload = verifyRoundToken(roundToken);
    if (!payload) {
      return NextResponse.json(
        { error: '라운드가 만료되었거나 유효하지 않아요' },
        { status: 410 }
      );
    }
    if (index < 0 || index >= payload.songs.length) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const answer = payload.songs[index];
    const correct = isLenientMatch(guess, answer);

    return NextResponse.json({ correct, answer });
  } catch (error) {
    console.error('게임 문제 확인 오류:', error);
    return NextResponse.json(
      { error: '확인 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
