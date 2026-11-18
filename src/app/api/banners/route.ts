import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Banner from '@/lib/db/models/Banner';

export const dynamic = 'force-dynamic';

// GET /api/banners - 지금 노출 중인 홈 배너 (공개)
export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const banners = await Banner.find({
      isActive: true,
      $and: [
        { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
      ],
    })
      .sort({ order: 1, createdAt: -1 })
      .select('pcImageUrl mobileImageUrl alt buttonLabel linkUrl')
      .lean();

    return NextResponse.json(
      { banners },
      {
        // 홈 진입마다 DB 를 치지 않도록 CDN 에서 5분 캐시
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('배너 조회 오류:', error);
    return NextResponse.json({ banners: [] }, { status: 500 });
  }
}
