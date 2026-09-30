import mongoose, { Document, Schema, Model } from 'mongoose';

// 로로시 게임: 스톱워치를 11.11초에 얼마나 가깝게 멈췄는지 기록한다.
export interface ILorosiResult extends Document {
  voterId: string;
  nickname: string;
  elapsedMs: number;
  diffMs: number;
  createdAt: Date;
}

const lorosiResultSchema = new Schema<ILorosiResult>(
  {
    voterId: { type: String, required: true },
    nickname: { type: String, required: true, maxlength: 8 },
    elapsedMs: { type: Number, required: true, min: 0 },
    diffMs: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

lorosiResultSchema.index({ diffMs: 1 });

const LorosiResult: Model<ILorosiResult> =
  mongoose.models.LorosiResult ||
  mongoose.model<ILorosiResult>('LorosiResult', lorosiResultSchema, 'lorosiresults');

export default LorosiResult;
