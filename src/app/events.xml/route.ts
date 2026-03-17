import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Event from "@/lib/db/models/Event";

const BASE_URL = "https://hanroro-fansite.vercel.app";

const EVENT_TYPE_LABEL: Record<string, string> = {
  concert: "콘서트",
  award: "시상식",
  broadcast: "방송",
  festival: "페스티벌",
  other: "기타",
};

export async function GET() {
  await connectDB();

  const events = await Event.find().sort({ date: -1 }).limit(5).lean();

  const items = events
    .map((event) => {
      const id = (event._id as { toString(): string }).toString();
      const pubDate = new Date(event.createdAt).toUTCString();
      const eventDate = new Date(event.date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const typeLabel = EVENT_TYPE_LABEL[event.type] ?? "기타";

      const title = event.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const descParts = [`[${typeLabel}] ${eventDate}`];
      if (event.place) descParts.push(`장소: ${event.place}`);
      if (event.time) descParts.push(`시간: ${event.time}`);
      const description = descParts
        .join(" | ")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `
    <item>
      <title>${title}</title>
      <link>${BASE_URL}/schedule</link>
      <guid isPermaLink="false">${BASE_URL}/schedule#${id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>한로로 팬사이트 - 일정</title>
    <link>${BASE_URL}/schedule</link>
    <description>한로로 공연 및 일정 업데이트</description>
    <language>ko</language>
    <atom:link href="${BASE_URL}/events.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
