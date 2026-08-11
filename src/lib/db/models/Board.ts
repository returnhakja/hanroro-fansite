import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { BOARD_CATEGORY_VALUES, DEFAULT_BOARD_CATEGORY } from '@/lib/board/categories';

export interface IBoard extends Document {
  title: string;
  content: string;
  author: string;
  userId?: string;
  password?: string;
  category: string;
  imageUrls: string[];
  createdAt: Date;
  views: number;
  likes: number;
  likedBy: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const boardSchema = new Schema<IBoard>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: String, default: null },
  // 비로그인(익명) 작성 글의 수정·삭제 인증용. 로그인 작성 글은 사용하지 않음
  password: { type: String, default: null, select: false },
  category: {
    type: String,
    enum: BOARD_CATEGORY_VALUES,
    default: DEFAULT_BOARD_CATEGORY,
  },
  imageUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
});

boardSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

boardSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const Board: Model<IBoard> =
  mongoose.models.Board ||
  mongoose.model<IBoard>('Board', boardSchema, 'board');

export default Board;
