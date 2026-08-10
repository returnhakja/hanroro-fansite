import type { Metadata, Viewport } from "next";
import StyledComponentsRegistry from "@/components/providers/StyledComponentsRegistry";
import { QueryProvider } from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/seo/StructuredData";
import NaverAnalytics from "@/components/analytics/NaverAnalytics";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import ScrollToTop from "@/components/ui/ScrollToTop";
import RegisterSW from "@/components/pwa/RegisterSW";
import "./globals.css";

const SITE_URL = "https://www.hanroro.co.kr";

/**
 * 사이트 공통 설명 문구.
 * metadata / openGraph / twitter / JSON-LD 가 각자 다른 문구를 쓰다 어긋나는 걸 막기 위해
 * 한 곳에서만 관리한다. 검색 스니펫은 한글 기준 80자 부근에서 잘리므로
 * "수상 이력 + 최신 릴리즈"를 앞에 두고, 사이트 기능 나열은 뒤에 붙인다.
 */
const SITE_DESCRIPTION =
  "2026 한국대중음악상 올해의 음악인 · 신곡 '너와 나' — 싱어송라이터 한로로(HANRORO)의 비공식 팬사이트. 공연 일정, 셋리스트, 갤러리, 연대기, 응원법과 최신 활동을 한곳에서 확인하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "한로로 팬사이트 - HANRORO FANSITE",
    template: "%s | 한로로 팬사이트",
  },
  description: SITE_DESCRIPTION,
  applicationName: "한로로 팬사이트",
  keywords: [
    // 핵심 검색어
    "한로로",
    "HANRORO",
    "한로로 팬사이트",
    "한로로 팬페이지",
    "한로로 비공식 팬사이트",
    "한지수",
    "싱어송라이터 한로로",

    // 사이트 핵심 콘텐츠
    "한로로 일정",
    "한로로 공연",
    "한로로 공연 일정",
    "한로로 콘서트",
    "한로로 셋리스트",
    "한로로 갤러리",
    "한로로 사진",
    "한로로 연대기",
    "한로로 응원법",
    "한로로 팬챈트",
    "한로로 차트",
    "한로로 최애곡",

    // 음악
    "한로로 너와 나",
    "너와 나",
    "한로로 애증",
    "애증",
    "한로로 자몽살구클럽",
    "자몽살구클럽",
    "한로로 시간을 달리네",
    "시간을 달리네",
    "한로로 0+0",
    "한로로 입춘",

    // 주요 이력
    "2026 한국대중음악상",
    "한국대중음악상 올해의 음악인",
    "한로로 한국대중음악상",

    // 방송 / 검색 유입
    "한로로 라디오스타",
    "라디오스타 한로로",
    "한로로 유퀴즈",
    "유퀴즈 한로로",
    "한로로 꼰대희",
    "꼰대희 한로로",
    "강남 한로로",

    // 영문
    "HANRORO fansite",
    "HANRORO schedule",
    "HANRORO setlist",
    "HANRORO concert",
  ],
  authors: [{ name: "HANRORO Fansite Team" }],
  creator: "HANRORO Fansite",
  publisher: "HANRORO Fansite",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "한로로 팬사이트",
    title: "한로로 팬사이트 - HANRORO Fansite",
    description: SITE_DESCRIPTION,
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
    description: SITE_DESCRIPTION,
    images: ["/assets/한로로프로필사진.jpg"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "한로로 팬사이트",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png", sizes: "96x96" },
      {
        url: "/web-app-manifest-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/web-app-manifest-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
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
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "한로로 팬사이트 - 커뮤니티" },
        { url: "/events.xml", title: "한로로 팬사이트 - 일정" },
      ],
    },
  },
  verification: {
    google: "gUst9xCDKHE1N5UtmTKyMhuS-FXMy9ANeAttMgyGt88",
    other: {
      "naver-site-verification": "228f113d2db5fd82017fb9036bddd68e5ebaaa48",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#8B7355",
  width: "device-width",
  initialScale: 1,
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
    url: SITE_URL,
    logo: `${SITE_URL}/assets/한로로프로필사진.jpg`,
    description: SITE_DESCRIPTION,
    sameAs: [
      "https://www.youtube.com/channel/UCrDa_5OU-rhvXqWlPx5hgKQ",
      "https://www.instagram.com/hanr0r0/",
      "https://artist.mnetplus.world/main/stg/hanroro",
      "https://blog.naver.com/hanr0r0",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HANRORO Fansite",
    alternateName: "한로로 팬사이트",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/board?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const musicGroupSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "한로로",
    alternateName: "HANRORO",
    description:
      "청춘의 감성과 경험을 깊이 있게 담아내는 서정적이고 시적인 가사, 그리고 호소력 짙은 보컬의 싱어송라이터. 2026 한국대중음악상 올해의 음악인.",
    genre: ["모던 록", "인디팝", "K-POP"],
    url: `${SITE_URL}/profile`,
    image: `${SITE_URL}/assets/한로로프로필사진.jpg`,
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
        {/* naver-site-verification / RSS 링크는 metadata 의 verification·alternates 에서 생성된다 */}
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <StructuredData data={musicGroupSchema} />
      </head>
      <body>
        <RegisterSW />
        <ScrollToTop />
        <GoogleTagManager />
        <NaverAnalytics />
        <StyledComponentsRegistry>
          <QueryProvider>
            <AuthProvider>
              <LoadingProvider>
                <Header />
                <main
                  style={{
                    minHeight: "calc(100vh - 200px)",
                    paddingTop: "70px",
                  }}
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
