import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import EventReview from '@/lib/db/models/EventReview';
import { verifyOwnership } from '@/lib/board/ownership';

// 공연 후기 삭제 (로그인 작성 후기의 작성자 본인만 가능. 익명 후기는 삭제 불가)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    const session = await auth();
    await connectDB();
    const { reviewId } = await params;

    const review = await EventReview.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: '후기를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const ownership = verifyOwnership(review, session);
    if (!ownership.ok) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.status }
      );
    }

    await EventReview.findByIdAndDelete(reviewId);

    return NextResponse.json({ message: '후기가 삭제되었습니다' });
  } catch (error) {
    console.error('공연 후기 삭제 오류:', error);
    return NextResponse.json(
      { error: '후기를 삭제할 수 없습니다' },
      { status: 500 }
    );
  }
}
