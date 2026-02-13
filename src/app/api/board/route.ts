import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';

// 게시글 목록 조회
export async function GET() {
  try {
    await connectDB();
    const posts = await Board.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('게시글 목록 오류:', error);
    return NextResponse.json(
      { error: '게시글 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, author, imageUrls } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: '제목, 내용, 작성자는 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();
    const newPost = await Board.create({
      title,
      content,
      author,
      userId: session.user.id || null,
      imageUrls: imageUrls || [],
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    return NextResponse.json(
      { error: '게시글을 저장할 수 없습니다' },
      { status: 500 }
    );
  }
}
