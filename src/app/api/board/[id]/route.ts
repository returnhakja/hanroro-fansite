import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';

// 게시글 상세 조회 (조회수 증가)
export async function GET(
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

    // 조회수 증가
    post.views += 1;
    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    return NextResponse.json(
      { error: '게시글을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// 게시글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deleted = await Board.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: '삭제할 게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '삭제 완료' });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    return NextResponse.json(
      { error: '게시글을 삭제할 수 없습니다' },
      { status: 500 }
    );
  }
}
