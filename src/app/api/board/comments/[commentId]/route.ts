import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Comment from '@/lib/db/models/Comment';
import { verifyOwnership } from '@/lib/board/ownership';

// 댓글 수정 (작성자 본인 — 로그인 댓글은 세션, 익명 댓글은 비밀번호로 확인)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await auth();

    await connectDB();
    const { commentId } = await params;
    const comment = await Comment.findById(commentId).select('+password');

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

    const body = await request.json();
    const { content, password } = body;

    const ownership = await verifyOwnership(comment, session, password);
    if (!ownership.ok) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.status }
      );
    }

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

    await connectDB();
    const { commentId } = await params;

    const comment = await Comment.findById(commentId).select('+password');

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

    const password = await request
      .json()
      .then((body) => body?.password as string | undefined)
      .catch(() => undefined);

    const ownership = await verifyOwnership(comment, session, password);
    if (!ownership.ok) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.status }
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
