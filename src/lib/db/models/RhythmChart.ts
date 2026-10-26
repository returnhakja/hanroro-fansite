import mongoose, { Document, Schema, Model } from 'mongoose';

export type RhythmDifficulty = 'easy' | 'normal' | 'hard';

export interface IRhythmNote {
  lane: number;
  timeMs: number;
}

// 리듬게임 곡 + 박자맵. 아직 비공개 테스트 단계라 공개 게임 허브/사이트맵에는
// 올리지 않고 관리자 페이지에서 발급하는 직접 링크로만 접근한다.
export interface IRhythmChart extends Document {
  title: string;
  youtubeId: string;
  startSeconds: number;
  bpm: number;
  offsetMs: number;
  difficulty: RhythmDifficulty;
  notes: IRhythmNote[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const rhythmNoteSchema = new Schema<IRhythmNote>(
  {
    lane: { type: Number, required: true, min: 0, max: 3 },
    timeMs: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const rhythmChartSchema = new Schema<IRhythmChart>(
  {
    title: { type: String, required: true, trim: true },
    youtubeId: { type: String, required: true, trim: true },
    startSeconds: { type: Number, required: true, min: 0, default: 0 },
    bpm: { type: Number, required: true, min: 20, max: 300 },
    offsetMs: { type: Number, required: true, default: 0 },
    difficulty: { type: String, enum: ['easy', 'normal', 'hard'], required: true },
    notes: { type: [rhythmNoteSchema], default: [] },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

rhythmChartSchema.index({ isActive: 1 });

const RhythmChart: Model<IRhythmChart> =
  mongoose.models.RhythmChart ||
  mongoose.model<IRhythmChart>('RhythmChart', rhythmChartSchema, 'rhythmcharts');

export default RhythmChart;
