import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ConcertGameResult from '@/lib/db/models/ConcertGameResult';

const VOTER_COOKIE = 'vid';
const LIMIT = 10;

// GET /api/game/concert/ranking - voterId당 최고 점수 기록 1개만 남겨서
// 점수가 높은 순(동점이면 먼저 기록한 순)으로 상위 10명을 보여준다.
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const rows = await ConcertGameResult.aggregate([
      { $sort: { score: -1, createdAt: 1 } },
      {
        $group: {
          _id: '$voterId',
          resultId: { $first: '$_id' },
          voterId: { $first: '$voterId' },
          nickname: { $first: '$nickname' },
          score: { $first: '$score' },
          dateCorrectCount: { $first: '$dateCorrectCount' },
          venueCorrectCount: { $first: '$venueCorrectCount' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $sort: { score: -1, createdAt: 1 } },
      { $limit: LIMIT },
    ]);

    const myVoterId = request.cookies.get(VOTER_COOKIE)?.value;

    const ranking = rows.map((row, index) => ({
      rank: index + 1,
      resultId: (row.resultId as { toString(): string }).toString(),
      nickname: row.nickname as string,
      score: row.score as number,
      dateCorrectCount: row.dateCorrectCount as number,
      venueCorrectCount: row.venueCorrectCount as number,
      isMe: myVoterId ? row.voterId === myVoterId : false,
    }));

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('공연 맞추기 랭킹 조회 오류:', error);
    return NextResponse.json(
      { error: '랭킹을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
