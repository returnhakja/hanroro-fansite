import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Image from '@/lib/db/models/Image';
import { auth } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'image' | 'video' | null

    // type 필드가 없는 기존 데이터는 'image'로 처리
    const query = type === 'video'
      ? { type: 'video' }
      : type === 'image'
        ? { $or: [{ type: 'image' }, { type: { $exists: false } }, { type: null }] }
        : {};
    const images = await Image.find(query).sort({ createdAt: -1 }).lean();

    const result = images.map((img: any) => ({
      _id: img._id.toString(),
      title: img.title,
      createdAt: img.createdAt,
      imageUrl: img.imageUrl,
      userId: img.userId || null,
      type: img.type || 'image',
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('이미지 목록 오류:', error);
    return NextResponse.json(
      { error: '이미지 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// 업로드 완료 후 메타데이터 저장
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { title, imageUrl, filename, type } = await request.json();
    if (!title || !imageUrl) {
      return NextResponse.json({ error: '제목과 URL이 필요합니다' }, { status: 400 });
    }

    await connectDB();
    const image = await Image.create({
      title,
      filename: filename || imageUrl.split('/').pop() || '파일',
      imageUrl,
      userId: session.user.id,
      type: type || 'image',
    });

    return NextResponse.json({ _id: image._id.toString() });
  } catch (error) {
    console.error('미디어 저장 오류:', error);
    return NextResponse.json({ error: '저장에 실패했습니다' }, { status: 500 });
  }
}
