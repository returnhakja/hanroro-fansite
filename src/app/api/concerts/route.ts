import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import Concert from '@/lib/db/models/Concert';
import SetList from '@/lib/db/models/SetList';

const DEFAULT_LIMIT = 10;

// 정렬과 완전히 같은 순서를 보장하기 위한 보조 정렬키.
// startDate만으로는 같은 날짜가 여러 개일 때 skip/limit 페이지 사이에서
// 순서가 흔들릴 수 있어서 _id를 2차 정렬키로 고정한다.
const SORT = { startDate: -1 as const, _id: -1 as const };

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function attachSetlists(concerts: InstanceType<typeof Concert>[]) {
  return Promise.all(
    concerts.map(async (concert) => {
      const setlists = await SetList.find({ concertId: concert._id }).sort({ day: 1 });
      return {
        _id: concert._id,
        title: concert.title,
        venue: concert.venue,
        startDate: concert.startDate,
        endDate: concert.endDate,
        posterUrl: concert.posterUrl,
        isActive: concert.isActive,
        setlists,
      };
    })
  );
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const locateId = searchParams.get('locateId');

    // 딥링크(?concertId=)로 들어왔을 때, 그 공연이 몇 페이지에 있는지만 알려준다.
    if (locateId) {
      if (!mongoose.Types.ObjectId.isValid(locateId)) {
        return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
      }
      const target = await Concert.findById(locateId);
      if (!target) {
        return NextResponse.json({ error: '공연을 찾을 수 없습니다' }, { status: 404 });
      }
      const rank = await Concert.countDocuments({
        $or: [
          { startDate: { $gt: target.startDate } },
          { startDate: target.startDate, _id: { $gt: target._id } },
        ],
      });
      const page = Math.floor(rank / DEFAULT_LIMIT) + 1;
      return NextResponse.json({ page });
    }

    const fetchAll = searchParams.get('all') === 'true';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(searchParams.get('limit')) || DEFAULT_LIMIT);
    const q = searchParams.get('q')?.trim();

    const filter = q
      ? {
          $or: [
            { title: { $regex: escapeRegExp(q), $options: 'i' } },
            { venue: { $regex: escapeRegExp(q), $options: 'i' } },
          ],
        }
      : {};

    // 일정(schedule) 페이지처럼 전체 목록이 필요한 화면을 위한 탈출구.
    // 셋리스트 페이지의 페이지네이션과는 별개로, 여기선 skip/limit을 안 건다.
    if (fetchAll) {
      const concerts = await Concert.find(filter).sort(SORT);
      const concertsWithSetlists = await attachSetlists(concerts);
      return NextResponse.json({
        concerts: concertsWithSetlists,
        page: 1,
        totalPages: 1,
        totalCount: concertsWithSetlists.length,
      });
    }

    const [concerts, totalCount] = await Promise.all([
      Concert.find(filter)
        .sort(SORT)
        .skip((page - 1) * limit)
        .limit(limit),
      Concert.countDocuments(filter),
    ]);

    const concertsWithSetlists = await attachSetlists(concerts);
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return NextResponse.json({
      concerts: concertsWithSetlists,
      page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error('공연 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '공연 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
