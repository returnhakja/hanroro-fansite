import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  time?: string;
  place?: string;
  posterUrl?: string;
  type: 'concert' | 'award' | 'broadcast' | 'other';
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
    },
    place: {
      type: String,
    },
    posterUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ['concert', 'award', 'broadcast', 'other'],
      default: 'other',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 날짜 내림차순, 고정된 항목 우선
eventSchema.index({ isPinned: -1, date: -1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema, 'events');

export default Event;
