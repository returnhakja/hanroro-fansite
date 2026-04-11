import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Inquiry from '@/lib/db/models/Inquiry';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

async function handleGet(_req: AuthenticatedRequest) {
  try {
    await connectDB();
    const rows = await Inquiry.find()
      .sort({ createdAt: -1 })
      .select(
        'userId author category title content readByAdmin replyCount createdAt'
      )
      .lean();

    const inquiries = rows.map((row) => ({
      _id: row._id.toString(),
      userId: row.userId,
      author: row.author,
      category: row.category,
      title: row.title,
      content: row.content,
      readByAdmin: row.readByAdmin,
      replyCount: row.replyCount ?? 0,
      createdAt: row.createdAt,
    }));

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('관리자 문의 목록 오류:', error);
    return NextResponse.json(
      { error: '문의 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
