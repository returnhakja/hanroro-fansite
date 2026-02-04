import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Comment from '@/lib/db/models/Comment';

// Soft delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
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
