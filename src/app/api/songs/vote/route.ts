import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import SongTally from '@/lib/db/models/SongTally';
import SongVote from '@/lib/db/models/SongVote';
import { getDiscographySongs } from '@/data/artistData';

const VOTER_COOKIE = 'vid';
const ONE_YEAR = 60 * 60 * 24 * 365;

interface MyVoteResponse {
  songTitle: string | null;
}

// GET /api/songs/vote - 내 현재 최애곡 픽 조회 (쿠키 기반, 로그인 불필요)
export async function GET(request: NextRequest) {
  try {
    const voterId = request.cookies.get(VOTER_COOKIE)?.value;
    if (!voterId) {
      return NextResponse.json<MyVoteResponse>({ songTitle: null });
    }
    await connectDB();
    const vote = await SongVote.findOne({ voterId }, 'songTitle').lean();
    return NextResponse.json<MyVoteResponse>({
      songTitle: vote?.songTitle ?? null,
    });
  } catch (error) {
    console.error('내 투표 조회 오류:', error);
    return NextResponse.json({ error: '투표 정보를 불러오지 못했습니다' }, { status: 500 });
  }
}

// POST /api/songs/vote - 최애곡 투표/변경/취소 (익명, 쿠키당 1표)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const songTitle = typeof body.songTitle === 'string' ? body.songTitle : '';

    // 디스코그래피에 실제 존재하는 곡만 허용
    const validTitles = new Set(getDiscographySongs().map((s) => s.title));
    if (!validTitles.has(songTitle)) {
      return NextResponse.json({ error: '존재하지 않는 곡입니다' }, { status: 400 });
    }

    // 투표자 식별 (없으면 새로 발급)
    let voterId = request.cookies.get(VOTER_COOKIE)?.value;
    const isNewVoter = !voterId;
    if (!voterId) voterId = crypto.randomUUID();

    await connectDB();

    const existing = await SongVote.findOne({ voterId });
    let currentPick: string | null;

    if (!existing) {
      // 첫 투표
      await SongVote.create({ voterId, songTitle });
      await SongTally.updateOne(
        { songTitle },
        { $inc: { count: 1 } },
        { upsert: true }
      );
      currentPick = songTitle;
    } else if (existing.songTitle === songTitle) {
      // 같은 곡 재클릭 → 취소
      await SongVote.deleteOne({ voterId });
      await SongTally.updateOne({ songTitle }, { $inc: { count: -1 } });
      currentPick = null;
    } else {
      // 다른 곡으로 변경 → 이전 곡 차감, 새 곡 증가
      const prev = existing.songTitle;
      existing.songTitle = songTitle;
      await existing.save();
      await SongTally.bulkWrite([
        {
          updateOne: {
            filter: { songTitle },
            update: { $inc: { count: 1 } },
            upsert: true,
          },
        },
        {
          updateOne: {
            filter: { songTitle: prev },
            update: { $inc: { count: -1 } },
          },
        },
      ]);
      currentPick = songTitle;
    }

    // 차트 서버 캐시는 30초 후 자동 만료되어 반영된다.
    // (투표자 본인은 클라이언트 낙관적 업데이트로 즉시 반영됨)
    const res = NextResponse.json<MyVoteResponse>({ songTitle: currentPick });
    if (isNewVoter) {
      res.cookies.set(VOTER_COOKIE, voterId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: ONE_YEAR,
        path: '/',
      });
    }
    return res;
  } catch (error) {
    console.error('투표 처리 오류:', error);
    return NextResponse.json({ error: '투표에 실패했습니다' }, { status: 500 });
  }
}
