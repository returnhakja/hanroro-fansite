import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IInquiryReply extends Document {
  inquiryId: Types.ObjectId;
  content: string;
  adminEmail: string;
  createdAt: Date;
}

const inquiryReplySchema = new Schema<IInquiryReply>(
  {
    inquiryId: {
      type: Schema.Types.ObjectId,
      ref: 'Inquiry',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    adminEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

inquiryReplySchema.index({ inquiryId: 1, createdAt: 1 });

const InquiryReply: Model<IInquiryReply> =
  mongoose.models.InquiryReply ||
  mongoose.model<IInquiryReply>(
    'InquiryReply',
    inquiryReplySchema,
    'inquiryreplies'
  );

export default InquiryReply;
