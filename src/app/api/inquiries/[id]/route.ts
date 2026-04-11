import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import Inquiry from '@/lib/db/models/Inquiry';
import InquiryReply from '@/lib/db/models/InquiryReply';

/** 본인 문의 상세 (관리자·타인 열람 불가) */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다' }, { status: 404 });
    }

    await connectDB();
    const row = await Inquiry.findById(id).lean();
    if (!row) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다' }, { status: 404 });
    }

    if (row.userId !== session.user.id) {
      return NextResponse.json({ error: '열람 권한이 없습니다' }, { status: 403 });
    }

    const replyDocs = await InquiryReply.find({ inquiryId: id })
      .sort({ createdAt: 1 })
      .select('content createdAt')
      .lean();

    const replies = replyDocs.map((r) => ({
      _id: r._id.toString(),
      author: '운영자',
      content: r.content,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      _id: row._id.toString(),
      author: row.author,
      category: row.category,
      title: row.title,
      content: row.content,
      readByAdmin: row.readByAdmin,
      replyCount: row.replyCount ?? 0,
      createdAt: row.createdAt,
      replies,
    });
  } catch (error) {
    console.error('문의 상세 오류:', error);
    return NextResponse.json(
      { error: '문의를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
