import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Concert from '@/lib/db/models/Concert';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/admin/concerts - 모든 공연 목록
async function handleGet(req: NextRequest) {
  try {
    await connectDB();

    const concerts = await Concert.find().sort({ startDate: -1 });

    return NextResponse.json({ concerts });
  } catch (error) {
    console.error('공연 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '공연 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST /api/admin/concerts - 공연 생성
async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, venue, startDate, endDate, posterUrl } = body;

    if (!title || !venue || !startDate || !endDate) {
      return NextResponse.json(
        { error: '제목, 장소, 시작일, 종료일은 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const concert = await Concert.create({
      title,
      venue,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      posterUrl,
    });

    return NextResponse.json({ concert }, { status: 201 });
  } catch (error) {
    console.error('공연 생성 오류:', error);
    return NextResponse.json(
      { error: '공연 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const POST = requireAuth(handlePost);
