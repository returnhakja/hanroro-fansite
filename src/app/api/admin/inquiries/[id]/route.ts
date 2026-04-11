import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import Inquiry from '@/lib/db/models/Inquiry';
import InquiryReply from '@/lib/db/models/InquiryReply';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

async function handleGet(
  _req: AuthenticatedRequest,
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

    await connectDB();
    const row = await Inquiry.findById(id).lean();
    if (!row) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다' }, { status: 404 });
    }

    const replyDocs = await InquiryReply.find({ inquiryId: id })
      .sort({ createdAt: 1 })
      .lean();

    const replies = replyDocs.map((r) => ({
      _id: r._id.toString(),
      content: r.content,
      adminEmail: r.adminEmail,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      inquiry: {
        _id: row._id.toString(),
        userId: row.userId,
        author: row.author,
        category: row.category,
        title: row.title,
        content: row.content,
        readByAdmin: row.readByAdmin,
        replyCount: row.replyCount ?? 0,
        createdAt: row.createdAt,
      },
      replies,
    });
  } catch (error) {
    console.error('관리자 문의 상세 오류:', error);
    return NextResponse.json(
      { error: '문의를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

async function handlePatch(
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
    const { readByAdmin } = body;
    if (typeof readByAdmin !== 'boolean') {
      return NextResponse.json(
        { error: 'readByAdmin(boolean)이 필요합니다' },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { readByAdmin } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({
      _id: updated._id.toString(),
      readByAdmin: updated.readByAdmin,
    });
  } catch (error) {
    console.error('관리자 문의 수정 오류:', error);
    return NextResponse.json(
      { error: '문의를 수정할 수 없습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const PATCH = requireAuth(handlePatch);
