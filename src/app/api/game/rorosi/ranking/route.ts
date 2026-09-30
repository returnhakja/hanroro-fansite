import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import LorosiResult from '@/lib/db/models/LorosiResult';

const VOTER_COOKIE = 'vid';
const LIMIT = 10;

// GET /api/game/rorosi/ranking - voterId당 오차(diffMs)가 가장 작은 기록 1개만 남겨서
// 오차가 작은 순으로 상위 10명을 보여준다.
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const rows = await LorosiResult.aggregate([
      { $sort: { diffMs: 1, createdAt: 1 } },
      {
        $group: {
          _id: '$voterId',
          resultId: { $first: '$_id' },
          voterId: { $first: '$voterId' },
          nickname: { $first: '$nickname' },
          elapsedMs: { $first: '$elapsedMs' },
          diffMs: { $first: '$diffMs' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $sort: { diffMs: 1, createdAt: 1 } },
      { $limit: LIMIT },
    ]);

    const myVoterId = request.cookies.get(VOTER_COOKIE)?.value;

    const ranking = rows.map((row, index) => ({
      rank: index + 1,
      resultId: (row.resultId as { toString(): string }).toString(),
      nickname: row.nickname as string,
      elapsedMs: row.elapsedMs as number,
      diffMs: row.diffMs as number,
      isMe: myVoterId ? row.voterId === myVoterId : false,
    }));

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('로로시 랭킹 조회 오류:', error);
    return NextResponse.json(
      { error: '랭킹을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
