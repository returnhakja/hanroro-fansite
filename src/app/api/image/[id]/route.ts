import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Image from '@/lib/db/models/Image';
import { deleteFromBlob, isVercelBlobUrl } from '@/lib/storage/vercel-blob';

// 이미지 삭제 (업로드한 본인만 가능)
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

    // 작성자 본인 확인 (userId가 없는 기존 이미지는 삭제 불가)
    if (image.userId !== session.user.id) {
      return NextResponse.json(
        { error: '본인이 업로드한 이미지만 삭제할 수 있습니다' },
        { status: 403 }
      );
    }

    await Image.findByIdAndDelete(id);

    // Vercel Blob에서 삭제 (Vercel Blob URL인 경우만)
    if (isVercelBlobUrl(image.imageUrl)) {
      try {
        await deleteFromBlob(image.imageUrl);
      } catch (err) {
        console.error('Blob 파일 삭제 실패:', err);
      }
    }

    return NextResponse.json({ message: '삭제 완료' });
  } catch (error) {
    console.error('삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
