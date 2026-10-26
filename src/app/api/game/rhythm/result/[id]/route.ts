import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import RhythmResult from '@/lib/db/models/RhythmResult';

const VOTER_COOKIE = 'vid';

// PATCH /api/game/rhythm/result/[id] - 닉네임 변경 (본인 voterId만 가능)
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
    const result = await RhythmResult.findOneAndUpdate(
      { _id: id, voterId },
      { $set: { nickname: nicknameInput.slice(0, 8) } },
      { new: true }
    ).lean();

    if (!result) {
      return NextResponse.json({ error: '내 기록만 수정할 수 있어요' }, { status: 403 });
    }

    return NextResponse.json({ nickname: result.nickname });
  } catch (error) {
    console.error('리듬게임 닉네임 수정 오류:', error);
    return NextResponse.json(
      { error: '닉네임을 수정하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
