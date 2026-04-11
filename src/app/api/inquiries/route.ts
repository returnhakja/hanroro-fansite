import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Inquiry from '@/lib/db/models/Inquiry';
import { isInquiryCategory } from '@/lib/constants/inquiry';

const TITLE_MAX = 200;
const CONTENT_MAX = 5000;

/** 내 문의 목록 (본인 글만, 내용 미리보기 없음) */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    await connectDB();
    const rows = await Inquiry.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select('title category readByAdmin replyCount createdAt')
      .lean();

    const inquiries = rows.map((row) => ({
      _id: row._id.toString(),
      title: row.title,
      category: row.category,
      readByAdmin: row.readByAdmin,
      replyCount: row.replyCount ?? 0,
      createdAt: row.createdAt,
    }));

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('문의 목록 오류:', error);
    return NextResponse.json(
      { error: '문의 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

/** 비밀 문의 작성 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, author, category, website } = body;

    // honeypot
    if (website) {
      return NextResponse.json({ error: '요청을 처리할 수 없습니다' }, { status: 400 });
    }

    if (!title || !content || !author || !category) {
      return NextResponse.json(
        { error: '유형, 제목, 내용, 작성자명은 필수입니다' },
        { status: 400 }
      );
    }

    if (!isInquiryCategory(category)) {
      return NextResponse.json({ error: '유효하지 않은 문의 유형입니다' }, { status: 400 });
    }

    const t = String(title).trim();
    const c = String(content).trim();
    const a = String(author).trim();

    if (t.length > TITLE_MAX || c.length > CONTENT_MAX || a.length > 80) {
      return NextResponse.json(
        { error: '입력 길이가 제한을 초과했습니다' },
        { status: 400 }
      );
    }

    await connectDB();
    const doc = await Inquiry.create({
      userId: session.user.id,
      author: a,
      category,
      title: t,
      content: c,
    });

    return NextResponse.json(
      {
        _id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        readByAdmin: doc.readByAdmin,
        replyCount: doc.replyCount ?? 0,
        createdAt: doc.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('문의 작성 오류:', error);
    return NextResponse.json(
      { error: '문의를 저장할 수 없습니다' },
      { status: 500 }
    );
  }
}
