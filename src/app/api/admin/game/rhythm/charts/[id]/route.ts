import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import RhythmChart from '@/lib/db/models/RhythmChart';
import { isRhythmDifficulty, RHYTHM_LANE_COUNT } from '@/lib/game/rhythm';

interface NoteInput {
  lane?: number;
  timeMs?: number;
}

// 유튜브 전체 URL이 들어와도 영상 ID만 뽑아 저장한다
function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return trimmed;
}

interface ChartUpdateInput {
  title?: string;
  youtubeId?: string;
  startSeconds?: number;
  bpm?: number;
  offsetMs?: number;
  difficulty?: string;
  isActive?: boolean;
  notes?: NoteInput[];
}

function validateNotes(notes: unknown): string | null {
  if (!Array.isArray(notes)) return '박자맵 형식이 올바르지 않습니다';
  for (const n of notes as NoteInput[]) {
    if (
      typeof n.lane !== 'number' ||
      n.lane < 0 ||
      n.lane >= RHYTHM_LANE_COUNT ||
      typeof n.timeMs !== 'number' ||
      n.timeMs < 0
    ) {
      return '박자맵에 잘못된 노트가 있습니다';
    }
  }
  return null;
}

// GET /api/admin/game/rhythm/charts/[id] - 차트 에디터용 단건 조회(노트 전체 포함)
async function handleGet(
  _req: AuthenticatedRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    await connectDB();
    const chart = await RhythmChart.findById(id).lean();
    if (!chart) {
      return NextResponse.json({ error: '곡을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({
      chart: {
        _id: (chart._id as { toString(): string }).toString(),
        title: chart.title,
        youtubeId: chart.youtubeId,
        startSeconds: chart.startSeconds,
        bpm: chart.bpm,
        offsetMs: chart.offsetMs,
        difficulty: chart.difficulty,
        notes: chart.notes,
        isActive: chart.isActive,
      },
    });
  } catch (error) {
    console.error('리듬게임 차트 조회 오류:', error);
    return NextResponse.json(
      { error: '차트를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/game/rhythm/charts/[id] - 곡 정보/박자맵/활성화 상태 수정
async function handlePut(
  req: AuthenticatedRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const body = (await req.json()) as ChartUpdateInput;
    const $set: Record<string, unknown> = {};

    if (body.title !== undefined) {
      if (!body.title.trim()) return NextResponse.json({ error: '곡 제목을 입력해주세요' }, { status: 400 });
      $set.title = body.title.trim();
    }
    if (body.youtubeId !== undefined) {
      if (!body.youtubeId.trim()) return NextResponse.json({ error: '유튜브 ID를 입력해주세요' }, { status: 400 });
      $set.youtubeId = extractYoutubeId(body.youtubeId);
    }
    if (body.startSeconds !== undefined) $set.startSeconds = body.startSeconds;
    if (body.bpm !== undefined) $set.bpm = body.bpm;
    if (body.offsetMs !== undefined) $set.offsetMs = body.offsetMs;
    if (body.difficulty !== undefined) {
      if (!isRhythmDifficulty(body.difficulty)) return NextResponse.json({ error: '난이도가 올바르지 않습니다' }, { status: 400 });
      $set.difficulty = body.difficulty;
    }
    if (body.isActive !== undefined) $set.isActive = body.isActive;
    if (body.notes !== undefined) {
      const error = validateNotes(body.notes);
      if (error) return NextResponse.json({ error }, { status: 400 });
      $set.notes = body.notes;
    }

    await connectDB();
    const updated = await RhythmChart.findByIdAndUpdate(id, { $set }, { new: true, runValidators: true });
    if (!updated) {
      return NextResponse.json({ error: '곡을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error('리듬게임 차트 수정 오류:', error);
    return NextResponse.json(
      { error: '차트를 수정하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/game/rhythm/charts/[id] - 곡 삭제
async function handleDelete(
  _req: AuthenticatedRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    await connectDB();
    await RhythmChart.findByIdAndDelete(id);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('리듬게임 차트 삭제 오류:', error);
    return NextResponse.json(
      { error: '삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const PUT = requireAuth(handlePut);
export const DELETE = requireAuth(handleDelete);
