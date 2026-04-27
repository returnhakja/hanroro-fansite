import { cache, Suspense } from "react";
import type { Metadata } from "next";
import connectDB from "@/lib/db/mongoose";
import Event from "@/lib/db/models/Event";
import StructuredData from "@/components/seo/StructuredData";
import SchedulePageClient from "./SchedulePageClient";

const BASE_URL = "https://www.hanroro.co.kr";

const getEventById = cache(async (id: string) => {
  await connectDB();
  return Event.findById(id).lean();
});

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

function getEventTypeLabel(type: string) {
  switch (type) {
    case "concert":
      return "콘서트";
    case "fanmeeting":
      return "팬미팅";
    case "broadcast":
      return "방송";
    case "festival":
      return "페스티벌";
    case "award":
      return "시상식";
    default:
      return "기타";
  }
}

function getSchemaEventType(type: string): "MusicEvent" | "Event" {
  return ["concert", "fanmeeting", "festival"].includes(type)
    ? "MusicEvent"
    : "Event";
}

function buildStartDate(date: Date, time?: string): string {
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const [dateStr] = kstDate.toISOString().split("T");

  if (time) {
    const match = time.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const h = match[1].padStart(2, "0");
      const m = match[2];
      return `${dateStr}T${h}:${m}:00+09:00`;
    }
  }
  return dateStr;
}

function buildDescription(event: {
  title: string;
  type: string;
  date: Date;
  time?: string | null;
  place?: string | null;
}): string {
  const dateStr = new Date(event.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  });
  const typeLabel = getEventTypeLabel(event.type);

  let desc = `${dateStr}`;
  if (event.place) desc += ` ${event.place}에서`;
  desc += ` 열리는 한로로 ${typeLabel}입니다.`;
  if (event.time) desc += ` ${event.time}에 시작합니다.`;

  return desc;
}

const defaultMetadata: Metadata = {
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

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}): Promise<Metadata> {
  try {
    const { event: eventId } = await searchParams;
    if (!eventId) return defaultMetadata;

    const event = await getEventById(eventId);
    if (!event) return defaultMetadata;

    const title = event.title as string;
    const description = buildDescription({
      title,
      type: event.type as string,
      date: event.date as Date,
      time: event.time as string | undefined,
      place: event.place as string | undefined,
    });
    const posterUrl = event.posterUrl as string | undefined;

    return {
      title,
      description,
      keywords: [
        "한로로",
        "HANRORO",
        title,
        getEventTypeLabel(event.type as string),
        "공연",
        "일정",
      ],
      openGraph: {
        title: `${title} | 한로로 팬사이트`,
        description,
        url: `${BASE_URL}/schedule?event=${eventId}`,
        type: "website",
        images: posterUrl
          ? [{ url: posterUrl, alt: title }]
          : [
              {
                url: "/assets/한로로프로필사진.jpg",
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | 한로로 팬사이트`,
        description,
        images: posterUrl ? [posterUrl] : ["/assets/한로로프로필사진.jpg"],
      },
      alternates: {
        canonical: `${BASE_URL}/schedule?event=${eventId}`,
      },
    };
  } catch {
    return defaultMetadata;
  }
}

// ─── 페이지 컴포넌트 ──────────────────────────────────────────────

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event: eventId } = await searchParams;

  let eventSchema: object | null = null;
  let breadcrumbSchema: object | null = null;
  let itemListSchema: object | null = null;

  if (eventId) {
    try {
      const event = await getEventById(eventId);
      if (event) {
        const title = event.title as string;
        const date = event.date as Date;
        const time = event.time as string | undefined;
        const place = event.place as string | undefined;
        const posterUrl = event.posterUrl as string | undefined;
        const eventType = event.type as string;

        const startDate = buildStartDate(date, time);
        eventSchema = {
          "@context": "https://schema.org",
          "@type": getSchemaEventType(eventType),
          name: title,
          startDate,
          endDate: startDate,
          description: buildDescription({
            title,
            type: eventType,
            date,
            time,
            place,
          }),
          url: `${BASE_URL}/schedule?event=${eventId}`,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          image: posterUrl
            ? [posterUrl]
            : [`${BASE_URL}/assets/한로로프로필사진.jpg`],
          location: {
            "@type": "Place",
            name: place ?? "미정",
            address: {
              "@type": "PostalAddress",
              addressLocality: place ? "서울" : "미정",
              addressCountry: "KR",
            },
          },
          offers: {
            "@type": "Offer",
            url: `${BASE_URL}/schedule?event=${eventId}`,
            availability: "https://schema.org/InStock",
            price: "0",
            priceCurrency: "KRW",
          },
          performer: {
            "@type": "MusicGroup",
            name: "한로로",
            alternateName: "HANRORO",
            url: `${BASE_URL}/profile`,
            sameAs: [
              "https://www.youtube.com/channel/UCrDa_5OU-rhvXqWlPx5hgKQ",
              "https://www.instagram.com/hanr0r0/",
            ],
          },
          organizer: {
            "@type": "Organization",
            name: "한로로 팬사이트",
            url: BASE_URL,
          },
        };

        breadcrumbSchema = {
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
            {
              "@type": "ListItem",
              position: 3,
              name: title,
              item: `${BASE_URL}/schedule?event=${eventId}`,
            },
          ],
        };
      }
    } catch {}
  } else {
    breadcrumbSchema = {
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
            const eventId = (
              event._id as { toString(): string }
            ).toString();
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
                url: `${BASE_URL}/schedule?event=${eventId}`,
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
                  url: `${BASE_URL}/schedule?event=${eventId}`,
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
  }

  return (
    <>
      {eventSchema && <StructuredData data={eventSchema} />}
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      {itemListSchema && <StructuredData data={itemListSchema} />}
      <Suspense fallback={null}>
        <SchedulePageClient />
      </Suspense>
    </>
  );
}
