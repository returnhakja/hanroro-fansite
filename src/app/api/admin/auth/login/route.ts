import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Admin from '@/lib/db/models/Admin';
import { signToken } from '@/lib/auth/jwt';

/**
 * 관리자 로그인 API
 * POST /api/admin/auth/login
 *
 * @param email 관리자 이메일
 * @param password 비밀번호
 * @returns JWT 토큰 및 관리자 정보
 */
// 계정 잠금 정책
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15분

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 타입 검증 (NoSQL injection 방어: 객체 주입 차단)
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력하세요' },
        { status: 400 }
      );
    }

    // 필수 필드 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력하세요' },
        { status: 400 }
      );
    }

    // MongoDB 연결
    await connectDB();

    // 관리자 조회 (password 필드 명시적으로 포함)
    const admin = await Admin.findOne({ email }).select('+password');

    // 계정 잠금 상태 확인
    if (admin?.lockUntil && admin.lockUntil.getTime() > Date.now()) {
      const remainMin = Math.ceil(
        (admin.lockUntil.getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          error: `로그인 시도가 많아 계정이 잠겼습니다. ${remainMin}분 후 다시 시도하세요`,
        },
        { status: 429 }
      );
    }

    if (!admin || !(await admin.comparePassword(password))) {
      // 존재하는 계정이면 실패 횟수 누적 → 임계치 도달 시 잠금
      if (admin) {
        admin.failedLoginAttempts = (admin.failedLoginAttempts ?? 0) + 1;
        if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
          admin.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
          admin.failedLoginAttempts = 0;
        }
        await admin.save();
      }
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    // 로그인 성공 → 실패 카운터 초기화 및 잠금 해제
    admin.failedLoginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // JWT 토큰 생성
    const token = signToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    return NextResponse.json({
      token,
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
