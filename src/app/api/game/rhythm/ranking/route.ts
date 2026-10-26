import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import RhythmResult from '@/lib/db/models/RhythmResult';

const VOTER_COOKIE = 'vid';
const LIMIT = 10;

// GET /api/game/rhythm/ranking?chartId=... - 곡별 voterId당 최고 점수 1개만 남겨서 상위 10명
export async function GET(request: NextRequest) {
  try {
    const chartId = request.nextUrl.searchParams.get('chartId');
    if (!chartId || !mongoose.Types.ObjectId.isValid(chartId)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    await connectDB();

    const rows = await RhythmResult.aggregate([
      { $match: { chartId: new mongoose.Types.ObjectId(chartId) } },
      { $sort: { score: -1, createdAt: 1 } },
      {
        $group: {
          _id: '$voterId',
          resultId: { $first: '$_id' },
          voterId: { $first: '$voterId' },
          nickname: { $first: '$nickname' },
          score: { $first: '$score' },
          maxCombo: { $first: '$maxCombo' },
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
      maxCombo: row.maxCombo as number,
      isMe: myVoterId ? row.voterId === myVoterId : false,
    }));

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('리듬게임 랭킹 조회 오류:', error);
    return NextResponse.json(
      { error: '랭킹을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
