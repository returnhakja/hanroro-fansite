"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import Spinner from "@/components/ui/Spinner";

const RichTextEditor = dynamic(
  () => import("@/components/features/board/RichTextEditor"),
  { ssr: false, loading: () => <div style={{ minHeight: "400px", border: "1px solid #eee", borderRadius: "4px" }} /> }
);
import { theme } from "@/styles/theme";

export default function BoardWritePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      alert("로그인이 필요합니다");
      router.push("/board");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user) {
      setAuthor(session.user.nickname || session.user.name || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !author) {
      alert("모든 필드를 입력해주세요");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author, imageUrls: [] }),
      });

      if (response.ok) {
        alert("작성 완료!");
        router.push("/board");
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("작성 오류:", error);
      alert("작성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && <Spinner />}
      <PageTitle>새 글 작성</PageTitle>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>제목</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>작성자</Label>
          <Input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="작성자명을 입력하세요"
            readOnly={!!(session?.user?.nickname || session?.user?.name)}
            style={
              session?.user?.nickname || session?.user?.name
                ? { backgroundColor: theme.colors.surfaceAlt }
                : undefined
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>내용</Label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="내용을 입력하세요."
            minHeight="400px"
          />
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "작성 중..." : "작성하기"}
          </SubmitButton>
          <CancelButton type="button" onClick={() => router.push("/board")}>
            취소
          </CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: ${theme.colors.background};
  min-height: 60vh;
`;

const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  line-height: ${theme.typography.h2.lineHeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 2.5rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    background: ${theme.colors.surfaceWarm};
    color: ${theme.colors.textTertiary};
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: ${theme.colors.surfaceAlt};
  color: ${theme.colors.textSecondary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.surfaceWarm};
  }
`;
