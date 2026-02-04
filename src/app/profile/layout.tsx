import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프로필',
  description: '싱어송라이터 한로로의 프로필, 디스코그래피, 활동 내역을 확인하세요.',
  keywords: ['한로로', 'HANRORO', '프로필', '디스코그래피', '앨범', '싱어송라이터'],
  openGraph: {
    title: '프로필 | 한로로 팬사이트',
    description: '싱어송라이터 한로로의 프로필, 디스코그래피, 활동 내역을 확인하세요.',
    url: 'https://hanroro-fansite.vercel.app/profile',
    type: 'profile',
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
