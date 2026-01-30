import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Image from '@/lib/db/models/Image';
import { deleteFromBlob, isVercelBlobUrl } from '@/lib/storage/vercel-blob';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const image = await Image.findByIdAndDelete(params.id);

    if (!image) {
      return NextResponse.json(
        { error: '이미지를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Vercel Blob에서 삭제 (Vercel Blob URL인 경우만)
    if (isVercelBlobUrl(image.imageUrl)) {
      try {
        await deleteFromBlob(image.imageUrl);
      } catch (err) {
        console.error('Blob 파일 삭제 실패:', err);
        // Firebase 이미지는 무시 (호환성)
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
