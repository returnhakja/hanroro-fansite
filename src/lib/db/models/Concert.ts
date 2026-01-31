import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IConcert extends Document {
  title: string;
  venue: string;
  startDate: Date;
  endDate: Date;
  posterUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const concertSchema = new Schema<IConcert>(
  {
    title: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 활성 공연 빠른 조회를 위한 인덱스
concertSchema.index({ isActive: 1, startDate: -1 });

const Concert: Model<IConcert> =
  mongoose.models.Concert ||
  mongoose.model<IConcert>('Concert', concertSchema, 'concerts');

export default Concert;
