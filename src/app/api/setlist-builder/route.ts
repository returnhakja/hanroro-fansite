import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import FavoriteSetlist from '@/lib/db/models/FavoriteSetlist';
import { isValidSongTitle } from '@/lib/utils/songs';

const MAX_SONGS = 20;

// 로그인한 사용자의 최애 세트리스트 목록 (마이페이지용)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const mine = request.nextUrl.searchParams.get('mine');

    if (!mine) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    await connectDB();
    const setlists = await FavoriteSetlist.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ setlists });
  } catch (error) {
    console.error('최애 세트리스트 목록 조회 오류:', error);
    return NextResponse.json({ error: '목록을 불러올 수 없습니다' }, { status: 500 });
  }
}

// 최애 세트리스트 생성 (로그인 없이도 가능. 완성 후에는 수정/삭제 기능이 없는 스냅샷 콘텐츠)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const songs = body?.songs;

    if (!Array.isArray(songs) || songs.length === 0) {
      return NextResponse.json({ error: '곡을 1개 이상 담아주세요' }, { status: 400 });
    }

    if (songs.length > MAX_SONGS) {
      return NextResponse.json(
        { error: `세트리스트는 최대 ${MAX_SONGS}곡까지 담을 수 있습니다` },
        { status: 400 }
      );
    }

    const cleanSongs: string[] = [];
    const seen = new Set<string>();
    for (const title of songs) {
      if (typeof title !== 'string' || !isValidSongTitle(title)) {
        return NextResponse.json({ error: '유효하지 않은 곡이 포함되어 있습니다' }, { status: 400 });
      }
      if (seen.has(title)) continue;
      seen.add(title);
      cleanSongs.push(title);
    }

    await connectDB();
    const setlist = await FavoriteSetlist.create({
      songs: cleanSongs,
      userId: session?.user?.id || null,
    });

    return NextResponse.json(setlist, { status: 201 });
  } catch (error) {
    console.error('최애 세트리스트 생성 오류:', error);
    return NextResponse.json({ error: '세트리스트를 저장할 수 없습니다' }, { status: 500 });
  }
}
