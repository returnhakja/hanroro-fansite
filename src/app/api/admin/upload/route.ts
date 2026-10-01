import { NextResponse } from 'next/server';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { createPresignedUploadUrl } from '@/lib/storage/r2';

/**
 * 관리자 전용 업로드 엔드포인트 (Cloudflare R2 presigned URL 발급)
 * - ?type=concertgame (기본): 공연 맞추기 게임 문제 이미지 → concertgame/ 접두사
 *
 * 요청: { filename: string, contentType: string }
 * 응답: { uploadUrl: string, publicUrl: string }
 */

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

async function handlePost(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const type = req.nextUrl.searchParams.get('type') ?? 'concertgame';
    const prefix = type === 'concertgame' ? 'concertgame' : 'admin';

    const { filename, contentType } = (await req.json()) as {
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

    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${prefix}/${Date.now()}-${sanitized}`;

    const { uploadUrl, publicUrl } = await createPresignedUploadUrl(
      key,
      contentType
    );

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('관리자 업로드 URL 발급 오류:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export const POST = requireAuth(handlePost);
