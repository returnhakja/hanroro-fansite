import { MetadataRoute } from 'next';
import connectDB from '@/lib/db/mongoose';
import Board from '@/lib/db/models/Board';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hanroro-fansite.vercel.app';

  // 정적 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/board`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 동적 게시글 페이지
  try {
    await connectDB();
    const posts = await Board.find({})
      .select('_id createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const boardRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/board/${post._id.toString()}`,
      lastModified: post.createdAt as Date,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...boardRoutes];
  } catch (error) {
    console.error('사이트맵 생성 오류:', error);
    return staticRoutes;
  }
}
