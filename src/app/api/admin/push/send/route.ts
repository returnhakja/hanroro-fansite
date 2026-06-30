import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { requireAuth } from '@/lib/auth/middleware';
import { sendPushToAll } from '@/lib/push/sendPush';

// POST /api/admin/push/send - 모든 구독자에게 알림 발송
async function handleSend(req: NextRequest) {
  try {
    const { title, body, url, icon } = await req.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: '제목(title)과 내용(body)은 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await sendPushToAll({ title, body, url, icon });

    return NextResponse.json(result);
  } catch (error) {
    console.error('푸시 발송 오류:', error);
    return NextResponse.json(
      { error: '알림 발송 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handleSend);
