import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Event from '@/lib/db/models/Event';

// GET /api/events/upcoming - 다가오는 일정 (공개 API)
export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    // 오늘 이후의 일정 + 고정된 일정 (과거 포함)
    const events = await Event.find({
      $or: [{ date: { $gte: now } }, { isPinned: true }],
    }).sort({ isPinned: -1, date: 1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('다가오는 일정 조회 오류:', error);
    return NextResponse.json(
      { error: '일정을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
