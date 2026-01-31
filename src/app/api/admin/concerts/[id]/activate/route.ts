import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Concert from '@/lib/db/models/Concert';
import { requireAuth } from '@/lib/auth/middleware';

// PATCH /api/admin/concerts/[id]/activate - 공연 활성화
async function handlePatch(
  req: NextRequest,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;
    const { isActive } = await req.json();

    await connectDB();

    if (isActive) {
      // 기존 활성 공연 모두 비활성화
      await Concert.updateMany({}, { isActive: false });
    }

    const concert = await Concert.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!concert) {
      return NextResponse.json({ error: '공연을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ concert });
  } catch (error) {
    console.error('공연 활성화 오류:', error);
    return NextResponse.json(
      { error: '공연 활성화 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const PATCH = requireAuth(handlePatch);
