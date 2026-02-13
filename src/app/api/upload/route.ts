import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Image from '@/lib/db/models/Image';
import { uploadToBlob } from '@/lib/storage/vercel-blob';

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
    const title = formData.get('title') as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: '제목과 파일이 필요합니다' },
        { status: 400 }
      );
    }

    // Vercel Blob에 업로드
    const imageUrl = await uploadToBlob(file, 'gallery');

    // MongoDB에 저장
    await connectDB();
    const image = await Image.create({
      title,
      filename: file.name,
      imageUrl,
      userId: session.user.id,
    });

    return NextResponse.json({
      message: '업로드 성공',
      imageUrl,
      title,
      _id: image._id,
    });
  } catch (error) {
    console.error('업로드 오류:', error);
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
