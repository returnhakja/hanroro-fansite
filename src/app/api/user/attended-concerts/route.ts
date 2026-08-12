import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import AttendedConcert from '@/lib/db/models/AttendedConcert';

// 내가 체크한 공연 목록 조회 (로그인 필요)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    await connectDB();
    const items = await AttendedConcert.find({ userId: session.user.id }).sort({
      date: 1,
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('내 공연 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// 공연 체크 추가 (로그인 필요)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const body = await request.json();
    const { sourceType, sourceId, title, venue, date } = body;

    if (
      (sourceType !== 'event' && sourceType !== 'concert') ||
      !sourceId ||
      !title ||
      !date
    ) {
      return NextResponse.json(
        { error: '잘못된 요청입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    try {
      const item = await AttendedConcert.create({
        userId: session.user.id,
        sourceType,
        sourceId,
        title,
        venue: venue || '',
        date: new Date(date),
      });
      return NextResponse.json(item, { status: 201 });
    } catch (err: unknown) {
      // 이미 체크된 공연이면 기존 기록을 그대로 반환 (멱등)
      if ((err as { code?: number }).code === 11000) {
        const existing = await AttendedConcert.findOne({
          userId: session.user.id,
          sourceType,
          sourceId,
        });
        return NextResponse.json(existing, { status: 200 });
      }
      throw err;
    }
  } catch (error) {
    console.error('공연 체크 오류:', error);
    return NextResponse.json(
      { error: '체크할 수 없습니다' },
      { status: 500 }
    );
  }
}

// 공연 체크 해제 (로그인 필요)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const body = await request.json();
    const { sourceType, sourceId } = body;

    if (!sourceType || !sourceId) {
      return NextResponse.json(
        { error: '잘못된 요청입니다' },
        { status: 400 }
      );
    }

    await connectDB();
    await AttendedConcert.deleteOne({
      userId: session.user.id,
      sourceType,
      sourceId,
    });

    return NextResponse.json({ message: '체크가 해제되었습니다' });
  } catch (error) {
    console.error('공연 체크 해제 오류:', error);
    return NextResponse.json(
      { error: '체크를 해제할 수 없습니다' },
      { status: 500 }
    );
  }
}
