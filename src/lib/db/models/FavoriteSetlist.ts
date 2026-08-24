import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * 팬이 직접 고른 "최애 세트리스트". 완성과 동시에 공유용 카드로 바로 쓰이는
 * 스냅샷 콘텐츠라 이후 수정이 필요 없어, 별도 비밀번호 없이도 익명 작성이 안전하다.
 */
export interface IFavoriteSetlist extends Document {
  songs: string[];
  userId?: string | null;
  createdAt: Date;
}

const favoriteSetlistSchema = new Schema<IFavoriteSetlist>({
  songs: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length >= 1 && v.length <= 20,
      message: '세트리스트는 1~20곡이어야 합니다',
    },
  },
  userId: { type: String, default: null, index: true },
  createdAt: { type: Date, default: Date.now },
});

const FavoriteSetlist: Model<IFavoriteSetlist> =
  mongoose.models.FavoriteSetlist ||
  mongoose.model<IFavoriteSetlist>('FavoriteSetlist', favoriteSetlistSchema, 'favorite_setlists');

export default FavoriteSetlist;
