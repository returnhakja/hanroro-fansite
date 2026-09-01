import { cache } from "react";
import type { Metadata } from "next";
import connectDB from "@/lib/db/mongoose";
import Event from "@/lib/db/models/Event";
import StructuredData from "@/components/seo/StructuredData";
import EventDetailClient from "./EventDetailClient";
import {
  buildStartDate,
  buildEventDescription,
  getEventTypeLabel,
  getSchemaEventType,
} from "@/lib/utils/eventSchema";

const BASE_URL = "https://www.hanroro.co.kr";

const getEventById = cache(async (id: string) => {
  await connectDB();
  return Event.findById(id).lean();
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // layout.tsx가 /schedule/* 전체에 canonical: "/schedule"을 기본으로 깔아두기 때문에,
  // 여기서 canonical을 명시적으로 안 내려주면(=상속) 개별 일정 페이지가 목록 페이지의
  // "대체 페이지"로 취급되어 색인에서 빠진다. 조회 실패/에러 상황에도 반드시
  // 이 페이지 자신을 canonical로 지정한다.
  const canonical = `${BASE_URL}/schedule/${id}`;

  try {
    const event = await getEventById(id);
    if (!event) {
      return {
        title: "일정을 찾을 수 없습니다",
        alternates: { canonical },
        robots: { index: false, follow: true },
      };
    }

    const title = event.title as string;
    const description = buildEventDescription({
      title,
      type: event.type as string,
      date: event.date as Date,
      time: event.time as string | undefined,
      endTime: event.endTime as string | undefined,
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
        url: `${BASE_URL}/schedule/${id}`,
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
        canonical,
      },
    };
  } catch {
    return {
      title: "일정을 찾을 수 없습니다",
      alternates: { canonical },
    };
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let eventSchema: object | null = null;
  let breadcrumbSchema: object | null = null;

  try {
    const event = await getEventById(id);
    if (event) {
      const title = event.title as string;
      const date = event.date as Date;
      const time = event.time as string | undefined;
      const endTime = event.endTime as string | undefined;
      const place = event.place as string | undefined;
      const posterUrl = event.posterUrl as string | undefined;
      const eventType = event.type as string;

      const startDate = buildStartDate(date, time);
      // 종료 시각이 있으면(페스티벌 타임테이블 등) 실제 종료 시각을 쓰고,
      // 없으면 기존처럼 시작 시각과 동일하게 둔다
      const endDate = endTime ? buildStartDate(date, endTime) : startDate;
      eventSchema = {
        "@context": "https://schema.org",
        "@type": getSchemaEventType(eventType),
        name: title,
        startDate,
        endDate,
        description: buildEventDescription({
          title,
          type: eventType,
          date,
          time,
          endTime,
          place,
        }),
        url: `${BASE_URL}/schedule/${id}`,
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
          url: `${BASE_URL}/schedule/${id}`,
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
            item: `${BASE_URL}/schedule/${id}`,
          },
        ],
      };
    }
  } catch {}

  return (
    <>
      {eventSchema && <StructuredData data={eventSchema} />}
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      <EventDetailClient eventId={id} />
    </>
  );
}
