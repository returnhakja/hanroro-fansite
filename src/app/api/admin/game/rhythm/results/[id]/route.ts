import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { requireAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import RhythmResult from '@/lib/db/models/RhythmResult';

// DELETE /api/admin/game/rhythm/results/[id] - 부적절한 닉네임/어뷰징 기록 삭제
async function handleDelete(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    await connectDB();
    await RhythmResult.findByIdAndDelete(id);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('리듬게임 결과 삭제 오류:', error);
    return NextResponse.json(
      { error: '삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const DELETE = requireAuth(handleDelete);
