/**
 * ISO 날짜 문자열을 YYYY-MM-DD 형식으로 반환
 * @example formatDateShort('2026-04-14T12:00:00Z') → '2026-04-14'
 */
export function formatDateShort(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * ISO 날짜 문자열을 한국어 장문 형식으로 반환
 * @example formatDateLong('2026-04-14') → '2026년 4월 14일'
 */
export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return '방금';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;

  return then.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
