/**
 * 관리자 JWT 토큰을 Authorization 헤더로 반환
 * - 서버 사이드에서는 빈 객체 반환
 */
export function getAuthHeader(): Record<string, string> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
