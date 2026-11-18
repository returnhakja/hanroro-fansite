import mongoose, { Schema, Model } from 'mongoose';

/**
 * 홈 최상단 팬 이벤트 홍보 배너
 * - 글자까지 포함된 통이미지(PC 3:1, 모바일 5:2) + 버튼 하나만 위에 띄우는 구조
 * - startAt ~ endAt 기간에만 노출 (비어 있으면 해당 방향 제한 없음)
 */
export interface IBanner {
  title: string; // 관리용 이름 (화면에는 노출 안 됨)
  pcImageUrl: string;
  mobileImageUrl?: string;
  alt: string; // 이미지 속 글자를 그대로 적는 대체 텍스트
  buttonLabel?: string;
  linkUrl: string;
  startAt?: Date | null;
  endAt?: Date | null;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    pcImageUrl: { type: String, required: true, trim: true },
    mobileImageUrl: { type: String, trim: true },
    alt: { type: String, required: true, trim: true },
    buttonLabel: { type: String, trim: true },
    linkUrl: { type: String, required: true, trim: true },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1, order: 1 });

// 개발 환경에서 스키마 변경 시 캐시된 모델 갱신
if (mongoose.models.Banner) {
  delete mongoose.models.Banner;
}

const Banner: Model<IBanner> = mongoose.model<IBanner>(
  'Banner',
  bannerSchema,
  'banners'
);

export default Banner;
