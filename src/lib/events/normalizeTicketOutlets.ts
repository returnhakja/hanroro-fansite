import type { TicketOutlet } from '@/types/api/event';

function ensureHttpUrl(input: string): string {
  const t = input.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

/**
 * API/폼에서 들어온 값을 저장 가능한 티켓 아울렛 배열로 정리합니다.
 */
export function normalizeTicketOutlets(
  raw: unknown
): Pick<TicketOutlet, 'label' | 'url' | 'isPrimary' | 'note' | 'opensAt'>[] {
  if (!Array.isArray(raw)) return [];
  const out: Pick<
    TicketOutlet,
    'label' | 'url' | 'isPrimary' | 'note' | 'opensAt'
  >[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const label = typeof o.label === 'string' ? o.label.trim() : '';
    const urlRaw = typeof o.url === 'string' ? o.url.trim() : '';
    if (!label || !urlRaw) continue;
    const url = ensureHttpUrl(urlRaw);
    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch {
      continue;
    }
    const note = typeof o.note === 'string' ? o.note.trim() : undefined;
    const opensAt =
      typeof o.opensAt === 'string' ? o.opensAt.trim() : undefined;
    out.push({
      label,
      url,
      isPrimary: o.isPrimary === true,
      ...(note ? { note } : {}),
      ...(opensAt ? { opensAt } : {}),
    });
  }
  return out;
}

/** 배열에서 `isPrimary`가 true인 항목을 최대 하나만 남깁니다(앞쪽 우선). */
export function ensureSinglePrimary<
  T extends { isPrimary?: boolean },
>(arr: T[]): T[] {
  let seen = false;
  return arr.map(item => {
    if (item.isPrimary) {
      if (seen) return { ...item, isPrimary: false };
      seen = true;
    }
    return item;
  });
}
