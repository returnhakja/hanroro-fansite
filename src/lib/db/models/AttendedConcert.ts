import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * 로그인 유저가 "체크"한 공연 기록 (My공연).
 * 일정 페이지의 Event(예정) 또는 Concert(지난 공연) 카드에서 체크하며,
 * 원본 문서가 나중에 수정/삭제되어도 기록이 유지되도록 제목·장소·날짜를 스냅샷으로 저장한다.
 */
export interface IAttendedConcert extends Document {
  userId: string;
  sourceType: 'event' | 'concert';
  sourceId: string;
  title: string;
  venue: string;
  date: Date;
  createdAt: Date;
}

const attendedConcertSchema = new Schema<IAttendedConcert>({
  userId: { type: String, required: true, index: true },
  sourceType: { type: String, enum: ['event', 'concert'], required: true },
  sourceId: { type: String, required: true },
  title: { type: String, required: true },
  venue: { type: String, default: '' },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// 동일 유저가 같은 공연을 중복 체크하지 못하도록
attendedConcertSchema.index(
  { userId: 1, sourceType: 1, sourceId: 1 },
  { unique: true }
);

const AttendedConcert: Model<IAttendedConcert> =
  mongoose.models.AttendedConcert ||
  mongoose.model<IAttendedConcert>(
    'AttendedConcert',
    attendedConcertSchema,
    'attended_concerts'
  );

export default AttendedConcert;
