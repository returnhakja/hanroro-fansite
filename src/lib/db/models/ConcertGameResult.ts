import mongoose, { Document, Schema, Model } from 'mongoose';

// 공연 날짜·장소 맞추기 게임 한 판의 결과(집계값만 저장, 문항별 상세는 보관하지 않음).
export interface IConcertGameResult extends Document {
  voterId: string;
  nickname: string;
  score: number;
  dateCorrectCount: number;
  venueCorrectCount: number;
  concertNameCorrectCount: number;
  createdAt: Date;
}

const concertGameResultSchema = new Schema<IConcertGameResult>(
  {
    voterId: { type: String, required: true },
    nickname: { type: String, required: true, maxlength: 8 },
    score: { type: Number, required: true, min: 0, max: 10 },
    dateCorrectCount: { type: Number, required: true, min: 0, max: 10 },
    venueCorrectCount: { type: Number, required: true, min: 0, max: 10 },
    concertNameCorrectCount: { type: Number, required: true, min: 0, max: 10 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

concertGameResultSchema.index({ score: -1, createdAt: 1 });

const ConcertGameResult: Model<IConcertGameResult> =
  mongoose.models.ConcertGameResult ||
  mongoose.model<IConcertGameResult>(
    'ConcertGameResult',
    concertGameResultSchema,
    'concertgameresults'
  );

export default ConcertGameResult;
