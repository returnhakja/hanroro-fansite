import StructuredData from "@/components/seo/StructuredData";

const schedulePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "한로로 공연 일정",
  description:
    "한로로의 다가오는 공연, 팬미팅, 방송 일정을 확인하세요. D-day 카운트다운과 전체 캘린더를 제공합니다.",
  url: "https://hanroro-fansite.vercel.app/schedule",
  inLanguage: "ko-KR",
  specialty: "공연 일정 및 이벤트 정보",
  about: {
    "@type": "MusicGroup",
    name: "한로로",
    alternateName: "HANRORO",
    url: "https://hanroro-fansite.vercel.app/profile",
  },
  isPartOf: {
    "@type": "WebSite",
    name: "한로로 팬사이트",
    url: "https://hanroro-fansite.vercel.app",
  },
  potentialAction: {
    "@type": "ViewAction",
    name: "한로로 일정 보기",
    target: "https://hanroro-fansite.vercel.app/schedule",
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
