import DOMPurify from 'isomorphic-dompurify';

/**
 * 리치 텍스트(에디터) HTML을 저장형 XSS로부터 안전하게 정화한다.
 * tiptap 에디터가 생성하는 태그만 허용하고, script·이벤트 핸들러·
 * javascript: URL 등 위험 요소는 모두 제거한다.
 *
 * 작성/수정 시(서버 저장 전)와 렌더링 시 모두 호출해 이중 방어한다.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'hr', 'span', 'div',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'mark',
      'code', 'pre', 'blockquote',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class'],
    // javascript:, data: 등 위험 스킴 차단 (http/https/mailto/blob만 허용)
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|blob):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}
