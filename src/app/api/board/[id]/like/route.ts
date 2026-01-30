import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';

// 좋아요 증가
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const post = await Board.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    post.likes += 1;
    await post.save();

    return NextResponse.json({ likes: post.likes });
  } catch (error) {
    console.error('좋아요 오류:', error);
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
