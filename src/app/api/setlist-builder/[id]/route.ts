import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import FavoriteSetlist from '@/lib/db/models/FavoriteSetlist';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const setlist = await FavoriteSetlist.findById(id);

    if (!setlist) {
      return NextResponse.json({ error: '세트리스트를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(setlist);
  } catch (error) {
    console.error('최애 세트리스트 조회 오류:', error);
    return NextResponse.json({ error: '세트리스트를 불러올 수 없습니다' }, { status: 500 });
  }
}
