import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@/lib/auth/auth';

/**
 * 통합 업로드 엔드포인트
 * - ?type=gallery (기본): 갤러리 이미지/동영상 업로드 - tokenPayload에 userId/title/mediaType 포함
 * - ?type=board: 게시판 에디터 미디어 업로드 - tokenPayload 없음, 갤러리 DB에 저장하지 않음
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const type = request.nextUrl.searchParams.get('type') ?? 'gallery';
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const session = await auth();
        if (!session?.user?.id) {
          throw new Error('로그인이 필요합니다');
        }

        const baseOptions = {
          allowedContentTypes: [
            'image/*',
            'video/*',
            'application/octet-stream',
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
        };

        if (type === 'board') {
          return baseOptions;
        }

        // gallery
        const payload = clientPayload ? JSON.parse(clientPayload) : {};
        return {
          ...baseOptions,
          tokenPayload: JSON.stringify({
            userId: session.user.id,
            title: payload.title || '',
            mediaType: payload.mediaType || 'image',
          }),
        };
      },
      onUploadCompleted: async () => {
        // 갤러리 DB 저장은 클라이언트에서 /api/images POST로 처리
        // 게시판 미디어는 갤러리 DB에 저장하지 않음
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
