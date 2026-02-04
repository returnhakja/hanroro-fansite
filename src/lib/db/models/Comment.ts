import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IComment extends Document {
  boardId: Types.ObjectId;
  content: string;
  author: string;
  parentId: Types.ObjectId | null;
  depth: number;
  createdAt: Date;
  deleted: boolean;
  deletedAt: Date | null;
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

const Comment: Model<IComment> =
  mongoose.models.Comment ||
  mongoose.model<IComment>('Comment', commentSchema, 'comments');

export default Comment;
