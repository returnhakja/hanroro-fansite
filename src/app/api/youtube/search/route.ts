import { NextRequest, NextResponse } from 'next/server';

// 1시간마다 재검증 (캐싱)
export const revalidate = 3600;

// 채널 업로드 전체 영상 중 제목에 키워드가 포함된 것만 반환
export async function GET(request: NextRequest) {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!API_KEY || !CHANNEL_ID) {
      return NextResponse.json(
        { error: 'YouTube API 설정이 필요합니다' },
        { status: 500 }
      );
    }

    const keyword = request.nextUrl.searchParams.get('keyword') ?? '';
    if (!keyword.trim()) {
      return NextResponse.json({ items: [] });
    }

    // 채널의 "업로드 전체" 재생목록 ID: UC... → UU...
    const uploadsId = `UU${CHANNEL_ID.slice(2)}`;
    const needle = keyword.toLowerCase();

    const matched: unknown[] = [];
    let pageToken = '';

    // 안전장치: 최대 10페이지(500개)까지만 조회
    for (let i = 0; i < 10; i++) {
      const tokenParam = pageToken ? `&pageToken=${pageToken}` : '';
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${uploadsId}&part=snippet,contentDetails&maxResults=50${tokenParam}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`YouTube API error: ${res.status}`);
      }

      const data = await res.json();
      for (const item of data.items ?? []) {
        const title: string = item?.snippet?.title ?? '';
        if (title.toLowerCase().includes(needle)) {
          matched.push(item);
        }
      }

      if (!data.nextPageToken) break;
      pageToken = data.nextPageToken;
    }

    return NextResponse.json({ items: matched });
  } catch (error) {
    console.error('YouTube 키워드 검색 실패:', error);
    return NextResponse.json(
      { error: 'YouTube 키워드 검색 실패' },
      { status: 500 }
    );
  }
}
