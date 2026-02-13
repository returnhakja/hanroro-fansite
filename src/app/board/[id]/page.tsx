'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import Spinner from '@/components/ui/Spinner';
import CommentSection from '@/components/features/board/CommentSection';
import { theme } from '@/styles/theme';

interface BoardPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  userId?: string;
  createdAt: string;
  views: number;
  likes: number;
  likedBy?: string[];
  imageUrls?: string[];
}

export default function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState<string>('');
  const hasFetched = useRef(false);

  // 수정 모드 상태
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    params.then(({ id }) => {
      setPostId(id);
      fetchPost(id);
    });
  }, []);

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/board/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '게시글을 불러올 수 없습니다');
      }

      setPost(data);
    } catch (error) {
      console.error('게시글 로딩 오류:', error);
      alert('게시글을 불러올 수 없습니다');
      router.push('/board');
    } finally {
      setLoading(false);
    }
  };

  const isAuthor = post?.userId && session?.user?.id && post.userId === session.user.id;
  const isLiked = post?.likedBy?.includes(session?.user?.id || '');

  const handleLike = async () => {
    if (!postId) return;

    if (!session?.user?.id) {
      alert('로그인이 필요합니다');
      return;
    }

    try {
      const response = await fetch(`/api/board/${postId}/like`, {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || '좋아요에 실패했습니다');
        return;
      }

      if (post) {
        setPost({
          ...post,
          likes: data.likes,
          likedBy: data.liked
            ? [...(post.likedBy || []), session.user.id]
            : (post.likedBy || []).filter((id) => id !== session.user.id),
        });
      }
    } catch (error) {
      console.error('좋아요 오류:', error);
    }
  };

  const handleDelete = async () => {
    if (!postId) return;
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/board/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('삭제되었습니다');
        router.push('/board');
      } else {
        const data = await response.json();
        alert(data.error || '삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('삭제에 실패했습니다');
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
    setEditTitle('');
    setEditContent('');
  };

  const handleSave = async () => {
    if (!postId || !editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 입력해주세요');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/board/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || '수정에 실패했습니다');
        return;
      }

      setPost(data);
      setEditing(false);
    } catch (error) {
      console.error('수정 오류:', error);
      alert('수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
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
        <EditContentArea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="내용을 입력하세요"
        />
      ) : (
        <Content>{post.content}</Content>
      )}

      {!editing && post.imageUrls && post.imageUrls.length > 0 && (
        <ImagesSection>
          <ImagesGrid>
            {post.imageUrls.map((url, index) => (
              <ImageWrapper key={index}>
                <PostImage src={url} alt={`첨부 이미지 ${index + 1}`} />
              </ImageWrapper>
            ))}
          </ImagesGrid>
        </ImagesSection>
      )}

      <Actions>
        {editing ? (
          <>
            <SaveButton onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </SaveButton>
            <CancelButton onClick={cancelEdit} disabled={saving}>
              취소
            </CancelButton>
          </>
        ) : (
          <>
            <LikeButton onClick={handleLike} $liked={!!isLiked}>
              {isLiked ? '좋아요 취소' : '좋아요'} ({post.likes})
            </LikeButton>
            {isAuthor && (
              <>
                <EditButton onClick={startEdit}>수정</EditButton>
                <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
              </>
            )}
            <BackButton onClick={() => router.push('/board')}>목록</BackButton>
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
  white-space: pre-wrap;
  margin-bottom: 3rem;
  min-height: 200px;
`;

const EditContentArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  line-height: ${theme.typography.bodyLarge.lineHeight};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.bodyLarge.fontSize};
  font-family: ${theme.typography.fontBody};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: 1rem;
  margin-bottom: 3rem;
  background: ${theme.colors.surface};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
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
`;

const LikeButton = styled.button<{ $liked: boolean }>`
  padding: 0.625rem 1.5rem;
  background: ${(props) => (props.$liked ? theme.colors.accentDark : theme.colors.accent)};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${(props) => (props.$liked ? theme.colors.accent : theme.colors.accentDark)};
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
`;
