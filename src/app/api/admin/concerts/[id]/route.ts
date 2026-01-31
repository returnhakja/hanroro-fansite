import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Concert from '@/lib/db/models/Concert';
import SetList from '@/lib/db/models/SetList';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/admin/concerts/[id] - 공연 조회
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

    const concert = await Concert.findById(id);

    if (!concert) {
      return NextResponse.json({ error: '공연을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ concert });
  } catch (error) {
    console.error('공연 조회 오류:', error);
    return NextResponse.json(
      { error: '공연 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/concerts/[id] - 공연 수정
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
    const { title, venue, startDate, endDate, posterUrl } = body;

    if (!title || !venue || !startDate || !endDate) {
      return NextResponse.json(
        { error: '제목, 장소, 시작일, 종료일은 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const concert = await Concert.findByIdAndUpdate(
      id,
      {
        title,
        venue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        posterUrl,
      },
      { new: true, runValidators: true }
    );

    if (!concert) {
      return NextResponse.json({ error: '공연을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ concert });
  } catch (error) {
    console.error('공연 수정 오류:', error);
    return NextResponse.json(
      { error: '공연 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/concerts/[id] - 공연 삭제
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

    // 해당 공연의 셋리스트도 함께 삭제
    await SetList.deleteMany({ concertId: id });

    const concert = await Concert.findByIdAndDelete(id);

    if (!concert) {
      return NextResponse.json({ error: '공연을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ message: '공연이 삭제되었습니다' });
  } catch (error) {
    console.error('공연 삭제 오류:', error);
    return NextResponse.json(
      { error: '공연 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const PUT = requireAuth(handlePut);
export const DELETE = requireAuth(handleDelete);
