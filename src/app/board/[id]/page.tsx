import type { Metadata } from 'next';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';
import BoardDetailClient from './BoardDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    await connectDB();
    const { id } = await params;
    const post = await Board.findById(id).lean();

    if (!post) {
      return { title: '게시글을 찾을 수 없습니다' };
    }

    const title = post.title as string;
    const content = post.content as string;
    const description = content.length > 100 ? content.slice(0, 100) + '...' : content;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | 한로로 팬사이트`,
        description,
        url: `https://hanroro-fansite.vercel.app/board/${id}`,
        type: 'article',
      },
    };
  } catch {
    return { title: '게시판' };
  }
}

export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <BoardDetailClient params={params} />;
}
