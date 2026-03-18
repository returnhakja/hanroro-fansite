import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
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
        const payload = clientPayload ? JSON.parse(clientPayload) : {};
        return {
          allowedContentTypes: [
            'image/*',
            'video/*',
            'application/octet-stream',
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
          tokenPayload: JSON.stringify({
            userId: session.user.id,
            title: payload.title || '',
            mediaType: payload.mediaType || 'image',
          }),
        };
      },
      onUploadCompleted: async () => {
        // DB 저장은 클라이언트에서 /api/images POST로 처리
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
