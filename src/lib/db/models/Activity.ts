import mongoose, { Document, Schema, Model } from 'mongoose';

export type ActivityType = 'concert' | 'release' | 'broadcast' | 'award' | 'etc';

export interface IActivity extends Document {
  year: number;
  month: number;
  type: ActivityType;
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    type: {
      type: String,
      required: true,
      enum: ['concert', 'release', 'broadcast', 'award', 'etc'],
      default: 'etc',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 연도/월 기준 빠른 조회를 위한 인덱스
activitySchema.index({ year: -1, month: 1 });

const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>('Activity', activitySchema, 'activities');

export default Activity;
