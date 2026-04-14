"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import {
  INQUIRY_CATEGORY_KEYS,
  INQUIRY_CATEGORY_LABELS,
  type InquiryCategory,
} from "@/lib/constants/inquiry";
import { formatDateShort } from "@/lib/utils/time";
import type { InquirySummary } from "@/types/api/inquiry";

export default function ContactPageClient() {
  const { data: session, status } = useSession();
  const [category, setCategory] = useState<InquiryCategory>("other");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [list, setList] = useState<InquirySummary[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setAuthor(session.user.nickname || session.user.name || "");
    }
  }, [session]);

  const loadList = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await fetch("/api/inquiries", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "목록을 불러올 수 없습니다");
      setList(data.inquiries || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "목록 오류");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    loadList();
  }, [status, loadList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setError(null);
    if (honeypot) return;
    if (!title.trim() || !content.trim() || !author.trim()) {
      setError("유형·제목·내용·작성자를 모두 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          category,
          title: title.trim(),
          content: content.trim(),
          author: author.trim(),
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "전송에 실패했습니다");
      setTitle("");
      setContent("");
      await loadList();
      alert("문의가 접수되었습니다. 운영자만 내용을 확인할 수 있는 비밀글로 저장됩니다.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "전송 오류");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <Container>
        <PageTitle>문의하기</PageTitle>
        <Muted>불러오는 중…</Muted>
      </Container>
    );
  }

  if (!session?.user) {
    return (
      <Container>
        <PageTitle>문의하기</PageTitle>
        <Lead>
          비밀 문의는 <Strong>로그인한 회원</Strong>만 작성할 수 있습니다. 제출된
          내용은 게시판에 노출되지 않으며, 작성자 본인과 사이트 운영자만 열람할 수
          있습니다.
        </Lead>
        <LoginCard>
          <p>Google 계정으로 로그인한 뒤 문의를 남겨 주세요.</p>
          <LoginButton type="button" onClick={() => signIn("google")}>
            Google 로그인
          </LoginButton>
        </LoginCard>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>문의하기</PageTitle>
      <Lead>
        아래 내용은 <Strong>비밀글</Strong>로 저장되며 일반 게시판에는 표시되지
        않습니다. 작성자 본인과 운영자만 글을 읽을 수 있습니다.
      </Lead>

      <Notice>
        답변은 별도 알림이 없을 수 있으니, 필요 시 본 페이지의「내 문의」에서
        확인해 주세요. 운영자가 확인하면「확인됨」으로 표시됩니다.
      </Notice>

      <Form onSubmit={handleSubmit}>
        <Honeypot
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
        <FormGroup>
          <Label htmlFor="inquiry-category">문의 유형</Label>
          <Select
            id="inquiry-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as InquiryCategory)}
          >
            {INQUIRY_CATEGORY_KEYS.map((key) => (
              <option key={key} value={key}>
                {INQUIRY_CATEGORY_LABELS[key]}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="inquiry-author">작성자 표시명</Label>
          <Input
            id="inquiry-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="닉네임 또는 이름"
            maxLength={80}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="inquiry-title">제목</Label>
          <Input
            id="inquiry-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="한 줄로 요약해 주세요"
            maxLength={200}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="inquiry-content">내용</Label>
          <Textarea
            id="inquiry-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문의 내용을 자세히 적어 주세요 (최대 5,000자)"
            maxLength={5000}
            rows={10}
          />
          <CharCount>{content.length} / 5000</CharCount>
        </FormGroup>
        {error && <ErrorText role="alert">{error}</ErrorText>}
        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? "전송 중…" : "비밀 문의 보내기"}
        </SubmitButton>
      </Form>

      <SectionTitle id="my-inquiries">내 문의</SectionTitle>
      {loadingList ? (
        <Muted>목록을 불러오는 중…</Muted>
      ) : list.length === 0 ? (
        <Muted>아직 남긴 문의가 없습니다.</Muted>
      ) : (
        <InquiryList aria-labelledby="my-inquiries">
          {list.map((item) => (
            <InquiryRow key={item._id}>
              <RowLink href={`/contact/${item._id}`}>
                <RowTitle>{item.title}</RowTitle>
                <RowMeta>
                  <span>{INQUIRY_CATEGORY_LABELS[item.category]}</span>
                  <span>{formatDateShort(item.createdAt)}</span>
                  {item.replyCount > 0 ? (
                    <Badge $variant="reply">답변 {item.replyCount}</Badge>
                  ) : item.readByAdmin ? (
                    <Badge $variant="done">확인됨</Badge>
                  ) : (
                    <Badge $variant="pending">접수</Badge>
                  )}
                </RowMeta>
              </RowLink>
            </InquiryRow>
          ))}
        </InquiryList>
      )}
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

const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  line-height: ${theme.typography.h2.lineHeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 1.25rem 0;
`;

const Lead = styled.p`
  font-size: 1rem;
  line-height: 1.65;
  color: ${theme.colors.textSecondary};
  margin: 0 0 1rem 0;
`;

const Strong = styled.strong`
  color: ${theme.colors.textPrimary};
  font-weight: 600;
`;

const Notice = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${theme.colors.textTertiary};
  margin: 0 0 2rem 0;
  padding: 1rem 1.25rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 3rem;
`;

const Honeypot = styled.input`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  letter-spacing: 0.02em;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  transition: border-color ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  line-height: 1.6;
  resize: vertical;
  min-height: 200px;
  transition: border-color ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const CharCount = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textTertiary};
  text-align: right;
`;

const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: 0.9rem;
  margin: 0;
`;

const SubmitButton = styled.button`
  padding: 0.875rem 1.25rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background ${theme.transitions.normal};
  margin-top: 0.25rem;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.35rem;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const Muted = styled.p`
  color: ${theme.colors.textTertiary};
  font-size: 0.95rem;
`;

const InquiryList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InquiryRow = styled.li`
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.surface};
  overflow: hidden;
`;

const RowLink = styled(Link)`
  display: block;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: background ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.surfaceAlt};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  }
`;

const RowTitle = styled.span`
  display: block;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.35rem;
`;

const RowMeta = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  align-items: center;
`;

const Badge = styled.span<{ $variant: "pending" | "done" | "reply" }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: ${(p) =>
    p.$variant === "done"
      ? theme.colors.success + "33"
      : p.$variant === "reply"
        ? theme.colors.accent + "44"
        : theme.colors.info + "33"};
  color: ${(p) =>
    p.$variant === "done"
      ? theme.colors.success
      : p.$variant === "reply"
        ? theme.colors.primaryDark
        : theme.colors.info};
`;

const LoginCard = styled.div`
  padding: 2rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  color: ${theme.colors.textSecondary};

  p {
    margin: 0 0 1.25rem 0;
  }
`;

const LoginButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.primaryDark};
  }
`;
