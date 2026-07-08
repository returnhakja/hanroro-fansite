import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createPresignedUploadUrl } from '@/lib/storage/r2';

/**
 * 통합 업로드 엔드포인트 (Cloudflare R2 presigned URL 발급)
 * - ?type=gallery (기본): 갤러리 이미지/동영상 → gallery/ 접두사
 * - ?type=board            : 게시판 에디터 미디어 → board/ 접두사
 *
 * 요청: { filename: string, contentType: string }
 * 응답: { uploadUrl: string, publicUrl: string }
 *   → 클라이언트가 uploadUrl 로 PUT(파일) 후, publicUrl 을 저장/사용
 */

// SVG(스크립트 내장 XSS)와 octet-stream(임의 파일)은 제외
const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const type = request.nextUrl.searchParams.get('type') ?? 'gallery';
    const prefix = type === 'board' ? 'board' : 'gallery';

    const { filename, contentType } = (await request.json()) as {
      filename?: string;
      contentType?: string;
    };

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename과 contentType이 필요합니다' },
        { status: 400 }
      );
    }

    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: '허용되지 않은 파일 형식입니다' },
        { status: 400 }
      );
    }

    // 경로 조작 방지: 파일명 정규화 후 서버에서 접두사/타임스탬프 부여
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${prefix}/${Date.now()}-${sanitized}`;

    const { uploadUrl, publicUrl } = await createPresignedUploadUrl(
      key,
      contentType
    );

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('업로드 URL 발급 오류:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
