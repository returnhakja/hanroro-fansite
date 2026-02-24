import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';

// 관리자용 게시글 목록 조회 (JWT 인증 필요)
export async function GET(request: NextRequest) {
  try {
    // JWT 토큰 검증
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다' },
        { status: 401 }
      );
    }

    await connectDB();

    // 페이지네이션 파라미터
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 검색 파라미터
    const search = searchParams.get('search') || '';
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // 게시글 목록 조회 (최신순)
    const posts = await Board.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 전체 게시글 수
    const total = await Board.countDocuments(query);

    // 통계 데이터
    const totalPosts = await Board.countDocuments();
    const totalViews = await Board.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } },
    ]);
    const totalLikes = await Board.aggregate([
      { $group: { _id: null, total: { $sum: '$likes' } } },
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalPosts,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '게시글 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
