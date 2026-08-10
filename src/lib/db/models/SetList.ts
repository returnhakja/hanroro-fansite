import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ISong {
  title: string;
  albumImageUrl?: string;
  order: number;
}

export interface ISetList extends Document {
  concertId: Types.ObjectId;
  /** 시작 일차 */
  day: number;
  /** 시작 날짜 */
  date: Date;
  /**
   * 여러 날 동일한 셋리스트로 공연한 경우의 끝 일차/날짜.
   * 하루짜리면 값이 없다(기존 문서 전부 해당).
   */
  endDay?: number;
  endDate?: Date;
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
    endDay: {
      type: Number,
    },
    endDate: {
      type: Date,
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

/** 이 셋리스트가 덮는 공연 횟수 (이틀 동일 셋리스트면 2) */
export function setListShowCount(setlist: {
  day: number;
  endDay?: number | null;
}): number {
  if (!setlist.endDay || setlist.endDay <= setlist.day) return 1;
  return setlist.endDay - setlist.day + 1;
}

// 같은 공연의 같은 시작 일차는 유니크 (공연별 조회 인덱스도 겸한다)
// 일차 범위끼리 겹치는지는 인덱스로 못 막아서 lib/setlist/dayRange 에서 검사한다
setListSchema.index({ concertId: 1, day: 1 }, { unique: true });

const SetList: Model<ISetList> =
  mongoose.models.SetList ||
  mongoose.model<ISetList>('SetList', setListSchema, 'setlists');

export default SetList;
