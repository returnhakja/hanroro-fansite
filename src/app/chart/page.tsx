import { Suspense } from 'react';
import type { Metadata } from 'next';
import ChartClient from './ChartClient';

export const metadata: Metadata = {
  title: '차트 | HANRORO',
  description: '팬이 직접 뽑는 한로로 실시간 최애곡 차트. 디스코그래피 전곡 대상 집계.',
};

export default function ChartPage() {
  return (
    <Suspense>
      <ChartClient />
    </Suspense>
  );
}
