import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JwtPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  admin?: JwtPayload;
}

/**
 * 관리자 인증 미들웨어
 *
 * Authorization 헤더에서 JWT 토큰을 추출하여 검증합니다.
 * 유효한 토큰이면 req.admin에 관리자 정보를 추가하고, 핸들러를 실행합니다.
 * 유효하지 않으면 401 Unauthorized 응답을 반환합니다.
 *
 * @param handler 인증 후 실행할 핸들러 함수
 * @returns 미들웨어로 래핑된 핸들러
 *
 * @example
 * export const POST = requireAuth(async (req) => {
 *   const adminEmail = req.admin!.email;
 *   // ... 로직
 * });
 */
export function requireAuth<T = Record<string, string>>(
  handler: (
    req: AuthenticatedRequest,
    context?: { params: Promise<T> }
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context?: { params: Promise<T> }
  ) => {
    // Authorization 헤더 확인
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    // "Bearer " 제거하여 토큰 추출
    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다' },
        { status: 401 }
      );
    }

    // req에 admin 정보 추가
    (req as AuthenticatedRequest).admin = payload;

    // 핸들러 실행
    return handler(req as AuthenticatedRequest, context);
  };
}

/**
 * 역할 기반 권한 체크 미들웨어 (선택적 사용)
 *
 * @param roles 허용할 역할 목록 (예: ['super'])
 * @returns 역할 체크 미들웨어
 *
 * @example
 * export const DELETE = requireRole(['super'])(async (req) => {
 *   // super 관리자만 실행 가능
 * });
 */
export function requireRole(roles: string[]) {
  return (
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ) => {
    return requireAuth(async (req) => {
      if (!roles.includes(req.admin!.role)) {
        return NextResponse.json(
          { error: '권한이 없습니다' },
          { status: 403 }
        );
      }
      return handler(req);
    });
  };
}
