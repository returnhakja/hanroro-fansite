import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d'; // 7일

export interface JwtPayload {
  adminId: string;
  email: string;
  role: string;
}

/**
 * JWT 토큰 생성
 * @param payload 토큰에 포함될 데이터 (adminId, email, role)
 * @returns JWT 토큰 문자열
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * JWT 토큰 검증 및 페이로드 추출
 * @param token JWT 토큰 문자열
 * @returns 유효하면 페이로드, 무효하면 null
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
