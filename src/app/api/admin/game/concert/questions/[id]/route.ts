import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import ConcertGameQuestion from '@/lib/db/models/ConcertGameQuestion';

interface QuestionInput {
  imageUrl?: string;
  correctDate?: string;
  correctVenue?: string;
  correctConcertName?: string;
  correctConcertId?: string;
  wrongDates?: string[];
  wrongVenues?: string[];
  wrongConcertNames?: string[];
  wrongConcertIds?: string[];
  credit?: string;
  isActive?: boolean;
}

/** 관리자 수정 화면에서 드롭다운을 다시 정확히 선택해 보여주기 위한 참조용 id. 비어있거나 유효하지 않으면 그냥 저장하지 않는다. */
function toObjectIdOrUndefined(id?: string): mongoose.Types.ObjectId | undefined {
  return id && mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : undefined;
}

function validatePayload(body: QuestionInput): string | null {
  if (!body.imageUrl?.trim()) return '이미지를 등록해주세요';
  if (!body.correctDate || Number.isNaN(Date.parse(body.correctDate))) return '정답 날짜를 입력해주세요';
  if (!body.correctVenue?.trim()) return '정답 장소를 입력해주세요';
  if (!body.correctConcertName?.trim()) return '정답 공연명을 입력해주세요';
  if (!Array.isArray(body.wrongDates) || body.wrongDates.length !== 3 || body.wrongDates.some((d) => Number.isNaN(Date.parse(d)))) {
    return '오답 날짜 3개를 모두 입력해주세요';
  }
  if (!Array.isArray(body.wrongVenues) || body.wrongVenues.length !== 3 || body.wrongVenues.some((v) => !v?.trim())) {
    return '오답 장소 3개를 모두 입력해주세요';
  }
  if (!Array.isArray(body.wrongConcertNames) || body.wrongConcertNames.length !== 3 || body.wrongConcertNames.some((v) => !v?.trim())) {
    return '오답 공연명 3개를 모두 입력해주세요';
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
          correctConcertName: body.correctConcertName!.trim(),
          correctConcertId: toObjectIdOrUndefined(body.correctConcertId),
          wrongDates: body.wrongDates!.map((d) => new Date(d)),
          wrongVenues: body.wrongVenues!.map((v) => v.trim()),
          wrongConcertNames: body.wrongConcertNames!.map((v) => v.trim()),
          wrongConcertIds: (body.wrongConcertIds ?? []).map(toObjectIdOrUndefined).filter(Boolean),
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
