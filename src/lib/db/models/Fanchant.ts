import mongoose, { Document, Schema, Model } from 'mongoose';

export type LyricType = 'artist' | 'fan' | 'clap' | 'rest';

export interface ILyricSegment {
  text: string;
  type: LyricType;
}

// 한 줄 = 여러 세그먼트 (인라인 부분 강조 지원)
export interface ILyricLine {
  segments: ILyricSegment[];
}

export interface IFanchant extends Document {
  songTitle: string;
  album: string;
  albumImageUrl?: string;
  order: number;
  lyrics: ILyricLine[];
  createdAt: Date;
  updatedAt: Date;
}

const lyricSegmentSchema = new Schema<ILyricSegment>(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ['artist', 'fan', 'clap', 'rest'],
      default: 'artist',
    },
  },
  { _id: false }
);

const lyricLineSchema = new Schema<ILyricLine>(
  {
    segments: { type: [lyricSegmentSchema], default: [] },
  },
  { _id: false }
);

const fanchantSchema = new Schema<IFanchant>(
  {
    songTitle: { type: String, required: true },
    album: { type: String, required: true },
    albumImageUrl: { type: String },
    order: { type: Number, default: 0 },
    lyrics: { type: [lyricLineSchema], default: [] },
  },
  { timestamps: true }
);

fanchantSchema.index({ order: 1 });

// 개발 환경에서 스키마 변경 시 캐시된 모델 갱신
if (mongoose.models.Fanchant) {
  delete mongoose.models.Fanchant;
}

const Fanchant: Model<IFanchant> = mongoose.model<IFanchant>(
  'Fanchant',
  fanchantSchema,
  'fanchants'
);

export default Fanchant;
