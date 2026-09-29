import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import GameResult from '@/lib/db/models/GameResult';
import { isGameDifficulty } from '@/lib/game/difficulty';

const VOTER_COOKIE = 'vid';
const LIMIT = 50;

// GET /api/game/ranking?difficulty=normal - 난이도별 리더보드.
// 같은 voterId의 기록 중 최고 기록(점수 desc, 소요시간 asc) 1개만 남긴다.
export async function GET(request: NextRequest) {
  try {
    const difficulty = request.nextUrl.searchParams.get('difficulty');
    if (!isGameDifficulty(difficulty)) {
      return NextResponse.json({ error: '올바르지 않은 난이도입니다' }, { status: 400 });
    }

    await connectDB();

    const rows = await GameResult.aggregate([
      { $match: { difficulty } },
      { $sort: { score: -1, elapsedMs: 1, createdAt: 1 } },
      {
        $group: {
          _id: '$voterId',
          resultId: { $first: '$_id' },
          voterId: { $first: '$voterId' },
          nickname: { $first: '$nickname' },
          score: { $first: '$score' },
          elapsedMs: { $first: '$elapsedMs' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $sort: { score: -1, elapsedMs: 1, createdAt: 1 } },
      { $limit: LIMIT },
    ]);

    const myVoterId = request.cookies.get(VOTER_COOKIE)?.value;

    const ranking = rows.map((row, index) => ({
      rank: index + 1,
      resultId: (row.resultId as { toString(): string }).toString(),
      nickname: row.nickname as string,
      score: row.score as number,
      elapsedMs: row.elapsedMs as number,
      isMe: myVoterId ? row.voterId === myVoterId : false,
    }));

    return NextResponse.json({ difficulty, ranking });
  } catch (error) {
    console.error('게임 랭킹 조회 오류:', error);
    return NextResponse.json(
      { error: '랭킹을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
