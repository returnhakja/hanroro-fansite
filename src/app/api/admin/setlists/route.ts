import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import SetList from '@/lib/db/models/SetList';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/admin/setlists?concertId=xxx - 특정 공연의 셋리스트 목록
async function handleGet(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const concertId = searchParams.get('concertId');

    if (!concertId) {
      return NextResponse.json(
        { error: 'concertId 파라미터가 필요합니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const setlists = await SetList.find({ concertId }).sort({ day: 1 });

    return NextResponse.json({ setlists });
  } catch (error) {
    console.error('셋리스트 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '셋리스트 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST /api/admin/setlists - 셋리스트 생성
async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const { concertId, day, date, songs } = body;

    if (!concertId || !day || !date) {
      return NextResponse.json(
        { error: '공연ID, 일차, 날짜는 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const setlist = await SetList.create({
      concertId,
      day,
      date: new Date(date),
      songs: songs || [],
    });

    return NextResponse.json({ setlist }, { status: 201 });
  } catch (error: any) {
    console.error('셋리스트 생성 오류:', error);

    // 중복 키 오류 처리
    if (error.code === 11000) {
      return NextResponse.json(
        { error: '해당 공연의 같은 일차 셋리스트가 이미 존재합니다' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: '셋리스트 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const POST = requireAuth(handlePost);
