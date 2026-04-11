import mongoose, { Document, Model, Schema } from 'mongoose';
import type { InquiryCategory } from '@/lib/constants/inquiry';

export interface IInquiry extends Document {
  userId: string;
  author: string;
  category: InquiryCategory;
  title: string;
  content: string;
  readByAdmin: boolean;
  /** 운영자 답변(댓글) 개수 — 목록 배지용 */
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    userId: { type: String, required: true, index: true },
    author: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['site_error', 'content', 'collab', 'other'],
    },
    title: { type: String, required: true, maxlength: 200 },
    content: { type: String, required: true, maxlength: 5000 },
    readByAdmin: { type: Boolean, default: false },
    replyCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ||
  mongoose.model<IInquiry>('Inquiry', inquirySchema, 'inquiries');

export default Inquiry;
