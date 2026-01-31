import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Event from '@/lib/db/models/Event';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/admin/events - 모든 일정 목록
async function handleGet(req: NextRequest) {
  try {
    await connectDB();

    const events = await Event.find().sort({ isPinned: -1, date: -1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('일정 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '일정 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST /api/admin/events - 일정 생성
async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, date, time, place, posterUrl, type } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: '제목과 날짜는 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const event = await Event.create({
      title,
      date: new Date(date),
      time,
      place,
      posterUrl,
      type: type || 'other',
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('일정 생성 오류:', error);
    return NextResponse.json(
      { error: '일정 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const POST = requireAuth(handlePost);
