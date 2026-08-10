import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import SetList from '@/lib/db/models/SetList';
import { requireAuth } from '@/lib/auth/middleware';
import { parseDayRange, findOverlappingSetlist } from '@/lib/setlist/dayRange';

// GET /api/admin/setlists/[id] - 셋리스트 조회
async function handleGet(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;

    await connectDB();

    const setlist = await SetList.findById(id).populate('concertId');

    if (!setlist) {
      return NextResponse.json(
        { error: '셋리스트를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ setlist });
  } catch (error) {
    console.error('셋리스트 조회 오류:', error);
    return NextResponse.json(
      { error: '셋리스트 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/setlists/[id] - 셋리스트 수정
async function handlePut(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;
    const body = await req.json();
    const { day, date, endDay, endDate, songs } = body;

    if (!day || !date) {
      return NextResponse.json(
        { error: '일차와 날짜는 필수입니다' },
        { status: 400 }
      );
    }

    const parsed = parseDayRange({ day, date, endDay, endDate });
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    await connectDB();

    const target = await SetList.findById(id).select('concertId').lean();
    if (!target) {
      return NextResponse.json(
        { error: '셋리스트를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const overlap = await findOverlappingSetlist(
      String(target.concertId),
      parsed.range,
      id
    );
    if (overlap) {
      return NextResponse.json(
        { error: '해당 공연에 일차가 겹치는 셋리스트가 이미 있습니다' },
        { status: 409 }
      );
    }

    const setlist = await SetList.findByIdAndUpdate(
      id,
      {
        day: parsed.range.day,
        date: parsed.range.date,
        // 하루짜리로 되돌릴 수 있어야 하므로 값이 없으면 필드를 제거한다
        ...(parsed.range.endDay
          ? { endDay: parsed.range.endDay, endDate: parsed.range.endDate }
          : { $unset: { endDay: '', endDate: '' } }),
        songs: songs || [],
      },
      { new: true, runValidators: true }
    );

    if (!setlist) {
      return NextResponse.json(
        { error: '셋리스트를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ setlist });
  } catch (error) {
    console.error('셋리스트 수정 오류:', error);
    return NextResponse.json(
      { error: '셋리스트 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/setlists/[id] - 셋리스트 삭제
async function handleDelete(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;

    await connectDB();

    const setlist = await SetList.findByIdAndDelete(id);

    if (!setlist) {
      return NextResponse.json(
        { error: '셋리스트를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '셋리스트가 삭제되었습니다' });
  } catch (error) {
    console.error('셋리스트 삭제 오류:', error);
    return NextResponse.json(
      { error: '셋리스트 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const PUT = requireAuth(handlePut);
export const DELETE = requireAuth(handleDelete);
