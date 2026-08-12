import { cache, Suspense } from "react";
import type { Metadata } from "next";
import connectDB from "@/lib/db/mongoose";
import Event from "@/lib/db/models/Event";
import StructuredData from "@/components/seo/StructuredData";
import SchedulePageClient from "./SchedulePageClient";
import { buildStartDate, getSchemaEventType } from "@/lib/utils/eventSchema";

const BASE_URL = "https://www.hanroro.co.kr";

const getUpcomingEventsForSchema = cache(async () => {
  await connectDB();
  const now = new Date();
  return Event.find({
    $or: [{ date: { $gte: now } }, { isPinned: true }],
  })
    .sort({ isPinned: -1, date: 1 })
    .limit(10)
    .lean();
});

export const metadata: Metadata = {
  title: "일정",
  description:
    "한로로의 다가오는 공연, 팬미팅, 방송 일정을 확인하세요. D-day와 캘린더로 일정을 보고, 셋리스트·포토 갤러리로 이어서 즐겨 보세요.",
  keywords: [
    "한로로",
    "HANRORO",
    "공연 일정",
    "팬미팅",
    "콘서트",
    "일정",
    "스케줄",
  ],
  openGraph: {
    title: "일정 | 한로로 팬사이트",
    description: "한로로의 다가오는 공연, 팬미팅, 방송 일정을 확인하세요.",
    url: `${BASE_URL}/schedule`,
    type: "website",
    images: [
      {
        url: "/assets/한로로프로필사진.jpg",
        width: 1200,
        height: 630,
        alt: "한로로 일정",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "일정 | 한로로 팬사이트",
    description: "한로로의 다가오는 공연, 팬미팅, 방송 일정을 확인하세요.",
    images: ["/assets/한로로프로필사진.jpg"],
  },
  alternates: {
    canonical: `${BASE_URL}/schedule`,
  },
};

// ─── 페이지 컴포넌트 ──────────────────────────────────────────────

export default async function SchedulePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "일정",
        item: `${BASE_URL}/schedule`,
      },
    ],
  };

  let itemListSchema: object | null = null;

  try {
    const events = await getUpcomingEventsForSchema();
    if (events.length > 0) {
      itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "한로로 다가오는 일정",
        description: "한로로의 다가오는 공연, 팬미팅, 방송 일정",
        url: `${BASE_URL}/schedule`,
        numberOfItems: events.length,
        itemListElement: events.map((event, index) => {
          const eventId = (event._id as { toString(): string }).toString();
          const eventStartDate = buildStartDate(
            event.date as Date,
            event.time as string | undefined,
          );
          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": getSchemaEventType(event.type as string),
              name: event.title,
              startDate: eventStartDate,
              endDate: eventStartDate,
              url: `${BASE_URL}/schedule/${eventId}`,
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              image: event.posterUrl
                ? [event.posterUrl]
                : [`${BASE_URL}/assets/한로로프로필사진.jpg`],
              location: {
                "@type": "Place",
                name: event.place ?? "미정",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: event.place ? "서울" : "미정",
                  addressCountry: "KR",
                },
              },
              offers: {
                "@type": "Offer",
                url: `${BASE_URL}/schedule/${eventId}`,
                availability: "https://schema.org/InStock",
                price: "0",
                priceCurrency: "KRW",
              },
              performer: {
                "@type": "MusicGroup",
                name: "한로로",
                alternateName: "HANRORO",
              },
              organizer: {
                "@type": "Organization",
                name: "한로로 팬사이트",
                url: BASE_URL,
              },
            },
          };
        }),
      };
    }
  } catch {}

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      {itemListSchema && <StructuredData data={itemListSchema} />}
      <Suspense fallback={null}>
        <SchedulePageClient />
      </Suspense>
    </>
  );
}
