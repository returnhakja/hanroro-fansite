/**
 * 셋리스트의 일차/날짜 표시 문자열.
 * 이틀 이상 같은 셋리스트로 공연한 경우 범위로 묶어 보여준다.
 * (DB 접근이 없어 클라이언트 컴포넌트에서도 쓸 수 있다)
 */

interface SetlistRange {
  day: number;
  date: string;
  endDay?: number;
  endDate?: string;
}

/** 여러 날에 걸친 셋리스트인지 */
export function isMultiDaySetlist(setlist: SetlistRange): boolean {
  return !!setlist.endDay && setlist.endDay > setlist.day;
}

/**
 * @example formatSetlistDays({ day: 1 })            → 'Day 1'
 * @example formatSetlistDays({ day: 1, endDay: 2 }) → 'Day 1-2'
 */
export function formatSetlistDays(setlist: SetlistRange): string {
  return isMultiDaySetlist(setlist)
    ? `Day ${setlist.day}-${setlist.endDay}`
    : `Day ${setlist.day}`;
}

/** '8월 10일' 형태 (연도 없이) */
function monthDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/**
 * @example formatSetlistDateRange({ date: '2026-08-10' })                          → '8월 10일'
 * @example formatSetlistDateRange({ date: '2026-08-10', endDate: '2026-08-11' })   → '8월 10일 ~ 8월 11일'
 */
export function formatSetlistDateRange(setlist: SetlistRange): string {
  const start = monthDay(setlist.date);
  if (!isMultiDaySetlist(setlist) || !setlist.endDate) return start;
  return `${start} ~ ${monthDay(setlist.endDate)}`;
}
