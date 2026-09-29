import mongoose, { Document, Schema, Model } from 'mongoose';

export type GameDifficulty = 'easy' | 'normal' | 'hard';

// 완료된 게임 한 판의 결과. 익명은 브라우저 쿠키(voterId)로 식별한다.
export interface IGameResult extends Document {
  voterId: string;
  nickname: string;
  difficulty: GameDifficulty;
  score: number;
  elapsedMs: number;
  createdAt: Date;
}

const gameResultSchema = new Schema<IGameResult>(
  {
    voterId: { type: String, required: true },
    nickname: { type: String, required: true, maxlength: 8 },
    difficulty: { type: String, enum: ['easy', 'normal', 'hard'], required: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    elapsedMs: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

gameResultSchema.index({ difficulty: 1, score: -1, elapsedMs: 1 });

const GameResult: Model<IGameResult> =
  mongoose.models.GameResult ||
  mongoose.model<IGameResult>('GameResult', gameResultSchema, 'gameresults');

export default GameResult;
