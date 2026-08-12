import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import EventReview from '@/lib/db/models/EventReview';
import { sanitizeHtml } from '@/lib/utils/sanitize';

const MAX_IMAGES = 4;

// 공연 후기 목록 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const reviews = await EventReview.find({ eventId: id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('공연 후기 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '후기를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// 공연 후기 작성 (로그인 없이도 닉네임 + 비밀번호로 작성 가능)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await request.json();
    const { author, content, password, imageUrls } = body;

    if (!author?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: '닉네임과 후기 내용을 입력해주세요' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: '후기는 1000자를 초과할 수 없습니다' },
        { status: 400 }
      );
    }

    if (!session?.user && (!password || password.length < 4)) {
      return NextResponse.json(
        { error: '비밀번호를 4자 이상 입력해주세요' },
        { status: 400 }
      );
    }

    const safeImageUrls = Array.isArray(imageUrls)
      ? imageUrls.filter((u) => typeof u === 'string').slice(0, MAX_IMAGES)
      : [];

    await connectDB();
    const review = await EventReview.create({
      eventId: id,
      author: author.trim(),
      userId: session?.user?.id || null,
      password: session?.user ? null : password,
      content: sanitizeHtml(content.trim()),
      imageUrls: safeImageUrls,
    });

    const responseObj = review.toObject();
    delete responseObj.password;

    return NextResponse.json(responseObj, { status: 201 });
  } catch (error) {
    console.error('공연 후기 작성 오류:', error);
    return NextResponse.json(
      { error: '후기를 저장할 수 없습니다' },
      { status: 500 }
    );
  }
}
