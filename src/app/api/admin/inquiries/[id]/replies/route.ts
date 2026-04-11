import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import Inquiry from '@/lib/db/models/Inquiry';
import InquiryReply from '@/lib/db/models/InquiryReply';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

const REPLY_MAX = 3000;

async function handlePost(
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다' }, { status: 404 });
    }

    const body = await req.json();
    const raw = body?.content;
    if (typeof raw !== 'string' || !raw.trim()) {
      return NextResponse.json(
        { error: '답변 내용을 입력해 주세요' },
        { status: 400 }
      );
    }
    const content = raw.trim();
    if (content.length > REPLY_MAX) {
      return NextResponse.json(
        { error: `답변은 ${REPLY_MAX}자 이하로 작성해 주세요` },
        { status: 400 }
      );
    }

    await connectDB();
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다' }, { status: 404 });
    }

    const adminEmail = req.admin!.email;
    const reply = await InquiryReply.create({
      inquiryId: inquiry._id,
      content,
      adminEmail,
    });

    await Inquiry.findByIdAndUpdate(id, {
      $inc: { replyCount: 1 },
      $set: { readByAdmin: true },
    });

    return NextResponse.json(
      {
        _id: reply._id.toString(),
        content: reply.content,
        adminEmail: reply.adminEmail,
        createdAt: reply.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('문의 답변 작성 오류:', error);
    return NextResponse.json(
      { error: '답변을 저장할 수 없습니다' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handlePost);
