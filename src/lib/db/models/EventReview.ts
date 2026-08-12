import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * 일정(Event) 상세 페이지의 공연 후기.
 * 게시판과 동일하게 로그인 없이 닉네임+비밀번호로도 작성 가능하다.
 */
export interface IEventReview extends Document {
  eventId: string;
  author: string;
  userId?: string;
  password?: string;
  content: string;
  imageUrls: string[];
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const eventReviewSchema = new Schema<IEventReview>({
  eventId: { type: String, required: true, index: true },
  author: { type: String, required: true, maxlength: 50 },
  userId: { type: String, default: null },
  password: { type: String, default: null, select: false },
  content: { type: String, required: true, maxlength: 1000 },
  imageUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

eventReviewSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

eventReviewSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const EventReview: Model<IEventReview> =
  mongoose.models.EventReview ||
  mongoose.model<IEventReview>('EventReview', eventReviewSchema, 'event_reviews');

export default EventReview;
