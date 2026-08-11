import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IComment extends Document {
  boardId: Types.ObjectId;
  content: string;
  author: string;
  userId?: string;
  password?: string;
  parentId: Types.ObjectId | null;
  depth: number;
  createdAt: Date;
  deleted: boolean;
  deletedAt: Date | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const commentSchema = new Schema<IComment>({
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: [true, '댓글 내용을 입력해주세요'],
    maxlength: [500, '댓글은 500자를 초과할 수 없습니다'],
  },
  author: {
    type: String,
    required: [true, '작성자명을 입력해주세요'],
    maxlength: [50, '작성자명은 50자를 초과할 수 없습니다'],
  },
  userId: { type: String, default: null },
  // 비로그인(익명) 작성 댓글의 수정·삭제 인증용. 로그인 작성 댓글은 사용하지 않음
  password: { type: String, default: null, select: false },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
    index: true,
  },
  depth: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

// Compound index for efficient board queries
commentSchema.index({ boardId: 1, createdAt: 1 });

commentSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

commentSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const Comment: Model<IComment> =
  mongoose.models.Comment ||
  mongoose.model<IComment>('Comment', commentSchema, 'comments');

export default Comment;
