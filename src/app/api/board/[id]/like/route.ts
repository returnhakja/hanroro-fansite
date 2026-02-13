import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';

// 좋아요 토글 (로그인 필수, 중복 방지)
export async function POST(
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
    const post = await Board.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const alreadyLiked = post.likedBy?.includes(userId);

    if (alreadyLiked) {
      // 좋아요 취소
      post.likedBy = post.likedBy.filter((id: string) => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // 좋아요 추가
      post.likedBy = [...(post.likedBy || []), userId];
      post.likes += 1;
    }

    await post.save();

    return NextResponse.json({
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error('좋아요 오류:', error);
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
