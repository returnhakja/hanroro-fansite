import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: '갤러리',
  description: '한로로 팬들이 공유한 아름다운 이미지들을 감상하세요. 한로로 공연 사진, 팬아트 등 다양한 갤러리 콘텐츠를 만나보세요.',
  keywords: ['한로로', 'HANRORO', '갤러리', '팬아트', '공연사진', '이미지'],
  openGraph: {
    title: '갤러리 | 한로로 팬사이트',
    description: '한로로 팬들이 공유한 아름다운 이미지들을 감상하세요.',
    url: 'https://www.hanroro.co.kr/gallery',
    type: 'website',
    images: [
      {
        url: '/assets/한로로프로필사진.jpg',
        width: 1200,
        height: 630,
        alt: '한로로 갤러리',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.hanroro.co.kr/gallery',
  },
};

const gallerySchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '한로로 팬 갤러리',
  description: '한로로 팬들이 공유한 공연 사진 및 팬 이미지 모음',
  url: 'https://www.hanroro.co.kr/gallery',
  inLanguage: 'ko-KR',
  about: {
    '@type': 'MusicGroup',
    name: '한로로',
    alternateName: 'HANRORO',
  },
  breadcrumb: {
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
        name: '갤러리',
        item: 'https://www.hanroro.co.kr/gallery',
      },
    ],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={gallerySchema} />
      {children}
    </>
  );
}
