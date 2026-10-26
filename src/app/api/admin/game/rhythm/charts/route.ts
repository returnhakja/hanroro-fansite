import { NextResponse } from 'next/server';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import RhythmChart from '@/lib/db/models/RhythmChart';
import { isRhythmDifficulty } from '@/lib/game/rhythm';

interface ChartInput {
  title?: string;
  youtubeId?: string;
  startSeconds?: number;
  bpm?: number;
  offsetMs?: number;
  difficulty?: string;
}

function validatePayload(body: ChartInput): string | null {
  if (!body.title?.trim()) return '곡 제목을 입력해주세요';
  if (!body.youtubeId?.trim()) return '유튜브 링크/ID를 입력해주세요';
  if (typeof body.startSeconds !== 'number' || body.startSeconds < 0) return '시작 초를 입력해주세요';
  if (typeof body.bpm !== 'number' || body.bpm < 20 || body.bpm > 300) return 'BPM을 20~300 사이로 입력해주세요';
  if (typeof body.offsetMs !== 'number') return '오프셋을 입력해주세요';
  if (!isRhythmDifficulty(body.difficulty)) return '난이도를 선택해주세요';
  return null;
}

// 유튜브 전체 URL이 들어와도 영상 ID만 뽑아 저장한다
function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return trimmed;
}

// GET /api/admin/game/rhythm/charts - 전체 곡/박자맵 목록(비활성 포함)
async function handleGet() {
  try {
    await connectDB();
    const charts = await RhythmChart.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      charts: charts.map((c) => ({
        _id: (c._id as { toString(): string }).toString(),
        title: c.title,
        youtubeId: c.youtubeId,
        startSeconds: c.startSeconds,
        bpm: c.bpm,
        offsetMs: c.offsetMs,
        difficulty: c.difficulty,
        noteCount: c.notes.length,
        isActive: c.isActive,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error('리듬게임 곡 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '곡 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST /api/admin/game/rhythm/charts - 곡 등록(박자맵은 비어있는 상태로 생성, 에디터에서 작성)
async function handlePost(req: AuthenticatedRequest) {
  try {
    const body = (await req.json()) as ChartInput;
    const error = validatePayload(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await connectDB();
    const doc = await RhythmChart.create({
      title: body.title!.trim(),
      youtubeId: extractYoutubeId(body.youtubeId!),
      startSeconds: body.startSeconds,
      bpm: body.bpm,
      offsetMs: body.offsetMs,
      difficulty: body.difficulty,
      notes: [],
      isActive: false,
    });

    return NextResponse.json({ _id: doc._id.toString() }, { status: 201 });
  } catch (error) {
    console.error('리듬게임 곡 등록 오류:', error);
    return NextResponse.json(
      { error: '곡을 등록하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const POST = requireAuth(handlePost);
