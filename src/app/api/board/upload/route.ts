import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { uploadToBlob } from '@/lib/storage/vercel-blob';

// 게시판 전용 이미지 업로드 (갤러리 Image 모델에 저장하지 않음)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다' },
        { status: 400 }
      );
    }

    // Vercel Blob에 업로드 (board 폴더, 갤러리와 분리)
    const imageUrl = await uploadToBlob(file, 'board');

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('게시판 이미지 업로드 오류:', error);
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
