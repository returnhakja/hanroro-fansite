// 정규식 특수문자 escape (ReDoS·의도치 않은 패턴 매칭 방지)
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
