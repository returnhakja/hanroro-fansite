import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: '한로로 프로필 | 공식 팬사이트 – 일정·셋리스트',
  description:
    '싱어송라이터 한로로의 소개와 디스코그래피. 다가오는 공연 일정, 셋리스트, 팬 갤러리·게시판까지 한로로 팬사이트에서 함께 확인해 보세요.',
  keywords: ['한로로', 'HANRORO', '프로필', '디스코그래피', '앨범', '싱어송라이터', '일정', '셋리스트'],
  openGraph: {
    title: '한로로 프로필 | 공식 팬사이트 – 일정·셋리스트',
    description:
      '한로로 소개·앨범 정보와 함께, 공연 일정·셋리스트·갤러리로 바로 이어집니다.',
    url: 'https://www.hanroro.co.kr/profile',
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
    canonical: 'https://www.hanroro.co.kr/profile',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: '한로로',
  alternateName: 'HANRORO',
  description:
    '싱어송라이터 한로로. 공식 팬사이트에서 프로필·일정·셋리스트·갤러리를 확인할 수 있습니다.',
  genre: ['인디팝', '발라드', 'K-POP'],
  url: 'https://www.hanroro.co.kr/profile',
  image: 'https://www.hanroro.co.kr/assets/한로로프로필사진.jpg',
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
      item: 'https://www.hanroro.co.kr',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '프로필',
      item: 'https://www.hanroro.co.kr/profile',
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
