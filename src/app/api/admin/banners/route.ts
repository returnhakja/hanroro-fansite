import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Banner from '@/lib/db/models/Banner';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { normalizeBannerInput } from '@/lib/banners';

// GET /api/admin/banners - 전체 배너 목록 (기간 지난 것 포함)
async function handleGet(): Promise<NextResponse> {
  try {
    await connectDB();
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ banners });
  } catch (error) {
    console.error('배너 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '배너 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST /api/admin/banners - 배너 등록
async function handlePost(req: AuthenticatedRequest): Promise<NextResponse> {
  let data;
  try {
    data = normalizeBannerInput(await req.json());
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  try {
    await connectDB();
    const banner = await Banner.create(data);
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('배너 등록 오류:', error);
    return NextResponse.json(
      { error: '배너 등록 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const POST = requireAuth(handlePost);
