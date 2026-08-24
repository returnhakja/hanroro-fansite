import { MetadataRoute } from "next";
import connectDB from "@/lib/db/mongoose";
import Board from "@/lib/db/models/Board";
import Event from "@/lib/db/models/Event";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.hanroro.co.kr";

  // 정적 페이지
  // lastModified는 실제 콘텐츠 변경 시점을 추적하지 않는 페이지들이라
  // "요청 시점의 현재 시각"을 매번 박아넣지 않고 생략한다 (Google에 부정확한
  // 재크롤링 신호를 주지 않기 위함). changeFrequency/priority로만 안내한다.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/board`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/schedule`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/setlist`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chart`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chronicle`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fanchant`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profile`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    await connectDB();

    const posts = await Board.find({})
      .select("_id createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const boardRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/board/${post._id.toString()}`,
      lastModified: post.createdAt as Date,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const events = await Event.find({}).select("_id updatedAt").lean();

    const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${baseUrl}/schedule/${event._id.toString()}`,
      lastModified: event.updatedAt as Date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...boardRoutes, ...eventRoutes];
  } catch (error) {
    console.error("사이트맵 생성 오류:", error);
    return staticRoutes;
  }
}
