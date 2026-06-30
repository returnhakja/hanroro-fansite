import { NextResponse } from 'next/server';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

/**
 * 관리자 토큰 유효성 검증 API
 * GET /api/admin/auth/verify
 *
 * requireAuth가 토큰을 실제 검증한다. 유효하면 200, 만료·위조 시 401.
 * 클라이언트(admin 레이아웃)에서 진입 시 호출해 만료된 토큰을 차단한다.
 */
async function handleGet(req: AuthenticatedRequest) {
  return NextResponse.json({
    valid: true,
    admin: {
      email: req.admin!.email,
      role: req.admin!.role,
    },
  });
}

export const GET = requireAuth(handleGet);
