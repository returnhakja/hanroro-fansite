import { cache } from 'react';
import type { Metadata } from 'next';
import connectDB from '@/lib/db/mongoose';
import FavoriteSetlist from '@/lib/db/models/FavoriteSetlist';
import ResultClient from './ResultClient';

const BASE_URL = 'https://www.hanroro.co.kr';

const getSetlist = cache(async (id: string) => {
  await connectDB();
  return FavoriteSetlist.findById(id).lean();
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // /setlist/layout.tsx가 /setlist/* 전체에 canonical: "/setlist"를 기본으로 깔아두므로,
  // 조회 실패 경로를 포함해 항상 이 페이지 자신을 canonical로 명시한다.
  const canonical = `${BASE_URL}/setlist/builder/${id}`;

  try {
    const setlist = await getSetlist(id);
    if (!setlist) {
      return {
        title: '세트리스트를 찾을 수 없습니다',
        alternates: { canonical },
        robots: { index: false, follow: true },
      };
    }

    const songs = setlist.songs as string[];
    const description = songs.slice(0, 5).join(' · ');

    return {
      title: '내 최애 세트리스트',
      description,
      openGraph: {
        title: '내 최애 세트리스트 | 한로로 팬사이트',
        description,
        url: canonical,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: '내 최애 세트리스트 | 한로로 팬사이트',
        description,
      },
      alternates: { canonical },
    };
  } catch {
    return {
      title: '내 최애 세트리스트',
      alternates: { canonical },
    };
  }
}

export default async function SetlistBuilderResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResultClient id={id} />;
}
