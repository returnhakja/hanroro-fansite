import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';
import Comment from '@/lib/db/models/Comment';
import AttendedConcert from '@/lib/db/models/AttendedConcert';

// 마이페이지 활동 요약 (로그인 필요)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    await connectDB();
    const userId = session.user.id;

    const [attendedCount, postCount, commentCount] = await Promise.all([
      AttendedConcert.countDocuments({ userId, date: { $lt: new Date() } }),
      Board.countDocuments({ userId }),
      Comment.countDocuments({ userId, deleted: false }),
    ]);

    return NextResponse.json({ attendedCount, postCount, commentCount });
  } catch (error) {
    console.error('활동 요약 조회 오류:', error);
    return NextResponse.json(
      { error: '통계를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
