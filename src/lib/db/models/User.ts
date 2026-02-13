import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  googleId: string;
  nickname: string;
  createdAt: Date;
  lastLogin: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  image: { type: String, default: '' },
  googleId: { type: String, required: true, unique: true },
  nickname: { type: String, default: '', maxlength: [20, '닉네임은 20자를 초과할 수 없습니다'], unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>('User', userSchema, 'users');

export default User;
