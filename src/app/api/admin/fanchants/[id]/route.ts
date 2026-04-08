import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Fanchant from '@/lib/db/models/Fanchant';
import { requireAuth } from '@/lib/auth/middleware';
import { parseLyrics } from '@/lib/utils/parseLyrics';

// PUT /api/admin/fanchants/[id] - 응원법 수정
async function handlePut(
  req: NextRequest,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;
    const body = await req.json();
    const { songTitle, album, albumImageUrl, order, lyricsRaw } = body;

    if (!songTitle || !album) {
      return NextResponse.json(
        { error: '곡명과 앨범명은 필수입니다' },
        { status: 400 }
      );
    }

    await connectDB();

    const fanchant = await Fanchant.findByIdAndUpdate(
      id,
      {
        $set: {
          songTitle,
          album,
          albumImageUrl,
          order: order ?? 0,
          lyrics: parseLyrics(lyricsRaw ?? ''),
        },
      },
      { new: true }
    );

    if (!fanchant) {
      return NextResponse.json({ error: '응원법을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ fanchant });
  } catch (error) {
    console.error('응원법 수정 오류:', error);
    return NextResponse.json(
      { error: '응원법 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/fanchants/[id] - 응원법 삭제
async function handleDelete(
  req: NextRequest,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const { id } = await context.params;

    await connectDB();

    const fanchant = await Fanchant.findByIdAndDelete(id);

    if (!fanchant) {
      return NextResponse.json({ error: '응원법을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ message: '응원법이 삭제되었습니다' });
  } catch (error) {
    console.error('응원법 삭제 오류:', error);
    return NextResponse.json(
      { error: '응원법 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(handlePut);
export const DELETE = requireAuth(handleDelete);
