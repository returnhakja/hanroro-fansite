import { NextResponse } from 'next/server';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import GameSong from '@/lib/db/models/GameSong';
import { getDiscographySongs } from '@/data/artistData';

// GET /api/admin/game/songs - 디스코그래피 전곡 + 설정된 재생 구간을 합쳐서 반환
async function handleGet() {
  try {
    await connectDB();
    const [songs, configured] = await Promise.all([
      Promise.resolve(getDiscographySongs()),
      GameSong.find().lean(),
    ]);

    const configMap = new Map(configured.map((c) => [c.songTitle, c]));

    const rows = songs.map((song) => {
      const config = configMap.get(song.title);
      return {
        songTitle: song.title,
        album: song.album,
        albumImageUrl: song.albumImageUrl,
        youtubeId: config?.youtubeId ?? '',
        startSeconds: config?.startSeconds ?? null,
      };
    });

    return NextResponse.json({ songs: rows });
  } catch (error) {
    console.error('게임 곡 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '곡 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/game/songs - 곡별 재생 구간 일괄 저장
async function handlePut(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const entries = body.songs;
    if (!Array.isArray(entries)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const validTitles = new Set(getDiscographySongs().map((s) => s.title));

    await connectDB();
    const ops = entries
      .filter(
        (e) =>
          validTitles.has(e?.songTitle) &&
          typeof e?.youtubeId === 'string' &&
          e.youtubeId.trim() &&
          typeof e?.startSeconds === 'number' &&
          e.startSeconds >= 0
      )
      .map((e) => ({
        updateOne: {
          filter: { songTitle: e.songTitle },
          update: {
            $set: { youtubeId: e.youtubeId.trim(), startSeconds: e.startSeconds },
          },
          upsert: true,
        },
      }));

    if (ops.length > 0) {
      await GameSong.bulkWrite(ops);
    }

    return NextResponse.json({ saved: ops.length });
  } catch (error) {
    console.error('게임 곡 설정 저장 오류:', error);
    return NextResponse.json(
      { error: '저장 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const PUT = requireAuth(handlePut);
