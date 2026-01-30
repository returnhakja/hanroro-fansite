import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Image from '@/lib/db/models/Image';

export async function GET() {
  try {
    await connectDB();

    // MongoDB aggregation으로 랜덤 이미지 1개 가져오기
    const randomImages = await Image.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (randomImages.length === 0) {
      return NextResponse.json(
        { error: '이미지가 없습니다' },
        { status: 404 }
      );
    }

    const image = randomImages[0];
    return NextResponse.json({
      _id: image._id.toString(),
      title: image.title,
      createdAt: image.createdAt,
      imageUrl: image.imageUrl,
    });
  } catch (error) {
    console.error('랜덤 이미지 오류:', error);
    return NextResponse.json(
      { error: '이미지를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
