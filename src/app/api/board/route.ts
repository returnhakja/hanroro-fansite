import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';
import { sanitizeHtml } from '@/lib/utils/sanitize';
import { escapeRegex } from '@/lib/utils/regex';
import { DEFAULT_BOARD_CATEGORY, isBoardCategory } from '@/lib/board/categories';

// 게시글 목록 조회 (카테고리 필터 · 검색, 공지 상단 고정)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const q = escapeRegex((searchParams.get('q') || '').trim());

    const match: Record<string, unknown> = {};
    if (isBoardCategory(category)) {
      match.category = category;
    }
    if (q) {
      match.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    const posts = await Board.aggregate([
      { $match: match },
      { $addFields: { _pin: { $cond: [{ $eq: ['$category', 'notice'] }, 0, 1] } } },
      { $sort: { _pin: 1, createdAt: -1 } },
      // aggregate는 스키마의 select:false를 적용하지 않으므로 password를 명시적으로 제외
      { $project: { _pin: 0, password: 0 } },
    ]);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('게시글 목록 오류:', error);
    return NextResponse.json(
      { error: '게시글 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// 게시글 작성 (로그인 없이도 닉네임 + 비밀번호로 작성 가능)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    const body = await request.json();
    const { title, content, author, imageUrls, category, password } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: '제목, 내용, 작성자는 필수입니다' },
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

    // 비로그인 작성 시 수정·삭제 인증용 비밀번호 필수
    if (!session?.user && (!password || password.length < 4)) {
      return NextResponse.json(
        { error: '비밀번호를 4자 이상 입력해주세요' },
        { status: 400 }
      );
    }

    await connectDB();
    const newPost = await Board.create({
      title,
      content: sanitizeHtml(content),
      author,
      userId: session?.user?.id || null,
      password: session?.user ? null : password,
      category: category ?? DEFAULT_BOARD_CATEGORY,
      imageUrls: imageUrls || [],
    });

    const responseObj = newPost.toObject();
    delete responseObj.password;

    return NextResponse.json(responseObj, { status: 201 });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    return NextResponse.json(
      { error: '게시글을 저장할 수 없습니다' },
      { status: 500 }
    );
  }
}
