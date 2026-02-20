import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Concert from '@/lib/db/models/Concert';
import SetList from '@/lib/db/models/SetList';

export async function GET() {
  try {
    await connectDB();

    const concerts = await Concert.find().sort({ startDate: -1 });

    const concertsWithSetlists = await Promise.all(
      concerts.map(async (concert) => {
        const setlists = await SetList.find({
          concertId: concert._id,
        }).sort({ day: 1 });

        return {
          _id: concert._id,
          title: concert.title,
          venue: concert.venue,
          startDate: concert.startDate,
          endDate: concert.endDate,
          posterUrl: concert.posterUrl,
          isActive: concert.isActive,
          setlists: setlists,
        };
      })
    );

    return NextResponse.json({ concerts: concertsWithSetlists });
  } catch (error) {
    console.error('공연 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '공연 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
