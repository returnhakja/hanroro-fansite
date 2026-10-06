import type { Metadata } from 'next';

// robots.txt에서도 /mypage를 막고 있지만(크롤링 자체 방지), 혹시 다른 경로로
// 이미 색인된 경우를 대비해 메타 태그로도 명시적으로 noindex 처리한다.
export const metadata: Metadata = {
  title: '마이페이지',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
