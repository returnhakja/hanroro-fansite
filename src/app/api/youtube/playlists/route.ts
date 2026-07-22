import { NextResponse } from 'next/server';

// 1시간마다 재검증 (캐싱)
export const revalidate = 3600;

// 채널의 재생목록 목록 (카테고리)
export async function GET() {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!API_KEY || !CHANNEL_ID) {
      return NextResponse.json(
        { error: 'YouTube API 설정이 필요합니다' },
        { status: 500 }
      );
    }

    const url = `https://www.googleapis.com/youtube/v3/playlists?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,contentDetails&maxResults=50`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('YouTube 재생목록 호출 실패:', error);
    return NextResponse.json(
      { error: 'YouTube 재생목록 호출 실패' },
      { status: 500 }
    );
  }
}
