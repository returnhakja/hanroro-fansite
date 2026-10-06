import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: '영상',
  description: '한로로 뮤직비디오, 라이브 클립, 비하인드 영상을 한곳에서 모아보세요.',
  keywords: ['한로로', 'HANRORO', '뮤직비디오', 'MV', '라이브 클립', '비하인드', '유튜브'],
  openGraph: {
    title: '영상 | 한로로 팬사이트',
    description: '한로로 뮤직비디오, 라이브 클립, 비하인드 영상을 한곳에서 모아보세요.',
    url: 'https://www.hanroro.co.kr/videos',
    type: 'website',
    images: [
      {
        url: '/assets/한로로프로필사진.jpg',
        width: 1200,
        height: 630,
        alt: '한로로 영상',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.hanroro.co.kr/videos',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: 'https://www.hanroro.co.kr',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '영상',
      item: 'https://www.hanroro.co.kr/videos',
    },
  ],
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      {children}
    </>
  );
}
