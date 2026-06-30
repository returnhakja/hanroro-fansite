import { NextResponse } from 'next/server';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';

// 정규식 특수문자 escape (ReDoS·의도치 않은 패턴 매칭 방지)
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 관리자용 게시글 목록 조회 (JWT 인증 필요)
async function handleGet(request: AuthenticatedRequest) {
  try {
    await connectDB();

    // 페이지네이션 파라미터
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 검색 파라미터 (정규식 특수문자 escape)
    const search = escapeRegex(searchParams.get('search') || '');
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

export const GET = requireAuth(handleGet);
