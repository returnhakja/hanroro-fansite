import mongoose, { Document, Schema, Model } from 'mongoose';

// 익명 투표자(브라우저 쿠키)당 "현재 최애곡" 1개를 저장한다.
// 픽을 바꾸면 이 문서의 songTitle 이 갱신되고, 이전 곡의 카운트를 차감한다.
export interface ISongVote extends Document {
  voterId: string;
  songTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

const songVoteSchema = new Schema<ISongVote>(
  {
    voterId: { type: String, required: true, unique: true },
    songTitle: { type: String, required: true },
  },
  { timestamps: true }
);

const SongVote: Model<ISongVote> =
  mongoose.models.SongVote ||
  mongoose.model<ISongVote>('SongVote', songVoteSchema, 'songvotes');

export default SongVote;
