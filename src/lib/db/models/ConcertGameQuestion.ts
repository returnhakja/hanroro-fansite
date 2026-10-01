import mongoose, { Document, Schema, Model } from 'mongoose';

// 공연 날짜·장소 맞추기 게임의 문제 풀. 무대 사진 한 장에 정답 날짜/장소와
// 4지선다 구성을 위한 오답 3개씩을 함께 등록한다.
export interface IConcertGameQuestion extends Document {
  imageUrl: string;
  correctDate: Date;
  correctVenue: string;
  wrongDates: Date[];
  wrongVenues: string[];
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
