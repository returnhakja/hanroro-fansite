import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: '게시판',
  description: '한로로 팬들의 소통 공간. 공연 후기, 팬 활동, 정보 공유 등 다양한 이야기를 나눠보세요.',
  keywords: ['한로로', 'HANRORO', '게시판', '커뮤니티', '팬 게시판', '공연후기'],
  openGraph: {
    title: '게시판 | 한로로 팬사이트',
    description: '한로로 팬들의 소통 공간. 공연 후기, 팬 활동, 정보 공유 등 다양한 이야기를 나눠보세요.',
    url: 'https://www.hanroro.co.kr/board',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.hanroro.co.kr/board',
  },
};

const forumSchema = {
  '@context': 'https://schema.org',
  '@type': 'DiscussionForum',
  name: '한로로 팬 게시판',
  description: '한로로 팬들의 소통 공간. 공연 후기, 팬 활동, 정보 공유 등 다양한 이야기를 나눠보세요.',
  url: 'https://www.hanroro.co.kr/board',
  inLanguage: 'ko-KR',
  isPartOf: {
    '@type': 'WebSite',
    name: '한로로 팬사이트',
    url: 'https://www.hanroro.co.kr',
  },
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={forumSchema} />
      {children}
    </>
  );
}
