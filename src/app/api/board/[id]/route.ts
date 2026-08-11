import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';
import { sanitizeHtml } from '@/lib/utils/sanitize';
import { isBoardCategory } from '@/lib/board/categories';
import { verifyOwnership } from '@/lib/board/ownership';

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

    // 응답 시 본문 sanitize (기존 게시글 포함 XSS 방어)
    const obj = post.toObject();
    obj.content = sanitizeHtml(obj.content);
    return NextResponse.json(obj);
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    return NextResponse.json(
      { error: '게시글을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// 게시글 수정 (작성자 본인 — 로그인 글은 세션, 익명 글은 비밀번호로 확인)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    await connectDB();
    const { id } = await params;
    const post = await Board.findById(id).select('+password');

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, category, password } = body;

    const ownership = await verifyOwnership(post, session, password);
    if (!ownership.ok) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.status }
      );
    }

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

    if (category !== undefined && !isBoardCategory(category)) {
      return NextResponse.json(
        { error: '올바르지 않은 카테고리입니다' },
        { status: 400 }
      );
    }

    if (category === 'notice') {
      return NextResponse.json(
        { error: '공지 카테고리는 관리자만 설정할 수 있습니다' },
        { status: 403 }
      );
    }

    post.title = title.trim();
    post.content = sanitizeHtml(content.trim());
    if (category !== undefined) {
      post.category = category;
    }
    await post.save();

    const responseObj = post.toObject();
    delete responseObj.password;

    return NextResponse.json(responseObj);
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    return NextResponse.json(
      { error: '게시글을 수정할 수 없습니다' },
      { status: 500 }
    );
  }
}

// 게시글 삭제 (작성자 본인 — 로그인 글은 세션, 익명 글은 비밀번호로 확인)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    await connectDB();
    const { id } = await params;
    const post = await Board.findById(id).select('+password');

    if (!post) {
      return NextResponse.json(
        { error: '삭제할 게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const password = await request
      .json()
      .then((body) => body?.password as string | undefined)
      .catch(() => undefined);

    const ownership = await verifyOwnership(post, session, password);
    if (!ownership.ok) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.status }
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
