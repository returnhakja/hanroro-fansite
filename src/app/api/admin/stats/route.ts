import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import Concert from '@/lib/db/models/Concert';
import Event from '@/lib/db/models/Event';
import Board from '@/lib/db/models/Board';
import Image from '@/lib/db/models/Image';

// 관리자 대시보드 통계 조회 (JWT 인증 필요)
async function handleGet() {
  try {
    await connectDB();

    // 각 모델별 카운트 조회
    const [concertsCount, eventsCount, postsCount, imagesCount] =
      await Promise.all([
        Concert.countDocuments(),
        Event.countDocuments(),
        Board.countDocuments(),
        Image.countDocuments(),
      ]);

    return NextResponse.json({
      concerts: concertsCount,
      events: eventsCount,
      posts: postsCount,
      images: imagesCount,
    });
  } catch (error) {
    console.error('통계 조회 오류:', error);
    return NextResponse.json(
      { error: '통계를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
