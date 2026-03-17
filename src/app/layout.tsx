import type { Metadata } from "next";
import StyledComponentsRegistry from "@/components/providers/StyledComponentsRegistry";
import { QueryProvider } from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/seo/StructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import NaverAnalytics from "@/components/analytics/NaverAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hanroro-fansite.vercel.app"),
  title: {
    default: "한로로 팬사이트 - HANRORO FANSITE",
    template: "%s | 한로로 팬사이트",
  },
  description: "싱어송라이터 한로로의 팬사이트 - 갤러리, 공연 일정, 커뮤니티",
  applicationName: "한로로 팬사이트",
  keywords: [
    "한로로",
    "HANRORO",
    "싱어송라이터",
    "K-POP",
    "팬사이트",
    "공연",
    "갤러리",
    "커뮤니티",
    "한로로 팬사이트",
  ],
  authors: [{ name: "HANRORO Fansite Team" }],
  creator: "HANRORO Fansite",
  publisher: "HANRORO Fansite",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://hanroro-fansite.vercel.app",
    siteName: "한로로 팬사이트",
    title: "한로로 팬사이트 - HANRORO Fansite",
    description: "싱어송라이터 한로로의 팬사이트 - 갤러리, 공연 일정, 커뮤니티",
    images: [
      {
        url: "/assets/한로로프로필사진.jpg",
        width: 1200,
        height: 630,
        alt: "한로로 HANRORO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "한로로 팬사이트 - HANRORO Fansite",
    description: "싱어송라이터 한로로의 팬사이트 - 갤러리, 공연 일정, 커뮤니티",
    images: ["/assets/한로로프로필사진.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "gUst9xCDKHE1N5UtmTKyMhuS-FXMy9ANeAttMgyGt88",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "한로로 팬사이트",
    alternateName: "HANRORO Fansite",
    url: "https://hanroro-fansite.vercel.app",
    logo: "https://hanroro-fansite.vercel.app/assets/한로로프로필사진.jpg",
    description: "싱어송라이터 한로로의 팬사이트 - 갤러리, 공연 일정, 커뮤니티",
    sameAs: [
      // 여기에 한로로의 공식 SNS 링크를 추가할 수 있습니다
      "https://www.youtube.com/channel/UCrDa_5OU-rhvXqWlPx5hgKQ",
      "https://www.instagram.com/hanr0r0/",
      "https://artist.mnetplus.world/main/stg/hanroro",
      "https://blog.naver.com/hanr0r0",
      // 'https://www.instagram.com/hanroro',
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HANRORO Fansite",
    alternateName: "한로로 팬사이트",
    url: "https://hanroro-fansite.vercel.app",
    description: "싱어송라이터 한로로의 팬사이트 - 갤러리, 공연 일정, 커뮤니티",
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://hanroro-fansite.vercel.app/board?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const musicGroupSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "한로로",
    alternateName: "HANRORO",
    description: "감성적인 음악으로 많은 팬들의 사랑을 받는 싱어송라이터",
    genre: ["인디팝", "발라드", "K-POP"],
    url: "https://hanroro-fansite.vercel.app/profile",
    image: "https://hanroro-fansite.vercel.app/assets/한로로프로필사진.jpg",
    sameAs: [
      "https://www.youtube.com/channel/UCrDa_5OU-rhvXqWlPx5hgKQ",
      "https://www.instagram.com/hanr0r0/",
      "https://artist.mnetplus.world/main/stg/hanroro",
      "https://blog.naver.com/hanr0r0",
    ],
  };

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta
          name="naver-site-verification"
          content="9e1a2cd75f7c82d56d3a60a3b7d1c3ddf56ae2d1"
        />
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <StructuredData data={musicGroupSchema} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="한로로 팬사이트 - 커뮤니티"
          href="https://hanroro-fansite.vercel.app/feed.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="한로로 팬사이트 - 일정"
          href="https://hanroro-fansite.vercel.app/events.xml"
        />
      </head>
      <body>
        <GoogleAnalytics />
        <NaverAnalytics />
        <StyledComponentsRegistry>
          <QueryProvider>
            <AuthProvider>
              <LoadingProvider>
                <Header />
                <main
                  style={{ minHeight: "calc(100vh - 200px)", paddingTop: "70px" }}
                >
                  {children}
                </main>
                <Footer />
              </LoadingProvider>
            </AuthProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
