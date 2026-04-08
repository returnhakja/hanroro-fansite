import type { ILyricLine, ILyricSegment, LyricType } from '@/lib/db/models/Fanchant';

/**
 * 관리자 입력 텍스트를 ILyricLine 배열로 파싱
 *
 * [줄 전체 태그]
 *   [fan] 텍스트  → 줄 전체 fan 타입
 *   [clap] 텍스트 → 줄 전체 clap 타입
 *   [rest] 텍스트 → 줄 전체 rest 타입
 *   그 외 텍스트  → 줄 전체 artist 타입
 *
 * [인라인 부분 태그] — 줄 안에서 일부만 강조
 *   {fan:텍스트}  → 해당 부분만 fan 색상
 *   {clap:텍스트} → 해당 부분만 clap 색상
 *   {rest:텍스트} → 해당 부분만 rest 색상
 *
 * 예시:
 *   {fan:다시} 지을 수 있단 약속들이
 *   → [{ text: '다시', type: 'fan' }, { text: ' 지을 수 있단 약속들이', type: 'artist' }]
 */
export function parseLyrics(raw: string): ILyricLine[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // 줄 전체 태그
      const fullTags: { prefix: string; type: LyricType }[] = [
        { prefix: '[fan]', type: 'fan' },
        { prefix: '[clap]', type: 'clap' },
        { prefix: '[rest]', type: 'rest' },
      ];

      for (const { prefix, type } of fullTags) {
        if (line.toLowerCase().startsWith(prefix)) {
          return { segments: [{ text: line.slice(prefix.length).trim(), type }] };
        }
      }

      // 인라인 부분 태그
      if (/\{(fan|clap|rest):/.test(line)) {
        return { segments: parseInline(line) };
      }

      // 일반 줄
      return { segments: [{ text: line, type: 'artist' as LyricType }] };
    });
}

function parseInline(line: string): ILyricSegment[] {
  const segments: ILyricSegment[] = [];
  const regex = /\{(fan|clap|rest):([^}]*)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      const before = line.slice(lastIndex, match.index);
      if (before) segments.push({ text: before, type: 'artist' });
    }
    segments.push({ text: match[2], type: match[1] as LyricType });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    const rest = line.slice(lastIndex);
    if (rest) segments.push({ text: rest, type: 'artist' });
  }

  return segments;
}

/**
 * ILyricLine 배열을 관리자 편집용 텍스트로 역변환
 * 구 포맷({ text, type }) 과 신 포맷({ segments }) 모두 처리
 */
export function unparseLyrics(lyrics: ILyricLine[]): string {
  return lyrics
    .map(line => {
      // 구 포맷 호환: segments가 없으면 text/type 필드로 처리
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = line as any;
      const segments: ILyricSegment[] =
        Array.isArray(line.segments) && line.segments.length > 0
          ? line.segments
          : [{ text: raw.text ?? '', type: (raw.type as LyricType) ?? 'artist' }];

      if (segments.length === 1) {
        const seg = segments[0];
        if (seg.type === 'fan') return `[fan] ${seg.text}`;
        if (seg.type === 'clap') return `[clap] ${seg.text}`;
        if (seg.type === 'rest') return `[rest] ${seg.text}`;
        return seg.text;
      }
      // 멀티 세그먼트: 인라인 문법으로 역변환
      return segments
        .map(seg => (seg.type === 'artist' ? seg.text : `{${seg.type}:${seg.text}}`))
        .join('');
    })
    .join('\n');
}
