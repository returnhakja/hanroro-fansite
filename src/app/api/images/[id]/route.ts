import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Image from '@/lib/db/models/Image';
import { deleteFromBlob, isVercelBlobUrl } from '@/lib/storage/vercel-blob';
import { deleteFromR2, isR2Url } from '@/lib/storage/r2';

// 이미지/동영상 삭제 (업로드한 본인만 가능)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const image = await Image.findById(id);

    if (!image) {
      return NextResponse.json(
        { error: '이미지를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (image.userId !== session.user.id) {
      return NextResponse.json(
        { error: '본인이 업로드한 이미지만 삭제할 수 있습니다' },
        { status: 403 }
      );
    }

    await Image.findByIdAndDelete(id);

    // 스토리지에서도 삭제 (R2 신규 / Vercel Blob 레거시)
    try {
      if (isR2Url(image.imageUrl)) {
        await deleteFromR2(image.imageUrl);
      } else if (isVercelBlobUrl(image.imageUrl)) {
        await deleteFromBlob(image.imageUrl);
      }
    } catch (err) {
      console.error('스토리지 파일 삭제 실패:', err);
    }

    return NextResponse.json({ message: '삭제 완료' });
  } catch (error) {
    console.error('삭제 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
