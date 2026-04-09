import { Metadata } from "next";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "공연 일정",
  description: "한로로의 다가오는 공연·팬미팅·방송 일정을 한눈에 확인하세요. D-day 카운트다운과 월별 캘린더 제공.",
  keywords: ["한로로", "한로로 스케줄", "한로로 공연", "한로로 일정", "HANRORO", "공연 일정", "팬미팅"],
  openGraph: {
    title: "공연 일정 | 한로로 팬사이트",
    description: "한로로의 다가오는 공연·팬미팅·방송 일정을 한눈에 확인하세요. D-day 카운트다운과 월별 캘린더 제공.",
    url: "https://www.hanroro.co.kr/schedule",
    type: "website",
    images: [
      {
        url: "/assets/한로로프로필사진.jpg",
        width: 1200,
        height: 630,
        alt: "한로로 공연 일정",
      },
    ],
  },
  alternates: {
    canonical: "https://www.hanroro.co.kr/schedule",
  },
};

const schedulePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "한로로 공연 일정",
  description:
    "한로로의 다가오는 공연, 팬미팅, 방송 일정을 확인하세요. D-day 카운트다운과 전체 캘린더를 제공합니다.",
  url: "https://www.hanroro.co.kr/schedule",
  inLanguage: "ko-KR",
  specialty: "공연 일정 및 이벤트 정보",
  about: {
    "@type": "MusicGroup",
    name: "한로로",
    alternateName: "HANRORO",
    url: "https://www.hanroro.co.kr/profile",
  },
  isPartOf: {
    "@type": "WebSite",
    name: "한로로 팬사이트",
    url: "https://www.hanroro.co.kr",
  },
  potentialAction: {
    "@type": "ViewAction",
    name: "한로로 일정 보기",
    target: "https://www.hanroro.co.kr/schedule",
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={schedulePageSchema} />
      {children}
    </>
  );
}
