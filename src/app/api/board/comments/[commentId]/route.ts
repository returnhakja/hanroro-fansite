import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Comment from '@/lib/db/models/Comment';
import { verifyOwnership } from '@/lib/board/ownership';

// 댓글 수정 (로그인 작성 댓글의 작성자 본인만 가능. 익명 댓글은 수정 불가)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await auth();

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

    const ownership = verifyOwnership(comment, session);
    if (!ownership.ok) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.status }
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

// Soft delete a comment (로그인 작성 댓글의 작성자 본인만 가능. 익명 댓글은 삭제 불가)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await auth();

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

    const ownership = verifyOwnership(comment, session);
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
