import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Activity from '@/lib/db/models/Activity';
import { requireAuth } from '@/lib/auth/middleware';

// PUT /api/admin/activities/[id] - 활동 수정
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
    const { year, month, type, title, description, imageUrl, link } = body;

    if (!year || !month || !title) {
      return NextResponse.json(
        { error: '연도, 월, 제목은 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const activity = await Activity.findByIdAndUpdate(
      id,
      {
        year: Number(year),
        month: Number(month),
        type: type || 'etc',
        title,
        description,
        imageUrl,
        link,
      },
      { new: true }
    );

    if (!activity) {
      return NextResponse.json(
        { error: '활동을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('활동 수정 오류:', error);
    return NextResponse.json(
      { error: '활동 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/activities/[id] - 활동 삭제
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

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return NextResponse.json(
        { error: '활동을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '삭제되었습니다' });
  } catch (error) {
    console.error('활동 삭제 오류:', error);
    return NextResponse.json(
      { error: '활동 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(handlePut);
export const DELETE = requireAuth(handleDelete);
