import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Fanchant from '@/lib/db/models/Fanchant';

// GET /api/fanchants - 응원법 목록 (공개)
export async function GET() {
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
