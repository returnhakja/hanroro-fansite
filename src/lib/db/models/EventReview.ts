import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * 일정(Event) 상세 페이지의 공연 후기.
 * 게시판과 동일하게 로그인 없이 닉네임으로 작성 가능하지만,
 * 도용·무단 삭제를 막기 위해 익명으로 작성한 후기는 본인도 수정·삭제할 수 없다.
 */
export interface IEventReview extends Document {
  eventId: string;
  author: string;
  userId?: string;
  content: string;
  imageUrls: string[];
  createdAt: Date;
}

const eventReviewSchema = new Schema<IEventReview>({
  eventId: { type: String, required: true, index: true },
  author: { type: String, required: true, maxlength: 50 },
  userId: { type: String, default: null },
  content: { type: String, required: true, maxlength: 1000 },
  imageUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const EventReview: Model<IEventReview> =
  mongoose.models.EventReview ||
  mongoose.model<IEventReview>('EventReview', eventReviewSchema, 'event_reviews');

export default EventReview;
