import type { InquiryCategory } from '@/lib/constants/inquiry';

// ─── 문의 (공개) ──────────────────────────────────────────────────
export interface InquirySummary {
  _id: string;
  title: string;
  category: InquiryCategory;
  readByAdmin: boolean;
  replyCount: number;
  createdAt: string;
}

export interface InquiryReply {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface InquiryDetail {
  _id: string;
  author: string;
  category: InquiryCategory;
  title: string;
  content: string;
  readByAdmin: boolean;
  replyCount: number;
  createdAt: string;
  replies: InquiryReply[];
}

// ─── 문의 (관리자) ───────────────────────────────────────────────
export interface AdminInquiryRow {
  _id: string;
  userId: string;
  author: string;
  category: InquiryCategory;
  title: string;
  content: string;
  readByAdmin: boolean;
  replyCount: number;
  createdAt: string;
}

export interface AdminInquiryReply {
  _id: string;
  content: string;
  adminEmail: string;
  createdAt: string;
}

export interface AdminInquiryModalDetail {
  inquiry: AdminInquiryRow;
  replies: AdminInquiryReply[];
}
