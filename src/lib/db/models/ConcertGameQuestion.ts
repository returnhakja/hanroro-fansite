import mongoose, { Document, Schema, Model } from 'mongoose';

// 공연 날짜·장소·공연명 맞추기 게임의 문제 풀. 무대 사진 한 장에 정답 날짜/장소/공연명과
// 4지선다 구성을 위한 오답 3개씩을 함께 등록한다.
// 날짜/장소/공연명은 등록 당시의 값을 스냅샷으로 저장해(Concert 원본이 나중에 수정/삭제돼도
// 문제 내용이 안 바뀌도록), correctConcertId/wrongConcertIds는 관리자 수정 화면에서 드롭다운을
// 다시 정확히 선택해서 보여주기 위한 참조용 필드로만 쓴다(선택 사항, 게임 채점에는 쓰이지 않음).
export interface IConcertGameQuestion extends Document {
  imageUrl: string;
  correctDate: Date;
  correctVenue: string;
  correctConcertName: string;
  correctConcertId?: mongoose.Types.ObjectId;
  wrongDates: Date[];
  wrongVenues: string[];
  wrongConcertNames: string[];
  wrongConcertIds?: mongoose.Types.ObjectId[];
  credit?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function exactlyThree(arr: unknown[]): boolean {
  return arr.length === 3;
}

const concertGameQuestionSchema = new Schema<IConcertGameQuestion>(
  {
    imageUrl: { type: String, required: true, trim: true },
    correctDate: { type: Date, required: true },
    correctVenue: { type: String, required: true, trim: true },
    correctConcertName: { type: String, required: true, trim: true },
    correctConcertId: { type: Schema.Types.ObjectId, ref: 'Concert' },
    wrongDates: {
      type: [Date],
      required: true,
      validate: { validator: exactlyThree, message: '오답 날짜는 정확히 3개여야 해요' },
    },
    wrongVenues: {
      type: [String],
      required: true,
      validate: { validator: exactlyThree, message: '오답 장소는 정확히 3개여야 해요' },
    },
    wrongConcertNames: {
      type: [String],
      required: true,
      validate: { validator: exactlyThree, message: '오답 공연명은 정확히 3개여야 해요' },
    },
    wrongConcertIds: { type: [Schema.Types.ObjectId], ref: 'Concert' },
    credit: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

concertGameQuestionSchema.index({ isActive: 1 });

const ConcertGameQuestion: Model<IConcertGameQuestion> =
  mongoose.models.ConcertGameQuestion ||
  mongoose.model<IConcertGameQuestion>(
    'ConcertGameQuestion',
    concertGameQuestionSchema,
    'concertgamequestions'
  );

export default ConcertGameQuestion;
