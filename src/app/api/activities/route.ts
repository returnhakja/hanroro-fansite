import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Activity from '@/lib/db/models/Activity';

// GET /api/activities - 연도별 활동 목록
export async function GET() {
  try {
    await connectDB();

    const activities = await Activity.find().sort({ year: -1, month: 1 });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('활동 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '활동 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
