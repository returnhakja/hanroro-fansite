import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import PushSubscription from '@/lib/db/models/PushSubscription';

// POST /api/push/subscribe - 푸시 구독 등록(또는 갱신)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const subscription = body?.subscription;

    if (
      !subscription?.endpoint ||
      !subscription?.keys?.p256dh ||
      !subscription?.keys?.auth
    ) {
      return NextResponse.json(
        { error: '유효하지 않은 구독 정보입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        userAgent: req.headers.get('user-agent') || '',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('푸시 구독 등록 오류:', error);
    return NextResponse.json(
      { error: '구독 등록 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/push/subscribe - 푸시 구독 해제
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const endpoint = body?.endpoint;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'endpoint가 필요합니다' },
        { status: 400 }
      );
    }

    await connectDB();
    await PushSubscription.deleteOne({ endpoint });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('푸시 구독 해제 오류:', error);
    return NextResponse.json(
      { error: '구독 해제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
