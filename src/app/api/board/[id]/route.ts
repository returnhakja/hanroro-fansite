import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';

// 게시글 상세 조회 (조회수 증가)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await Board.findById(id);

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

// 게시글 수정 (작성자 본인만 가능)
export async function PUT(
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

    if (post.userId !== session.user.id) {
      return NextResponse.json(
        { error: '본인이 작성한 글만 수정할 수 있습니다' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: '제목을 입력해주세요' },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: '내용을 입력해주세요' },
        { status: 400 }
      );
    }

    post.title = title.trim();
    post.content = content.trim();
    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    return NextResponse.json(
      { error: '게시글을 수정할 수 없습니다' },
      { status: 500 }
    );
  }
}

// 게시글 삭제 (작성자 본인만 가능)
export async function DELETE(
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
        { error: '삭제할 게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 작성자 본인 확인
    if (post.userId !== session.user.id) {
      return NextResponse.json(
        { error: '본인이 작성한 글만 삭제할 수 있습니다' },
        { status: 403 }
      );
    }

    await Board.findByIdAndDelete(id);

    return NextResponse.json({ message: '삭제 완료' });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    return NextResponse.json(
      { error: '게시글을 삭제할 수 없습니다' },
      { status: 500 }
    );
  }
}
