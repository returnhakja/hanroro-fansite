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
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

    if (!admin || !(await admin.comparePassword(password))) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    // 마지막 로그인 시간 업데이트
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
