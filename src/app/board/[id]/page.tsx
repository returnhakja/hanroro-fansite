'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Spinner from '@/components/ui/Spinner';
import CommentSection from '@/components/features/board/CommentSection';

interface BoardPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  imageUrls?: string[];
}

export default function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState<string>('');
  const hasFetched = useRef(false);

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

  const handleLike = async () => {
    if (!postId) return;

    try {
      const response = await fetch(`/api/board/${postId}/like`, {
        method: 'POST',
      });
      const data = await response.json();
      if (post) {
        setPost({ ...post, likes: data.likes });
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
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('삭제에 실패했습니다');
    }
  };

  if (loading) return <Spinner />;
  if (!post) return <div>게시글을 찾을 수 없습니다</div>;

  return (
    <Container>
      <Header>
        <Title>{post.title}</Title>
        <Meta>
          <span>작성자: {post.author}</span>
          <span>조회수: {post.views}</span>
          <span>좋아요: {post.likes}</span>
        </Meta>
      </Header>

      <Content>{post.content}</Content>

      {post.imageUrls && post.imageUrls.length > 0 && (
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
        <LikeButton onClick={handleLike}>
          ❤️ 좋아요 ({post.likes})
        </LikeButton>
        <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
        <BackButton onClick={() => router.push('/board')}>목록</BackButton>
      </Actions>

      {postId && <CommentSection boardId={postId} />}
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  border-bottom: 2px solid #6a4c93;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Meta = styled.div`
  display: flex;
  gap: 1.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const Content = styled.div`
  line-height: 1.8;
  color: #333;
  font-size: 1.1rem;
  white-space: pre-wrap;
  margin-bottom: 3rem;
  min-height: 200px;
`;

const ImagesSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem 0;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const ImageWrapper = styled.div`
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
`;

const LikeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #ff4081;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #cc0000;
  }
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ddd;
  color: #333;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background: #ccc;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
