import { NextRequest, NextResponse } from 'next/server';
import { isR2Url, keyFromR2Url, createPresignedDownloadUrl } from '@/lib/storage/r2';

/**
 * 이미지/동영상 다운로드 (Cloudflare R2)
 *
 * r2.dev 공개 URL은 버킷 CORS가 적용되지 않아 브라우저 fetch() 다운로드가
 * 막힌다. 대신 서버가 presigned GET URL(Content-Disposition: attachment)을
 * 만들어 302 리다이렉트하면, 브라우저가 R2에 "직접" 접속해 파일을 받는다.
 * → 파일 바이트는 Vercel/서버를 거치지 않음 (R2 egress 무료), CORS도 무관.
 *
 * 요청: GET /api/download?url=<R2 공개 URL>&filename=<저장할 파일명>
 *   - url 은 R2 공개 URL(R2_PUBLIC_URL 로 시작)만 허용 (오픈 프록시/SSRF 방지)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl.searchParams.get('url');
  const filename = request.nextUrl.searchParams.get('filename');

  if (!url) {
    return NextResponse.json({ error: 'url이 필요합니다' }, { status: 400 });
  }

  // 화이트리스트: 우리 R2 공개 URL만 허용 (임의 외부 URL 차단)
  const key = keyFromR2Url(url);
  if (!isR2Url(url) || !key) {
    return NextResponse.json(
      { error: '허용되지 않은 URL입니다' },
      { status: 400 }
    );
  }

  try {
    const ext = key.split('.').pop()?.split('?')[0] || 'bin';
    const safeName = (filename || 'download').replace(/[^\w.-]/g, '_');
    const downloadName = `${safeName}.${ext}`;

    const presignedUrl = await createPresignedDownloadUrl(key, downloadName);

    // R2로 직접 리다이렉트 → 파일 다운로드는 Vercel을 거치지 않는다
    return NextResponse.redirect(presignedUrl, 302);
  } catch (error) {
    console.error('다운로드 URL 발급 오류:', error);
    return NextResponse.json({ error: '다운로드 실패' }, { status: 500 });
  }
}
