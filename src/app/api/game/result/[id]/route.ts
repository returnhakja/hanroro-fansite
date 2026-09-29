import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import GameResult from '@/lib/db/models/GameResult';

const VOTER_COOKIE = 'vid';

// GET /api/game/result/[id] - 결과 공유 페이지용 단건 조회
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    await connectDB();
    const result = await GameResult.findById(id).lean();
    if (!result) {
      return NextResponse.json({ error: '결과를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({
      result: {
        _id: (result._id as { toString(): string }).toString(),
        nickname: result.nickname,
        difficulty: result.difficulty,
        score: result.score,
        elapsedMs: result.elapsedMs,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error('게임 결과 조회 오류:', error);
    return NextResponse.json(
      { error: '결과를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// PATCH /api/game/result/[id] - 닉네임 변경. 새 기록을 만드는 대신 방금 만든
// 내 기록의 nickname만 갱신한다 (같은 voterId일 때만 허용).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const nicknameInput = typeof body.nickname === 'string' ? body.nickname.trim() : '';
    if (!nicknameInput) {
      return NextResponse.json({ error: '닉네임을 입력해주세요' }, { status: 400 });
    }

    const voterId = request.cookies.get(VOTER_COOKIE)?.value;
    if (!voterId) {
      return NextResponse.json({ error: '내 기록만 수정할 수 있어요' }, { status: 403 });
    }

    await connectDB();
    const result = await GameResult.findOneAndUpdate(
      { _id: id, voterId },
      { $set: { nickname: nicknameInput.slice(0, 8) } },
      { new: true }
    ).lean();

    if (!result) {
      return NextResponse.json({ error: '내 기록만 수정할 수 있어요' }, { status: 403 });
    }

    return NextResponse.json({
      result: {
        _id: (result._id as { toString(): string }).toString(),
        nickname: result.nickname,
        difficulty: result.difficulty,
        score: result.score,
        elapsedMs: result.elapsedMs,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error('게임 결과 닉네임 수정 오류:', error);
    return NextResponse.json(
      { error: '닉네임을 수정하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
