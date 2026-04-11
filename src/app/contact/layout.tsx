import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기',
  description:
    '한로로 팬사이트에 대한 비밀 문의입니다. 로그인 후 작성하며, 본인과 운영자만 내용을 확인할 수 있습니다.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
