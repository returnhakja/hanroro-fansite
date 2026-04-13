import type { Metadata } from 'next';
import ChronicleClient from './ChronicleClient';

export const metadata: Metadata = {
  title: '연대기 | HANRORO',
  description:
    '한로로의 공연, 음원 발매, 방송 출연, 시상식 등 활동 연대기. 연도별로 한로로의 발자취를 돌아보세요.',
  openGraph: {
    title: '연대기 | HANRORO',
    description: '한로로의 활동 발자취를 연도별로 돌아보세요',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '연대기 | HANRORO',
    description: '한로로의 활동 발자취를 연도별로 돌아보세요',
  },
};

export default function ChroniclePage() {
  return <ChronicleClient />;
}
