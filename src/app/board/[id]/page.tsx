'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Spinner from '@/components/ui/Spinner';

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

export default function BoardDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/board/${params.id}`);
      const data = await response.json();
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
    try {
      const response = await fetch(`/api/board/${params.id}/like`, {
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
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/board/${params.id}`, {
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

      <Actions>
        <LikeButton onClick={handleLike}>
          ❤️ 좋아요 ({post.likes})
        </LikeButton>
        <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
        <BackButton onClick={() => router.push('/board')}>목록</BackButton>
      </Actions>
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
