/** 문의 유형 (게시판과 별도 컬렉션) */
export const INQUIRY_CATEGORY_KEYS = [
  'site_error',
  'content',
  'collab',
  'other',
] as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORY_KEYS)[number];

export const INQUIRY_CATEGORY_LABELS: Record<InquiryCategory, string> = {
  site_error: '사이트 오류·버그',
  content: '콘텐츠 수정·요청',
  collab: '협업·문의',
  other: '기타',
};

export function isInquiryCategory(v: string): v is InquiryCategory {
  return (INQUIRY_CATEGORY_KEYS as readonly string[]).includes(v);
}
