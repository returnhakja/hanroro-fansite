/**
 * 배너 입력값 검증/정규화 (관리자 API 공용)
 * - 날짜는 관리자 화면에서 YYYY-MM-DD 로 받고, 한국 시간 기준
 *   시작일 00:00 ~ 종료일 23:59:59 로 저장한다.
 */
export interface BannerInput {
  title?: string;
  pcImageUrl?: string;
  mobileImageUrl?: string;
  alt?: string;
  buttonLabel?: string;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
  isActive?: boolean;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function toKstDate(value: string | undefined, endOfDay: boolean): Date | null {
  if (!value) return null;
  if (!DATE_RE.test(value)) throw new Error('날짜 형식이 올바르지 않습니다');
  return new Date(`${value}T${endOfDay ? '23:59:59' : '00:00:00'}+09:00`);
}

function isAllowedUrl(url: string): boolean {
  if (url.startsWith('/')) return true;
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

export function normalizeBannerInput(body: BannerInput) {
  const title = body.title?.trim();
  const pcImageUrl = body.pcImageUrl?.trim();
  const mobileImageUrl = body.mobileImageUrl?.trim() || undefined;
  const alt = body.alt?.trim();
  const linkUrl = body.linkUrl?.trim();

  if (!title || !pcImageUrl || !alt || !linkUrl) {
    throw new Error('관리용 이름, PC 이미지, 대체 텍스트, 링크는 필수입니다');
  }
  for (const url of [pcImageUrl, mobileImageUrl, linkUrl]) {
    if (url && !isAllowedUrl(url)) {
      throw new Error('URL은 https:// 또는 / 로 시작해야 합니다');
    }
  }

  const startAt = toKstDate(body.startDate, false);
  const endAt = toKstDate(body.endDate, true);
  if (startAt && endAt && startAt > endAt) {
    throw new Error('종료일이 시작일보다 빠릅니다');
  }

  return {
    title,
    pcImageUrl,
    mobileImageUrl,
    alt,
    buttonLabel: body.buttonLabel?.trim() || undefined,
    linkUrl,
    startAt,
    endAt,
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
    isActive: body.isActive !== false,
  };
}
