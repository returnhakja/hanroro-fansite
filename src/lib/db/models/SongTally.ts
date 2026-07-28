import mongoose, { Document, Schema, Model } from 'mongoose';

// 곡별 최애곡 득표 카운터 (앨범 정보는 Fanchant를 카탈로그로 사용하므로 중복 저장하지 않음)
export interface ISongTally extends Document {
  songTitle: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const songTallySchema = new Schema<ISongTally>(
  {
    // Fanchant.songTitle 과 매칭되는 키
    songTitle: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 득표순 정렬 최적화
songTallySchema.index({ count: -1 });

const SongTally: Model<ISongTally> =
  mongoose.models.SongTally ||
  mongoose.model<ISongTally>('SongTally', songTallySchema, 'songtallies');

export default SongTally;
