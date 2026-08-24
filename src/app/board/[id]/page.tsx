import { cache } from "react";
import type { Metadata } from "next";
import connectDB from "@/lib/db/mongoose";
import Board from "@/lib/db/models/Board";
import BoardDetailClient from "./BoardDetailClient";
import StructuredData from "@/components/seo/StructuredData";

const getPost = cache(async (id: string) => {
  await connectDB();
  return Board.findById(id).lean();
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // layout.tsx가 /board/* 전체에 canonical: "/board"를 기본으로 깔아두기 때문에,
  // 여기서 canonical을 명시적으로 안 내려주면(=상속) 개별 게시글이 목록 페이지의
  // "대체 페이지"로 취급되어 색인에서 빠진다. 조회 실패/에러 상황에도 반드시
  // 이 페이지 자신을 canonical로 지정한다.
  const canonical = `https://www.hanroro.co.kr/board/${id}`;

  try {
    const post = await getPost(id);

    if (!post) {
      return {
        title: "게시글을 찾을 수 없습니다",
        alternates: { canonical },
        robots: { index: false, follow: true },
      };
    }

    const title = post.title as string;
    const raw = (post.content as string).replace(/<[^>]*>/g, "");
    const description = raw.length > 100 ? raw.slice(0, 100) + "..." : raw;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | 한로로 팬사이트`,
        description,
        url: `https://www.hanroro.co.kr/board/${id}`,
        type: "article",
      },
      alternates: {
        canonical,
      },
    };
  } catch {
    return {
      title: "게시글을 찾을 수 없습니다",
      alternates: { canonical },
    };
  }
}

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let discussionSchema: object | null = null;
  let breadcrumbSchema: object | null = null;

  try {
    const post = await getPost(id);
    if (post) {
      const title = post.title as string;
      const plainText = (post.content as string)
        .replace(/<[^>]*>/g, "")
        .slice(0, 500);

      discussionSchema = {
        "@context": "https://schema.org",
        "@type": "DiscussionForumPosting",
        headline: title,
        text: plainText,
        url: `https://www.hanroro.co.kr/board/${id}`,
        datePublished: (post.createdAt as Date).toISOString(),
        author: {
          "@type": "Person",
          name: post.author as string,
        },
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LikeAction",
            userInteractionCount: post.likes as number,
          },
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ViewAction",
            userInteractionCount: post.views as number,
          },
        ],
        isPartOf: {
          "@type": "DiscussionForum",
          name: "한로로 팬 게시판",
          url: "https://www.hanroro.co.kr/board",
        },
      };

      breadcrumbSchema = {
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
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: `https://www.hanroro.co.kr/board/${id}`,
          },
        ],
      };
    }
  } catch {}

  return (
    <>
      {discussionSchema && <StructuredData data={discussionSchema} />}
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      <BoardDetailClient params={params} />
    </>
  );
}
