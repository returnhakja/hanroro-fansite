import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Concert from '@/lib/db/models/Concert';
import SetList from '@/lib/db/models/SetList';

// GET /api/setlists/active - 활성 공연의 셋리스트 (공개 API)
export async function GET() {
  try {
    await connectDB();

    // 활성 공연 찾기
    const activeConcert = await Concert.findOne({ isActive: true });

    if (!activeConcert) {
      return NextResponse.json({ concert: null, setlists: [] });
    }

    // 해당 공연의 셋리스트 조회
    const setlists = await SetList.find({
      concertId: activeConcert._id,
    }).sort({ day: 1 });

    return NextResponse.json({
      concert: activeConcert,
      setlists,
    });
  } catch (error) {
    console.error('활성 셋리스트 조회 오류:', error);
    return NextResponse.json(
      { error: '셋리스트를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
