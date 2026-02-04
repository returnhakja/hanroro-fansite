import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이미지 업로드',
  description: '한로로와 관련된 이미지를 팬사이트에 업로드하고 공유해보세요.',
  keywords: ['한로로', 'HANRORO', '이미지 업로드', '사진 공유'],
  robots: {
    index: true,
    follow: true,
  },
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
