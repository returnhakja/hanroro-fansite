import type { ActivityType } from '@/lib/db/models/Activity';

// ─── 활동 연대기 ─────────────────────────────────────────────────
export interface Activity {
  _id: string;
  year: number;
  month: number;
  type: ActivityType;
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export interface ActivityFormData {
  year: number;
  month: number;
  type: ActivityType;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}
