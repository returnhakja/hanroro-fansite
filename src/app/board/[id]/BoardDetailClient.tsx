"use client";

import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import Spinner from "@/components/ui/Spinner";
import CommentSection from "@/components/features/board/CommentSection";
import {
  useBoardDetail,
  useLikePost,
  useUpdatePost,
  useDeletePost,
} from "@/hooks/queries/useBoard";
import { theme } from "@/styles/theme";

const RichTextEditor = dynamic(
  () => import("@/components/features/board/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: "300px",
          border: "1px solid #eee",
          borderRadius: "4px",
        }}
      />
    ),
  },
);

function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

const PostImageItem = memo(({ url, index }: { url: string; index: number }) => (
  <ImageWrapper>
    <PostImage src={url} alt={`첨부 이미지 ${index + 1}`} />
  </ImageWrapper>
));

PostImageItem.displayName = "PostImageItem";

export default function BoardDetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [postId, setPostId] = useState<string>("");

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    params.then(({ id }) => setPostId(id));
  }, [params]);

  const { data: post, isLoading } = useBoardDetail(postId);
  const likeMutation = useLikePost(postId);
  const updateMutation = useUpdatePost(postId);
  const deleteMutation = useDeletePost(postId);

  const isAuthor =
    post?.userId && session?.user?.id && post.userId === session.user.id;
  const isLiked = post?.likedBy?.includes(session?.user?.id || "");

  const handleLike = async () => {
    if (!session?.user?.id) {
      alert("로그인이 필요합니다");
      return;
    }
    try {
      await likeMutation.mutateAsync();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "좋아요에 실패했습니다");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteMutation.mutateAsync();
      alert("삭제되었습니다");
      router.push("/board");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "삭제에 실패했습니다");
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 입력해주세요");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        title: editTitle,
        content: editContent,
      });
      setEditing(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "수정에 실패했습니다");
    }
  };

  const startEdit = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  if (isLoading) return <Spinner />;
  if (!post) return <div>게시글을 찾을 수 없습니다</div>;

  return (
    <Container>
      <Header>
        {editing ? (
          <EditTitleInput
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        ) : (
          <Title>{post.title}</Title>
        )}
        <Meta>
          <span>{post.author}</span>
          <Separator>/</Separator>
          <span>조회 {post.views}</span>
          <Separator>/</Separator>
          <span>좋아요 {post.likes}</span>
        </Meta>
      </Header>

      {editing ? (
        <RichTextEditor
          value={editContent}
          onChange={setEditContent}
          minHeight="300px"
        />
      ) : (
        <Content
          dangerouslySetInnerHTML={{
            __html: isHtmlContent(post.content)
              ? post.content
              : post.content.replace(/\n/g, "<br>"),
          }}
        />
      )}

      {/* 구형 게시글의 별도 첨부 이미지 하위 호환 */}
      {!editing && post.imageUrls && post.imageUrls.length > 0 && (
        <ImagesSection>
          <ImagesGrid>
            {post.imageUrls.map((url, index) => (
              <PostImageItem key={index} url={url} index={index} />
            ))}
          </ImagesGrid>
        </ImagesSection>
      )}

      <Actions>
        {editing ? (
          <>
            <SaveButton
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </SaveButton>
            <CancelButton
              onClick={cancelEdit}
              disabled={updateMutation.isPending}
            >
              취소
            </CancelButton>
          </>
        ) : (
          <>
            <LikeButton onClick={handleLike} $liked={!!isLiked}>
              {isLiked ? "좋아요 취소" : "좋아요"} ({post.likes})
            </LikeButton>
            {isAuthor && (
              <>
                <EditButton onClick={startEdit}>수정</EditButton>
                <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
              </>
            )}
            <BackButton onClick={() => router.push("/board")}>목록</BackButton>
          </>
        )}
      </Actions>

      {postId && <CommentSection boardId={postId} />}
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

const Header = styled.div`
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 1.25rem;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 2.25rem;
  font-weight: ${theme.typography.h2.fontWeight};
  line-height: ${theme.typography.h2.lineHeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 1rem 0;
`;

const EditTitleInput = styled.input`
  width: 100%;
  font-family: ${theme.typography.fontHeading};
  font-size: 2.25rem;
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: 0.5rem;
  margin: 0 0 1rem 0;
  background: ${theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: ${theme.colors.textTertiary};
  font-size: ${theme.typography.small.fontSize};
`;

const Separator = styled.span`
  color: ${theme.colors.borderLight};
  font-size: 0.75rem;
`;

const Content = styled.div`
  line-height: ${theme.typography.bodyLarge.lineHeight};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.bodyLarge.fontSize};
  font-family: ${theme.typography.fontBody};
  margin-bottom: 3rem;
  min-height: 200px;

  p {
    margin: 0.5rem 0;
  }
  h2 {
    font-family: ${theme.typography.fontHeading};
    font-size: 1.5rem;
    font-weight: 500;
    margin: 1.5rem 0 0.5rem;
    line-height: 1.3;
  }
  h3 {
    font-family: ${theme.typography.fontHeading};
    font-size: 1.2rem;
    font-weight: 500;
    margin: 1.25rem 0 0.5rem;
    line-height: 1.3;
  }
  strong {
    font-weight: 600;
  }
  em {
    font-style: italic;
  }
  s {
    text-decoration: line-through;
    color: ${theme.colors.textTertiary};
  }
  blockquote {
    border-left: 3px solid ${theme.colors.accent};
    padding-left: 1rem;
    margin: 1rem 0;
    color: ${theme.colors.textSecondary};
    font-style: italic;
  }
  ul {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
    li {
      margin: 0.25rem 0;
    }
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: ${theme.borderRadius.sm};
    margin: 0.5rem 0;
    display: block;
  }
`;

const ImagesSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem 0;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const ImageWrapper = styled.div`
  aspect-ratio: 1;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: transform ${theme.transitions.normal};

  &:hover {
    transform: scale(1.05);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.625rem;
  }
`;

const LikeButton = styled.button<{ $liked: boolean }>`
  padding: 0.625rem 1.5rem;
  background: ${(props) =>
    props.$liked ? theme.colors.accentDark : theme.colors.accent};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${(props) =>
      props.$liked ? theme.colors.accent : theme.colors.accentDark};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const EditButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.primary};
    color: ${theme.colors.textLight};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const DeleteButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: transparent;
  color: ${theme.colors.error};
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.error};
    color: ${theme.colors.textLight};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const SaveButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: ${theme.colors.accent};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${theme.colors.accentDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: transparent;
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${theme.colors.surfaceAlt};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const BackButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  margin-left: auto;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.surfaceAlt};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    margin-left: 0;
  }
`;
