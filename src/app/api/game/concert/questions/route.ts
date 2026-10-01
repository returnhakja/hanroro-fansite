import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ConcertGameQuestion from '@/lib/db/models/ConcertGameQuestion';
import { signConcertRoundToken } from '@/lib/game/concertRoundToken';
import { CONCERT_QUESTIONS_PER_ROUND } from '@/lib/game/concert';

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// GET /api/game/concert/questions - 활성 문제 중 10개를 무작위로 뽑아 보기를 섞어 반환한다.
// 정답 위치는 노출하지 않고, 채점용으로 서명된 라운드 토큰을 함께 내려준다.
export async function GET() {
  try {
    await connectDB();
    const pool = await ConcertGameQuestion.find({ isActive: true }).lean();

    if (pool.length < CONCERT_QUESTIONS_PER_ROUND) {
      return NextResponse.json(
        { error: '출제 가능한 문제가 부족합니다. 관리자 등록이 더 필요해요.' },
        { status: 409 }
      );
    }

    const picked = shuffle(pool).slice(0, CONCERT_QUESTIONS_PER_ROUND);
    const questionIds = picked.map((q) => (q._id as { toString(): string }).toString());
    const roundToken = signConcertRoundToken(questionIds);

    const questions = picked.map((q) => ({
      questionId: (q._id as { toString(): string }).toString(),
      imageUrl: q.imageUrl,
      credit: q.credit ?? '',
      dateOptions: shuffle([formatDate(q.correctDate), ...q.wrongDates.map(formatDate)]),
      venueOptions: shuffle([q.correctVenue, ...q.wrongVenues]),
    }));

    return NextResponse.json({ roundToken, questions });
  } catch (error) {
    console.error('공연 맞추기 문제 조회 오류:', error);
    return NextResponse.json(
      { error: '문제를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
