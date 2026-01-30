import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Image from '@/lib/db/models/Image';

export async function GET() {
  try {
    await connectDB();
    const images = await Image.find().sort({ createdAt: -1 }).lean();

    const imageUrls = images.map((img: any) => ({
      _id: img._id.toString(),
      title: img.title,
      createdAt: img.createdAt,
      imageUrl: img.imageUrl,
    }));

    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error('이미지 목록 오류:', error);
    return NextResponse.json(
      { error: '이미지 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
