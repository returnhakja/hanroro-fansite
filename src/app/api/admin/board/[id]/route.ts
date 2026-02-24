import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';
import Comment from '@/lib/db/models/Comment';

// 관리자용 게시글 삭제 (JWT 인증 필요)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // JWT 토큰 검증
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    // 게시글 존재 확인
    const post = await Board.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 게시글과 관련된 모든 댓글 삭제
    await Comment.deleteMany({ boardId: id });

    // 게시글 삭제
    await Board.findByIdAndDelete(id);

    return NextResponse.json({
      message: '게시글과 댓글이 삭제되었습니다',
    });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    return NextResponse.json(
      { error: '게시글을 삭제할 수 없습니다' },
      { status: 500 }
    );
  }
}
