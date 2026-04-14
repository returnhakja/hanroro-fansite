"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { INQUIRY_CATEGORY_LABELS } from "@/lib/constants/inquiry";
import { formatDateShort } from "@/lib/utils/time";
import type { InquiryDetail, InquiryReply } from "@/types/api/inquiry";

export default function InquiryDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { status } = useSession();
  const [data, setData] = useState<InquiryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/contact");
      return;
    }
    if (status !== "authenticated" || !id) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/inquiries/${id}`, {
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "불러올 수 없습니다");
        }
        if (!cancelled) {
          setData({
            ...json,
            replies: Array.isArray(json.replies) ? json.replies : [],
            replyCount: typeof json.replyCount === "number" ? json.replyCount : 0,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "오류");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, status, router]);

  if (status === "loading" || loading) {
    return (
      <Container>
        <Muted>불러오는 중…</Muted>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container>
        <PageTitle>문의 상세</PageTitle>
        <ErrorText role="alert">{error || "문의를 찾을 수 없습니다."}</ErrorText>
        <Back href="/contact">문의하기로 돌아가기</Back>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb>
        <Back href="/contact">← 문의하기</Back>
      </Breadcrumb>
      <BadgeRow>
        {data.readByAdmin ? (
          <StatusBadge $variant="done">운영자 확인됨</StatusBadge>
        ) : (
          <StatusBadge $variant="pending">접수됨</StatusBadge>
        )}
        <CategoryTag>{INQUIRY_CATEGORY_LABELS[data.category]}</CategoryTag>
      </BadgeRow>
      <PageTitle>{data.title}</PageTitle>
      <Meta>
        <span>작성자: {data.author}</span>
        <span>{formatDateShort(data.createdAt)}</span>
      </Meta>
      <SectionLabel>문의 내용</SectionLabel>
      <ContentBlock>
        {data.content.split("\n").map((line, i) => (
          <p key={i}>{line || "\u00a0"}</p>
        ))}
      </ContentBlock>

      <SectionLabel style={{ marginTop: "2rem" }}>운영자 답변</SectionLabel>
      {data.replies.length === 0 ? (
        <ReplyPlaceholder>
          아직 등록된 답변이 없습니다. 답변이 등록되면 이곳에 표시됩니다.
        </ReplyPlaceholder>
      ) : (
        <ReplyList>
          {data.replies.map((r) => (
            <ReplyItemCard key={r._id}>
              <ReplyMeta>
                {r.author} · {formatDateShort(r.createdAt)}
              </ReplyMeta>
              {r.content.split("\n").map((line, j) => (
                <p key={j}>{line || "\u00a0"}</p>
              ))}
            </ReplyItemCard>
          ))}
        </ReplyList>
      )}

      <FootNote>
        이 글은 비밀 문의이며, 본인과 운영자만 열람할 수 있습니다.
      </FootNote>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
  background: ${theme.colors.background};
  min-height: 60vh;
`;

const Breadcrumb = styled.div`
  margin-bottom: 1.25rem;
`;

const Back = styled(Link)`
  font-size: 0.95rem;
  color: ${theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const StatusBadge = styled.span<{ $variant: "pending" | "done" }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  background: ${(p) =>
    p.$variant === "done" ? theme.colors.success + "33" : theme.colors.info + "33"};
  color: ${(p) =>
    p.$variant === "done" ? theme.colors.success : theme.colors.info};
`;

const CategoryTag = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textSecondary};
  padding: 0.25rem 0.6rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
`;

const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  line-height: ${theme.typography.h2.lineHeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 1rem 0;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${theme.colors.textTertiary};
  margin-bottom: 2rem;
`;

const SectionLabel = styled.h2`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.textTertiary};
  margin: 0 0 0.65rem 0;
`;

const ContentBlock = styled.div`
  padding: 1.5rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  line-height: 1.7;
  color: ${theme.colors.textPrimary};

  p {
    margin: 0 0 0.75rem 0;
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

const ReplyPlaceholder = styled.p`
  margin: 0;
  padding: 1.25rem 1.5rem;
  background: ${theme.colors.surfaceAlt};
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ReplyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ReplyItemCard = styled.div`
  padding: 1.25rem 1.5rem;
  background: ${theme.colors.surfaceWarm};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.sm};
  border-left: 3px solid ${theme.colors.accent};
  font-size: 0.98rem;
  line-height: 1.7;
  color: ${theme.colors.textPrimary};

  p {
    margin: 0 0 0.5rem 0;
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

const ReplyMeta = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FootNote = styled.p`
  margin-top: 2rem;
  font-size: 0.85rem;
  color: ${theme.colors.textTertiary};
`;

const Muted = styled.p`
  color: ${theme.colors.textTertiary};
`;

const ErrorText = styled.p`
  color: ${theme.colors.error};
  margin-bottom: 1rem;
`;
