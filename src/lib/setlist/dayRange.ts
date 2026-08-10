import SetList from '@/lib/db/models/SetList';

export interface DayRangeInput {
  day: unknown;
  date: unknown;
  endDay?: unknown;
  endDate?: unknown;
}

export interface DayRange {
  day: number;
  date: Date;
  /** 하루짜리면 null (DB에 저장하지 않는다) */
  endDay: number | null;
  endDate: Date | null;
}

/**
 * 셋리스트의 일차/날짜 범위를 검증해 정규화한다.
 * 여러 날 동일한 셋리스트인 경우에만 endDay/endDate 가 채워진다.
 * 검증 실패 시 사용자에게 보여줄 메시지를 반환한다.
 */
export function parseDayRange(
  input: DayRangeInput
): { ok: true; range: DayRange } | { ok: false; error: string } {
  const day = Number(input.day);
  if (!Number.isInteger(day) || day < 1) {
    return { ok: false, error: '일차는 1 이상의 정수여야 합니다' };
  }

  const date = new Date(String(input.date));
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: '날짜 형식이 올바르지 않습니다' };
  }

  const hasEndDay = input.endDay !== undefined && input.endDay !== null && input.endDay !== '';
  const hasEndDate =
    input.endDate !== undefined && input.endDate !== null && input.endDate !== '';

  // 하루짜리
  if (!hasEndDay && !hasEndDate) {
    return { ok: true, range: { day, date, endDay: null, endDate: null } };
  }

  if (!hasEndDay || !hasEndDate) {
    return { ok: false, error: '종료 일차와 종료 날짜는 함께 입력해야 합니다' };
  }

  const endDay = Number(input.endDay);
  if (!Number.isInteger(endDay) || endDay <= day) {
    return { ok: false, error: '종료 일차는 시작 일차보다 커야 합니다' };
  }

  const endDate = new Date(String(input.endDate));
  if (Number.isNaN(endDate.getTime())) {
    return { ok: false, error: '종료 날짜 형식이 올바르지 않습니다' };
  }
  if (endDate < date) {
    return { ok: false, error: '종료 날짜는 시작 날짜보다 빠를 수 없습니다' };
  }

  return { ok: true, range: { day, date, endDay, endDate } };
}

/**
 * 같은 공연에서 일차가 겹치는 셋리스트를 찾는다.
 * (concertId, day) 유니크 인덱스는 시작 일차만 막아주므로
 * 범위끼리 겹치는 경우는 여기서 걸러야 한다.
 * excludeId: 수정 중인 자기 자신은 제외.
 */
export async function findOverlappingSetlist(
  concertId: string,
  range: DayRange,
  excludeId?: string
) {
  const start = range.day;
  const end = range.endDay ?? range.day;

  const candidates = await SetList.find({
    concertId,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  })
    .select('day endDay')
    .lean();

  return (
    candidates.find((other) => {
      const otherStart = other.day;
      const otherEnd = other.endDay ?? other.day;
      return start <= otherEnd && otherStart <= end;
    }) ?? null
  );
}
