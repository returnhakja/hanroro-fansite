import { NextResponse } from 'next/server';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import ConcertGameQuestion from '@/lib/db/models/ConcertGameQuestion';

interface QuestionInput {
  imageUrl?: string;
  correctDate?: string;
  correctVenue?: string;
  correctConcertName?: string;
  wrongDates?: string[];
  wrongVenues?: string[];
  wrongConcertNames?: string[];
  credit?: string;
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

// GET /api/admin/game/concert/questions - 전체 문제 목록(비활성 포함)
async function handleGet() {
  try {
    await connectDB();
    const questions = await ConcertGameQuestion.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      questions: questions.map((q) => ({
        _id: (q._id as { toString(): string }).toString(),
        imageUrl: q.imageUrl,
        correctDate: q.correctDate,
        correctVenue: q.correctVenue,
        correctConcertName: q.correctConcertName,
        wrongDates: q.wrongDates,
        wrongVenues: q.wrongVenues,
        wrongConcertNames: q.wrongConcertNames,
        credit: q.credit ?? '',
        isActive: q.isActive,
        createdAt: q.createdAt,
      })),
    });
  } catch (error) {
    console.error('공연 맞추기 문제 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '문제 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST /api/admin/game/concert/questions - 문제 등록
async function handlePost(req: AuthenticatedRequest) {
  try {
    const body = (await req.json()) as QuestionInput;
    const error = validatePayload(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await connectDB();
    const doc = await ConcertGameQuestion.create({
      imageUrl: body.imageUrl!.trim(),
      correctDate: new Date(body.correctDate!),
      correctVenue: body.correctVenue!.trim(),
      correctConcertName: body.correctConcertName!.trim(),
      wrongDates: body.wrongDates!.map((d) => new Date(d)),
      wrongVenues: body.wrongVenues!.map((v) => v.trim()),
      wrongConcertNames: body.wrongConcertNames!.map((v) => v.trim()),
      credit: body.credit?.trim() || undefined,
    });

    return NextResponse.json({ _id: doc._id.toString() }, { status: 201 });
  } catch (error) {
    console.error('공연 맞추기 문제 등록 오류:', error);
    return NextResponse.json(
      { error: '문제를 등록하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGet);
export const POST = requireAuth(handlePost);
