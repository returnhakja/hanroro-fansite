import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Fanchant from '@/lib/db/models/Fanchant';
import { requireAuth } from '@/lib/auth/middleware';
import { parseLyrics } from '@/lib/utils/parseLyrics';

// GET /api/admin/fanchants - 응원법 목록
async function handleGet() {
  try {
    await connectDB();
    const fanchants = await Fanchant.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ fanchants });
  } catch (error) {
    console.error('응원법 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '응원법 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST /api/admin/fanchants - 응원법 생성
async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const { songTitle, album, albumImageUrl, order, lyricsRaw } = body;

    if (!songTitle || !album) {
      return NextResponse.json(
        { error: '곡명과 앨범명은 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const fanchant = await Fanchant.create({
      songTitle,
      album,
      albumImageUrl,
      order: order ?? 0,
      lyrics: parseLyrics(lyricsRaw ?? ''),
    });

    return NextResponse.json({ fanchant }, { status: 201 });
  } catch (error) {
    console.error('응원법 생성 오류:', error);
    return NextResponse.json(
      { error: '응원법 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const POST = requireAuth(handlePost);
