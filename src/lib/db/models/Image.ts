import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IImage extends Document {
  title: string;
  filename: string;
  imageUrl: string;
  userId?: string;
  createdAt: Date;
}

const imageSchema = new Schema<IImage>({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Image: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>('Image', imageSchema);

export default Image;
