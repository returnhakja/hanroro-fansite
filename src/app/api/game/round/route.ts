import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import GameSong from '@/lib/db/models/GameSong';
import { getDiscographySongs } from '@/data/artistData';
import { isGameDifficulty, DIFFICULTY_SECONDS, QUESTIONS_PER_ROUND } from '@/lib/game/difficulty';
import { signRoundToken } from '@/lib/game/roundToken';

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// POST /api/game/round - 난이도를 받아 10곡을 랜덤으로 뽑고, 정답은 노출하지 않는
// 서명된 라운드 토큰을 발급한다.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const difficulty = body.difficulty;
    if (!isGameDifficulty(difficulty)) {
      return NextResponse.json({ error: '올바르지 않은 난이도입니다' }, { status: 400 });
    }

    await connectDB();

    // 디스코그래피에 실제 존재하고, 관리자가 재생 구간을 설정해둔 곡만 출제 대상
    const validTitles = new Set(getDiscographySongs().map((s) => s.title));
    const configured = await GameSong.find().lean();
    const playable = configured.filter((s) => validTitles.has(s.songTitle));

    if (playable.length < QUESTIONS_PER_ROUND) {
      return NextResponse.json(
        { error: '출제 가능한 곡이 부족합니다. 관리자 설정이 더 필요해요.' },
        { status: 409 }
      );
    }

    const picked = shuffle(playable).slice(0, QUESTIONS_PER_ROUND);
    const songTitles = picked.map((s) => s.songTitle);
    const roundToken = signRoundToken(difficulty, songTitles);

    return NextResponse.json({
      roundToken,
      seconds: DIFFICULTY_SECONDS[difficulty],
      clips: picked.map((s) => ({ youtubeId: s.youtubeId, startSeconds: s.startSeconds })),
    });
  } catch (error) {
    console.error('게임 라운드 발급 오류:', error);
    return NextResponse.json(
      { error: '라운드를 시작하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
