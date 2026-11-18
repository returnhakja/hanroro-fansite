import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import Banner from '@/lib/db/models/Banner';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { normalizeBannerInput } from '@/lib/banners';

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/admin/banners/[id] - 배너 수정
async function handlePut(req: AuthenticatedRequest, context: Ctx): Promise<NextResponse> {
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  let data;
  try {
    data = normalizeBannerInput(await req.json());
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  try {
    await connectDB();
    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        $set: data,
        // 비운 선택 항목은 DB 에서도 지운다
        $unset: {
          ...(data.mobileImageUrl ? {} : { mobileImageUrl: 1 }),
          ...(data.buttonLabel ? {} : { buttonLabel: 1 }),
        },
      },
      { new: true }
    );
    if (!banner) {
      return NextResponse.json({ error: '배너를 찾을 수 없습니다' }, { status: 404 });
    }
    return NextResponse.json({ banner });
  } catch (error) {
    console.error('배너 수정 오류:', error);
    return NextResponse.json(
      { error: '배너 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/banners/[id] - 배너 삭제
async function handleDelete(_req: AuthenticatedRequest, context: Ctx): Promise<NextResponse> {
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  try {
    await connectDB();
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return NextResponse.json({ error: '배너를 찾을 수 없습니다' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('배너 삭제 오류:', error);
    return NextResponse.json(
      { error: '배너 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth<{ id: string }>(handlePut);
export const DELETE = requireAuth<{ id: string }>(handleDelete);
