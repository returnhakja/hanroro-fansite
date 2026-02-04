import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Comment from '@/lib/db/models/Comment';
import Board from '@/lib/db/models/Board';

// Get all comments for a board
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Validate board exists
    const board = await Board.findById(id);
    if (!board) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Get all comments for board
    const comments = await Comment.find({ boardId: id })
      .sort({ createdAt: 1 }) // Oldest first
      .lean();

    // Transform deleted comments
    const transformedComments = comments.map((comment) => ({
      ...comment,
      _id: comment._id.toString(),
      boardId: comment.boardId.toString(),
      parentId: comment.parentId ? comment.parentId.toString() : null,
      content: comment.deleted ? '[삭제된 댓글입니다]' : comment.content,
      author: comment.deleted ? '' : comment.author,
    }));

    return NextResponse.json({
      comments: transformedComments,
      total: comments.length,
    });
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    return NextResponse.json(
      { error: '댓글을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, author, parentId } = body;

    // Validation
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

    if (!author?.trim()) {
      return NextResponse.json(
        { error: '작성자명을 입력해주세요' },
        { status: 400 }
      );
    }

    if (author.length > 50) {
      return NextResponse.json(
        { error: '작성자명은 50자를 초과할 수 없습니다' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify board exists
    const board = await Board.findById(id);
    if (!board) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    let depth = 0;

    // If this is a reply, validate parent
    if (parentId) {
      const parent = await Comment.findById(parentId);

      if (!parent) {
        return NextResponse.json(
          { error: '원댓글을 찾을 수 없습니다' },
          { status: 404 }
        );
      }

      // Check parent belongs to same board
      if (parent.boardId.toString() !== id) {
        return NextResponse.json(
          { error: '잘못된 요청입니다' },
          { status: 400 }
        );
      }

      // Check depth limit (no replies to replies)
      if (parent.depth >= 1) {
        return NextResponse.json(
          { error: '대댓글에는 답글을 달 수 없습니다' },
          { status: 400 }
        );
      }

      depth = 1;
    }

    // Create comment
    const newComment = await Comment.create({
      boardId: id,
      content: content.trim(),
      author: author.trim(),
      parentId: parentId || null,
      depth,
    });

    // Convert to plain object and transform ObjectIds to strings
    const commentObj = newComment.toObject();
    const transformedComment = {
      ...commentObj,
      _id: commentObj._id.toString(),
      boardId: commentObj.boardId.toString(),
      parentId: commentObj.parentId ? commentObj.parentId.toString() : null,
    };

    return NextResponse.json(transformedComment, { status: 201 });
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    return NextResponse.json(
      { error: '댓글을 저장할 수 없습니다' },
      { status: 500 }
    );
  }
}
