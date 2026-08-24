import type { Metadata } from 'next';
import BuilderClient from './BuilderClient';

const BASE_URL = 'https://www.hanroro.co.kr';

export const metadata: Metadata = {
  title: '내 최애 세트리스트 만들기',
  description: '좋아하는 한로로 곡을 골라 나만의 세트리스트를 만들고 공유해보세요.',
  alternates: {
    canonical: `${BASE_URL}/setlist/builder`,
  },
};

export default function SetlistBuilderPage() {
  return <BuilderClient />;
}
