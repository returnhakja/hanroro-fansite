import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/components/providers/StyledComponentsRegistry';
import { LoadingProvider } from '@/components/providers/LoadingProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://hanroro-fansite.vercel.app'),
  title: {
    default: '한로로 팬사이트 - HANRORO Fansite',
    template: '%s | 한로로 팬사이트',
  },
  description: '싱어송라이터 한로로의 공식 팬사이트 - 갤러리, 공연 일정, 커뮤니티',
  keywords: ['한로로', 'HANRORO', '싱어송라이터', 'K-POP', '팬사이트', '공연', '갤러리'],
  authors: [{ name: 'HANRORO Fansite Team' }],
  creator: 'HANRORO Fansite',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://hanroro-fansite.vercel.app',
    siteName: '한로로 팬사이트',
    title: '한로로 팬사이트 - HANRORO Fansite',
    description: '싱어송라이터 한로로의 공식 팬사이트',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <LoadingProvider>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 200px)' }}>
              {children}
            </main>
            <Footer />
          </LoadingProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
