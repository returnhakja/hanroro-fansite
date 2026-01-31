import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Event from '@/lib/db/models/Event';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/admin/events/[id] - 일정 조회
async function handleGet(
  req: NextRequest,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;

    await connectDB();

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: '일정을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('일정 조회 오류:', error);
    return NextResponse.json(
      { error: '일정 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/events/[id] - 일정 수정
async function handlePut(
  req: NextRequest,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;
    const body = await req.json();
    const { title, date, time, place, posterUrl, type } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: '제목과 날짜는 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const event = await Event.findByIdAndUpdate(
      id,
      {
        title,
        date: new Date(date),
        time,
        place,
        posterUrl,
        type,
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return NextResponse.json({ error: '일정을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('일정 수정 오류:', error);
    return NextResponse.json(
      { error: '일정 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events/[id] - 일정 삭제
async function handleDelete(
  req: NextRequest,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;

    await connectDB();

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json({ error: '일정을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ message: '일정이 삭제되었습니다' });
  } catch (error) {
    console.error('일정 삭제 오류:', error);
    return NextResponse.json(
      { error: '일정 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const PUT = requireAuth(handlePut);
export const DELETE = requireAuth(handleDelete);
