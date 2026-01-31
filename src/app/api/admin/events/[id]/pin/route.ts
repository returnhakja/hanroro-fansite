import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Event from '@/lib/db/models/Event';
import { requireAuth } from '@/lib/auth/middleware';

// PATCH /api/admin/events/[id]/pin - 일정 고정/해제
async function handlePatch(
  req: NextRequest,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;
    const { isPinned } = await req.json();

    await connectDB();

    const event = await Event.findByIdAndUpdate(
      id,
      { isPinned },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: '일정을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('일정 고정/해제 오류:', error);
    return NextResponse.json(
      { error: '일정 고정/해제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const PATCH = requireAuth(handlePatch);
