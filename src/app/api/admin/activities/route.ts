import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Activity from '@/lib/db/models/Activity';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/admin/activities - 모든 활동 목록
async function handleGet() {
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

// POST /api/admin/activities - 활동 생성
async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, type, title, description, imageUrl, link } = body;

    if (!year || !month || !title) {
      return NextResponse.json(
        { error: '연도, 월, 제목은 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const activity = await Activity.create({
      year: Number(year),
      month: Number(month),
      type: type || 'etc',
      title,
      description,
      imageUrl,
      link,
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('활동 생성 오류:', error);
    return NextResponse.json(
      { error: '활동 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const POST = requireAuth(handlePost);
