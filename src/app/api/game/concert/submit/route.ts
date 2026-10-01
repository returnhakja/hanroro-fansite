import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ConcertGameQuestion from '@/lib/db/models/ConcertGameQuestion';
import ConcertGameResult from '@/lib/db/models/ConcertGameResult';
import { verifyConcertRoundToken } from '@/lib/game/concertRoundToken';

const VOTER_COOKIE = 'vid';
const ONE_YEAR = 60 * 60 * 24 * 365;

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

interface AnswerInput {
  questionId?: string;
  pickedDate?: string;
  pickedVenue?: string;
  pickedConcertName?: string;
}

// POST /api/game/concert/submit - 라운드 토큰을 검증하고 서버가 보관한 정답과 비교해 채점한다.
// 정답은 이 시점 전까지 클라이언트에 노출되지 않는다.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { roundToken } = body;
    const answers: unknown = body.answers;

    if (typeof roundToken !== 'string' || !Array.isArray(answers)) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    const payload = verifyConcertRoundToken(roundToken);
    if (!payload) {
      return NextResponse.json(
        { error: '라운드가 만료되었거나 유효하지 않아요. 다시 시작해주세요.' },
        { status: 410 }
      );
    }
    if (answers.length !== payload.questionIds.length) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }

    await connectDB();
    const questions = await ConcertGameQuestion.find({
      _id: { $in: payload.questionIds },
    }).lean();
    const questionMap = new Map(
      questions.map((q) => [(q._id as { toString(): string }).toString(), q])
    );

    let dateCorrectCount = 0;
    let venueCorrectCount = 0;
    let concertNameCorrectCount = 0;
    let score = 0;

    const results = payload.questionIds.map((questionId, i) => {
      const answer = answers[i] as AnswerInput | undefined;
      const question = questionMap.get(questionId);

      if (!question || !answer || answer.questionId !== questionId) {
        return {
          questionId,
          imageUrl: question?.imageUrl ?? '',
          pickedDate: '',
          pickedVenue: '',
          pickedConcertName: '',
          correctDate: question ? formatDate(question.correctDate) : '',
          correctVenue: question?.correctVenue ?? '',
          correctConcertName: question?.correctConcertName ?? '',
          dateCorrect: false,
          venueCorrect: false,
          concertNameCorrect: false,
        };
      }

      const correctDate = formatDate(question.correctDate);
      const dateCorrect = answer.pickedDate === correctDate;
      const venueCorrect = answer.pickedVenue === question.correctVenue;
      const concertNameCorrect = answer.pickedConcertName === question.correctConcertName;
      if (dateCorrect) dateCorrectCount++;
      if (venueCorrect) venueCorrectCount++;
      if (concertNameCorrect) concertNameCorrectCount++;
      if (dateCorrect && venueCorrect && concertNameCorrect) score++;

      return {
        questionId,
        imageUrl: question.imageUrl,
        pickedDate: answer.pickedDate ?? '',
        pickedVenue: answer.pickedVenue ?? '',
        pickedConcertName: answer.pickedConcertName ?? '',
        correctDate,
        correctVenue: question.correctVenue,
        correctConcertName: question.correctConcertName,
        dateCorrect,
        venueCorrect,
        concertNameCorrect,
      };
    });

    let voterId = request.cookies.get(VOTER_COOKIE)?.value;
    const isNewVoter = !voterId;
    if (!voterId) voterId = crypto.randomUUID();

    const doc = await ConcertGameResult.create({
      voterId,
      nickname: '익명',
      score,
      dateCorrectCount,
      venueCorrectCount,
      concertNameCorrectCount,
    });

    const res = NextResponse.json({
      resultId: doc._id.toString(),
      score,
      dateCorrectCount,
      venueCorrectCount,
      concertNameCorrectCount,
      results,
    });
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
    console.error('공연 맞추기 채점 오류:', error);
    return NextResponse.json(
      { error: '채점 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
