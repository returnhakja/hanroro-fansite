import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Board from "@/lib/db/models/Board";

const BASE_URL = "https://hanroro-fansite.vercel.app";

export async function GET() {
  await connectDB();

  const posts = await Board.find().sort({ createdAt: -1 }).limit(5).lean();

  const items = posts
    .map((post) => {
      const id = (post._id as { toString(): string }).toString();
      const pubDate = new Date(post.createdAt).toUTCString();
      const content = post.content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      const title = post.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `
    <item>
      <title>${title}</title>
      <link>${BASE_URL}/board/${id}</link>
      <guid isPermaLink="true">${BASE_URL}/board/${id}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author}</author>
      <description>${content.slice(0, 200)}${content.length > 200 ? "..." : ""}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>한로로 팬사이트 - 커뮤니티</title>
    <link>${BASE_URL}/board</link>
    <description>한로로 팬 커뮤니티 게시판 최신 글</description>
    <language>ko</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
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
