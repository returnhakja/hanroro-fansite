import webpush from 'web-push';

let configured = false;

/**
 * VAPID 인증 정보를 설정한 web-push 인스턴스를 반환합니다.
 * 최초 호출 시 1회만 setVapidDetails를 실행합니다.
 */
export function getWebPush() {
  if (!configured) {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT;

    if (!publicKey || !privateKey || !subject) {
      throw new Error(
        'VAPID 환경변수(NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT)가 설정되지 않았습니다'
      );
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);
    configured = true;
  }

  return webpush;
}
