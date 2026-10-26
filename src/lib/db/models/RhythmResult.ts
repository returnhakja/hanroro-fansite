import mongoose, { Document, Schema, Model } from 'mongoose';

// 리듬게임 한 판의 결과. 채점은 클라이언트가 계산해서 그대로 신뢰한다
// (로로시 게임과 동일하게, 캐주얼 게임이라 정밀 부정행위 방지는 하지 않음).
export interface IRhythmResult extends Document {
  chartId: mongoose.Types.ObjectId;
  voterId: string;
  nickname: string;
  score: number;
  maxCombo: number;
  perfectCount: number;
  greatCount: number;
  missCount: number;
  createdAt: Date;
}

const rhythmResultSchema = new Schema<IRhythmResult>(
  {
    chartId: { type: Schema.Types.ObjectId, ref: 'RhythmChart', required: true },
    voterId: { type: String, required: true },
    nickname: { type: String, required: true, maxlength: 8 },
    score: { type: Number, required: true, min: 0 },
    maxCombo: { type: Number, required: true, min: 0 },
    perfectCount: { type: Number, required: true, min: 0 },
    greatCount: { type: Number, required: true, min: 0 },
    missCount: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

rhythmResultSchema.index({ chartId: 1, score: -1, createdAt: 1 });

const RhythmResult: Model<IRhythmResult> =
  mongoose.models.RhythmResult ||
  mongoose.model<IRhythmResult>('RhythmResult', rhythmResultSchema, 'rhythmresults');

export default RhythmResult;
