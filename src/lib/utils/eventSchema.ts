// 일정(Event) 메타데이터·JSON-LD 생성에 쓰이는 공용 헬퍼.
// src/app/schedule/page.tsx (목록)와 src/app/schedule/[id]/page.tsx (상세) 양쪽에서 사용.

export function getEventTypeLabel(type: string): string {
  switch (type) {
    case 'concert':
      return '콘서트';
    case 'fanmeeting':
      return '팬미팅';
    case 'broadcast':
      return '방송';
    case 'festival':
      return '페스티벌';
    case 'award':
      return '시상식';
    default:
      return '기타';
  }
}

export function getSchemaEventType(type: string): 'MusicEvent' | 'Event' {
  return ['concert', 'fanmeeting', 'festival'].includes(type)
    ? 'MusicEvent'
    : 'Event';
}

/** "18:30" 또는(종료시간이 있으면) "18:30 - 19:10" 형태로 표시용 문자열을 만든다 */
export function formatEventTime(time?: string | null, endTime?: string | null): string {
  if (!time) return '';
  return endTime ? `${time} - ${endTime}` : time;
}

export function buildStartDate(date: Date, time?: string): string {
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const [dateStr] = kstDate.toISOString().split('T');

  if (time) {
    const match = time.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const h = match[1].padStart(2, '0');
      const m = match[2];
      return `${dateStr}T${h}:${m}:00+09:00`;
    }
  }
  return dateStr;
}

export function buildEventDescription(event: {
  title: string;
  type: string;
  date: Date;
  time?: string | null;
  endTime?: string | null;
  place?: string | null;
}): string {
  const dateStr = new Date(event.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'Asia/Seoul',
  });
  const typeLabel = getEventTypeLabel(event.type);

  let desc = `${dateStr}`;
  if (event.place) desc += ` ${event.place}에서`;
  desc += ` 열리는 한로로 ${typeLabel}입니다.`;
  if (event.time) {
    desc += event.endTime
      ? ` ${event.time}부터 ${event.endTime}까지 진행됩니다.`
      : ` ${event.time}에 시작합니다.`;
  }

  return desc;
}
