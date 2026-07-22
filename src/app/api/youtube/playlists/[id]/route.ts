import { NextRequest, NextResponse } from 'next/server';

// 1시간마다 재검증 (캐싱)
export const revalidate = 3600;

// 특정 재생목록의 영상 목록
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API 설정이 필요합니다' },
        { status: 500 }
      );
    }

    const pageToken = request.nextUrl.searchParams.get('pageToken');
    const tokenParam = pageToken ? `&pageToken=${pageToken}` : '';

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${id}&part=snippet,contentDetails&maxResults=25${tokenParam}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('YouTube 재생목록 영상 호출 실패:', error);
    return NextResponse.json(
      { error: 'YouTube 재생목록 영상 호출 실패' },
      { status: 500 }
    );
  }
}
