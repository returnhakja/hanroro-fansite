import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ISong {
  title: string;
  albumImageUrl?: string;
  order: number;
}

export interface ISetList extends Document {
  concertId: Types.ObjectId;
  day: number;
  date: Date;
  songs: ISong[];
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new Schema<ISong>(
  {
    title: {
      type: String,
      required: true,
    },
    albumImageUrl: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const setListSchema = new Schema<ISetList>(
  {
    concertId: {
      type: Schema.Types.ObjectId,
      ref: 'Concert',
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    songs: {
      type: [songSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 같은 공연의 같은 날은 유니크
setListSchema.index({ concertId: 1, day: 1 }, { unique: true });

// 공연별 조회를 위한 인덱스
setListSchema.index({ concertId: 1, day: 1 });

const SetList: Model<ISetList> =
  mongoose.models.SetList ||
  mongoose.model<ISetList>('SetList', setListSchema, 'setlists');

export default SetList;
