import connectDB from "@/lib/db/mongoose";
import Board from "@/lib/db/models/Board";
import BoardListClient from "./BoardListClient";
import StructuredData from "@/components/seo/StructuredData";
import type { BoardPost } from "@/hooks/queries/useBoard";

export const revalidate = 60;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: "https://www.hanroro.co.kr",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "게시판",
      item: "https://www.hanroro.co.kr/board",
    },
  ],
};

export default async function BoardPage() {
  let initialPosts: BoardPost[] = [];

  try {
    await connectDB();
    const raw = await Board.find({})
      .select("title author views likes createdAt content")
      .sort({ createdAt: -1 })
      .lean();

    initialPosts = raw.map((post) => ({
      _id: (post._id as { toString(): string }).toString(),
      title: post.title as string,
      content: post.content as string,
      author: post.author as string,
      views: post.views as number,
      likes: post.likes as number,
      createdAt: (post.createdAt as Date).toISOString(),
    }));
  } catch {
    // DB 오류 시 클라이언트에서 직접 fetch로 폴백
  }

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <BoardListClient initialPosts={initialPosts} />
    </>
  );
}
