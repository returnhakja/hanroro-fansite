import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/db/models/User';

// 현재 로그인 유저 프로필 조회
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id).lean();

    if (!user) {
      return NextResponse.json(
        { error: '유저를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      image: user.image,
      nickname: user.nickname || '',
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return NextResponse.json(
      { error: '프로필을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// 닉네임 업데이트
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nickname } = body;

    if (typeof nickname !== 'string') {
      return NextResponse.json(
        { error: '닉네임 형식이 올바르지 않습니다' },
        { status: 400 }
      );
    }

    const trimmed = nickname.trim();

    if (trimmed.length > 0 && trimmed.length < 2) {
      return NextResponse.json(
        { error: '닉네임은 2자 이상이어야 합니다' },
        { status: 400 }
      );
    }

    if (trimmed.length > 20) {
      return NextResponse.json(
        { error: '닉네임은 20자를 초과할 수 없습니다' },
        { status: 400 }
      );
    }

    // 특수문자 제한 (한글, 영문, 숫자, 언더스코어만 허용)
    if (trimmed && !/^[가-힣a-zA-Z0-9_]+$/.test(trimmed)) {
      return NextResponse.json(
        { error: '닉네임은 한글, 영문, 숫자, 언더스코어(_)만 사용 가능합니다' },
        { status: 400 }
      );
    }

    await connectDB();

    // 중복 닉네임 체크
    if (trimmed) {
      const existing = await User.findOne({ nickname: trimmed, _id: { $ne: session.user.id } });
      if (existing) {
        return NextResponse.json(
          { error: '이미 사용 중인 닉네임입니다' },
          { status: 409 }
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { nickname: trimmed },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: '유저를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      nickname: updatedUser.nickname,
      message: '닉네임이 변경되었습니다',
    });
  } catch (error) {
    console.error('닉네임 변경 오류:', error);
    return NextResponse.json(
      { error: '닉네임 변경에 실패했습니다' },
      { status: 500 }
    );
  }
}
