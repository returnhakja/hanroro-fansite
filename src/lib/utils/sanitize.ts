import sanitizeHtmlLib from 'sanitize-html';

/**
 * 리치 텍스트(에디터) HTML을 저장형 XSS로부터 안전하게 정화한다.
 * tiptap 에디터가 생성하는 태그만 허용하고, script·이벤트 핸들러·
 * javascript: URL 등 위험 요소는 모두 제거한다.
 *
 * 서버 전용 라이브러리(sanitize-html, jsdom 불필요)를 사용하므로
 * Vercel serverless 환경에서도 안전하게 동작한다. API route(서버)에서만 호출한다.
 */
export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: [
      'p', 'br', 'hr', 'span', 'div',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'mark',
      'code', 'pre', 'blockquote',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
      '*': ['class'],
    },
    // javascript:, data: 등 위험 스킴 차단
    allowedSchemes: ['http', 'https', 'mailto', 'blob'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'blob'],
    },
  });
}
