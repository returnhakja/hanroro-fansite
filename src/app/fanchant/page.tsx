import { Suspense } from 'react';
import type { Metadata } from 'next';
import FanchantPageClient from './FanchantPageClient';

export const metadata: Metadata = {
  title: '응원법 | HANRORO',
  description: '한로로 콘서트 응원법 가이드. 공연장에서 함께 응원해요.',
};

export default function FanchantPage() {
  return (
    <Suspense>
      <FanchantPageClient />
    </Suspense>
  );
}
