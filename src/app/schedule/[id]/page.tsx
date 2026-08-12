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

const defaultMetadata: Metadata = {
  title: "일정을 찾을 수 없습니다",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const event = await getEventById(id);
    if (!event) return defaultMetadata;

    const title = event.title as string;
    const description = buildEventDescription({
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
        canonical: `${BASE_URL}/schedule/${id}`,
      },
    };
  } catch {
    return defaultMetadata;
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
        description: buildEventDescription({
          title,
          type: eventType,
          date,
          time,
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
