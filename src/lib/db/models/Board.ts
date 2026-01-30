import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBoard extends Document {
  title: string;
  content: string;
  author: string;
  imageUrls: string[];
  createdAt: Date;
  views: number;
  likes: number;
}

const boardSchema = new Schema<IBoard>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  imageUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const Board: Model<IBoard> =
  mongoose.models.Board ||
  mongoose.model<IBoard>('Board', boardSchema, 'board');

export default Board;
