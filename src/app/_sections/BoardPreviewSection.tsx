"use client";

import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBoardList } from "@/hooks/queries/useBoard";
import { formatDateLong } from "@/lib/utils/time";
import {
  SectionOverline,
  SectionTitle,
  SectionLink,
  SectionHeader,
  SectionHeaderLeft,
} from "./common.styles";
import {
  PreviewSection,
  PreviewList,
  PreviewItem,
  PreviewItemTitle,
  PreviewItemMeta,
} from "./PreviewList.styles";

export default function BoardPreviewSection() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { data: postData } = useBoardList();
  const posts = postData?.slice(0, 5) ?? [];

  return (
    <PreviewSection>
      <SectionHeader>
        <SectionHeaderLeft>
          <SectionOverline>LATEST</SectionOverline>
          <SectionTitle>최신 소식</SectionTitle>
        </SectionHeaderLeft>
        <SectionLink onClick={() => router.push("/board")}>더 보기</SectionLink>
      </SectionHeader>
      <PreviewList>
        {posts.map((post, index) => (
          <PreviewItem
            key={post._id}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onClick={() => router.push(`/board/${post._id}`)}
          >
            <PreviewItemTitle>{post.title}</PreviewItemTitle>
            <PreviewItemMeta>
              <span>{post.author}</span>
              <span>{formatDateLong(post.createdAt)}</span>
              <span>조회 {post.views}</span>
            </PreviewItemMeta>
          </PreviewItem>
        ))}
      </PreviewList>
    </PreviewSection>
  );
}
