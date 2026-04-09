import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: '셋리스트',
  description: '한로로 공연 셋리스트 모음. 각 공연에서 불렀던 노래 목록을 Day별로 확인하세요.',
  keywords: ['한로로', 'HANRORO', '셋리스트', 'setlist', '공연', '노래 목록', '콘서트'],
  openGraph: {
    title: '셋리스트 | 한로로 팬사이트',
    description: '한로로 공연 셋리스트 모음. 각 공연에서 불렀던 노래 목록을 확인하세요.',
    url: 'https://www.hanroro.co.kr/setlist',
    type: 'website',
    images: [
      {
        url: '/assets/한로로프로필사진.jpg',
        width: 1200,
        height: 630,
        alt: '한로로 셋리스트',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.hanroro.co.kr/setlist',
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
      name: '셋리스트',
      item: 'https://www.hanroro.co.kr/setlist',
    },
  ],
};

const setlistPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '한로로 공연 셋리스트',
  description: '한로로 공연 셋리스트 모음',
  url: 'https://www.hanroro.co.kr/setlist',
  inLanguage: 'ko-KR',
  about: {
    '@type': 'MusicGroup',
    name: '한로로',
    alternateName: 'HANRORO',
  },
};

export default function SetlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={setlistPageSchema} />
      {children}
    </>
  );
}
