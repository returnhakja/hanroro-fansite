import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: 'super' | 'manager';
  createdAt: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // 기본 쿼리에서 제외
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super', 'manager'],
    default: 'manager',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
});

// 비밀번호 해싱 미들웨어
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 비밀번호 비교 메서드
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin: Model<IAdmin> =
  mongoose.models.Admin ||
  mongoose.model<IAdmin>('Admin', adminSchema, 'admins');

export default Admin;
