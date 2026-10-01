import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import ConcertGameQuestion from '@/lib/db/models/ConcertGameQuestion';

interface QuestionInput {
  imageUrl?: string;
  correctDate?: string;
  correctVenue?: string;
  wrongDates?: string[];
  wrongVenues?: string[];
  credit?: string;
  isActive?: boolean;
}

function validatePayload(body: QuestionInput): string | null {
  if (!body.imageUrl?.trim()) return '이미지를 등록해주세요';
  if (!body.correctDate || Number.isNaN(Date.parse(body.correctDate))) return '정답 날짜를 입력해주세요';
  if (!body.correctVenue?.trim()) return '정답 장소를 입력해주세요';
  if (!Array.isArray(body.wrongDates) || body.wrongDates.length !== 3 || body.wrongDates.some((d) => Number.isNaN(Date.parse(d)))) {
    return '오답 날짜 3개를 모두 입력해주세요';
  }
  if (!Array.isArray(body.wrongVenues) || body.wrongVenues.length !== 3 || body.wrongVenues.some((v) => !v?.trim())) {
    return '오답 장소 3개를 모두 입력해주세요';
  }
  return null;
}

// PUT /api/admin/game/concert/questions/[id] - 문제 수정(활성/비활성 토글 포함)
async function handlePut(
  req: AuthenticatedRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const body = (await req.json()) as QuestionInput;
    const error = validatePayload(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await connectDB();
    const updated = await ConcertGameQuestion.findByIdAndUpdate(
      id,
      {
        $set: {
          imageUrl: body.imageUrl!.trim(),
          correctDate: new Date(body.correctDate!),
          correctVenue: body.correctVenue!.trim(),
          wrongDates: body.wrongDates!.map((d) => new Date(d)),
          wrongVenues: body.wrongVenues!.map((v) => v.trim()),
          credit: body.credit?.trim() || undefined,
          isActive: body.isActive ?? true,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: '문제를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error('공연 맞추기 문제 수정 오류:', error);
    return NextResponse.json(
      { error: '문제를 수정하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/game/concert/questions/[id] - 문제 삭제
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
    await ConcertGameQuestion.findByIdAndDelete(id);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('공연 맞추기 문제 삭제 오류:', error);
    return NextResponse.json(
      { error: '삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(handlePut);
export const DELETE = requireAuth(handleDelete);
