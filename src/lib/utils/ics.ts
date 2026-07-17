/**
 * iCalendar(.ics, RFC 5545) 생성 유틸
 *
 * 기기 기본 캘린더(iOS 캘린더 · 삼성/구글 캘린더 · PC Outlook 등)에
 * 일정을 추가하기 위한 표준 포맷 파일을 만든다.
 *
 * ⚠️ 반드시 클라이언트(브라우저)에서 호출할 것.
 * time 값을 로컬 시각(KST 전제)으로 해석하므로, 서버(UTC)에서 실행하면 시간대가 어긋난다.
 */

export interface IcsEventInput {
  title: string;
  /** ISO 날짜 문자열 (event.date) */
  date: string;
  /** "19:00" 형태. 없으면 종일 이벤트로 처리 */
  time?: string;
  place?: string;
  description?: string;
  /** 상세 페이지 링크 */
  url?: string;
  /** 시간 지정 이벤트의 기본 소요시간(분). 기본 120분 */
  durationMinutes?: number;
}

/** ICS 텍스트 특수문자 이스케이프 (RFC 5545) */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Date → UTC 기준 YYYYMMDDTHHMMSSZ */
function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Date → 종일 이벤트용 YYYYMMDD (로컬 날짜 기준) */
function toIcsDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/** IcsEventInput → .ics 문자열 (CRLF 규격) */
export function buildIcs(input: IcsEventInput): string {
  const { title, date, time, place, description, url, durationMinutes = 120 } = input;

  const base = new Date(date);
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HANRORO Fansite//Schedule//KO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    // UID는 고유해야 함
    `UID:${toIcsUtc(base)}-${Math.random().toString(36).slice(2)}@hanroro`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `SUMMARY:${escapeText(title)}`,
  ];

  if (time) {
    // "19:00" → 로컬(KST) 시각으로 해석
    const [hh, mm] = time.split(':').map(Number);
    const start = new Date(base);
    start.setHours(hh || 0, mm || 0, 0, 0);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    lines.push(`DTSTART:${toIcsUtc(start)}`);
    lines.push(`DTEND:${toIcsUtc(end)}`);
  } else {
    // 시간 정보 없음 → 종일 이벤트
    const next = new Date(base);
    next.setDate(next.getDate() + 1);
    lines.push(`DTSTART;VALUE=DATE:${toIcsDate(base)}`);
    lines.push(`DTEND;VALUE=DATE:${toIcsDate(next)}`);
  }

  if (place) lines.push(`LOCATION:${escapeText(place)}`);
  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`);
  if (url) lines.push(`URL:${escapeText(url)}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

/** 생성한 ICS 문자열을 기기 캘린더로 넘김 (Blob 다운로드) */
export function downloadIcs(icsContent: string, filename = 'event.ics'): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // iOS Safari 등에서 즉시 revoke하면 열리기 전에 취소될 수 있어 지연
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
