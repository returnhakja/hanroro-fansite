import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: '프로필',
  description: '싱어송라이터 한로로의 프로필, 디스코그래피, 활동 내역을 확인하세요.',
  keywords: ['한로로', 'HANRORO', '프로필', '디스코그래피', '앨범', '싱어송라이터'],
  openGraph: {
    title: '프로필 | 한로로 팬사이트',
    description: '싱어송라이터 한로로의 프로필, 디스코그래피, 활동 내역을 확인하세요.',
    url: 'https://hanroro-fansite.vercel.app/profile',
    type: 'profile',
    images: [
      {
        url: '/assets/한로로프로필사진.jpg',
        width: 1200,
        height: 630,
        alt: '한로로 프로필',
      },
    ],
  },
  alternates: {
    canonical: 'https://hanroro-fansite.vercel.app/profile',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: '한로로',
  alternateName: 'HANRORO',
  description: '감성적인 음악으로 많은 팬들의 사랑을 받는 싱어송라이터',
  genre: ['인디팝', '발라드', 'K-POP'],
  url: 'https://hanroro-fansite.vercel.app/profile',
  image: 'https://hanroro-fansite.vercel.app/assets/한로로프로필사진.jpg',
  sameAs: [
    'https://www.youtube.com/channel/UCrDa_5OU-rhvXqWlPx5hgKQ',
    'https://www.instagram.com/hanr0r0/',
    'https://artist.mnetplus.world/main/stg/hanroro',
    'https://blog.naver.com/hanr0r0',
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: 'https://hanroro-fansite.vercel.app',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '프로필',
      item: 'https://hanroro-fansite.vercel.app/profile',
    },
  ],
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={personSchema} />
      <StructuredData data={breadcrumbSchema} />
      {children}
    </>
  );
}
