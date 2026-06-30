import PushSubscription from '@/lib/db/models/PushSubscription';
import { getWebPush } from './webpush';

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

export interface PushResult {
  sent: number;
  failed: number;
  removed: number;
}

/**
 * 저장된 모든 구독자에게 푸시 알림을 발송합니다.
 * 만료된 구독(410 Gone / 404 Not Found)은 자동으로 정리합니다.
 *
 * 주의: connectDB()는 호출하는 쪽에서 먼저 수행되어 있어야 합니다.
 */
export async function sendPushToAll(payload: PushPayload): Promise<PushResult> {
  const subscriptions = await PushSubscription.find();
  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, removed: 0 };
  }

  const webpush = getWebPush();
  const data = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || '/',
    icon: payload.icon || '/web-app-manifest-192x192.png',
  });

  let sent = 0;
  let failed = 0;
  const expiredEndpoints: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
          },
          data
        );
        sent += 1;
      } catch (error) {
        failed += 1;
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 410 || statusCode === 404) {
          expiredEndpoints.push(sub.endpoint);
        }
      }
    })
  );

  if (expiredEndpoints.length > 0) {
    await PushSubscription.deleteMany({
      endpoint: { $in: expiredEndpoints },
    });
  }

  return { sent, failed, removed: expiredEndpoints.length };
}

/**
 * 알림 발송을 시도하되, 실패해도 예외를 던지지 않습니다.
 * 일정/셋리스트 등록 같은 본 작업이 알림 실패로 막히지 않도록 할 때 사용합니다.
 */
export async function trySendPushToAll(payload: PushPayload): Promise<void> {
  try {
    const result = await sendPushToAll(payload);
    console.log('푸시 자동 발송 결과:', result);
  } catch (error) {
    console.error('푸시 자동 발송 실패(무시하고 진행):', error);
  }
}
