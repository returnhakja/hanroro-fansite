import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Comment from '@/lib/db/models/Comment';

// 댓글 수정 (작성자 본인만 가능)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
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
    const { commentId } = await params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (comment.deleted) {
      return NextResponse.json(
        { error: '삭제된 댓글은 수정할 수 없습니다' },
        { status: 400 }
      );
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: '본인이 작성한 댓글만 수정할 수 있습니다' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: '댓글 내용을 입력해주세요' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: '댓글은 500자를 초과할 수 없습니다' },
        { status: 400 }
      );
    }

    comment.content = content.trim();
    await comment.save();

    return NextResponse.json({
      _id: comment._id.toString(),
      content: comment.content,
      message: '댓글이 수정되었습니다',
    });
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    return NextResponse.json(
      { error: '댓글을 수정할 수 없습니다' },
      { status: 500 }
    );
  }
}

// Soft delete a comment (작성자 본인만 가능)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
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
    const { commentId } = await params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (comment.deleted) {
      return NextResponse.json(
        { error: '이미 삭제된 댓글입니다' },
        { status: 400 }
      );
    }

    // 작성자 본인 확인
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: '본인이 작성한 댓글만 삭제할 수 있습니다' },
        { status: 403 }
      );
    }

    // Soft delete
    comment.deleted = true;
    comment.deletedAt = new Date();
    await comment.save();

    return NextResponse.json({
      message: '댓글이 삭제되었습니다',
      commentId: comment._id.toString(),
    });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    return NextResponse.json(
      { error: '댓글을 삭제할 수 없습니다' },
      { status: 500 }
    );
  }
}
