'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Spinner from '@/components/ui/Spinner';
import { theme } from '@/styles/theme';

interface BoardPost {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
}

export default function BoardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/board');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('게시글 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Container>
      <PageHeader>
        <HeaderContent>
          <Overline>COMMUNITY</Overline>
          <Title>게시판</Title>
        </HeaderContent>
        <WriteButton onClick={() => router.push('/board/write')}>
          글쓰기
        </WriteButton>
      </PageHeader>

      {posts.length === 0 ? (
        <EmptyState>아직 작성된 게시글이 없습니다</EmptyState>
      ) : (
        <PostList>
          {posts.map((post) => (
            <PostCard key={post._id} onClick={() => router.push(`/board/${post._id}`)}>
              <PostTitle>{post.title}</PostTitle>
              <PostMeta>
                <span>{post.author}</span>
                <Separator>/</Separator>
                <span>조회 {post.views}</span>
                <Separator>/</Separator>
                <span>좋아요 {post.likes}</span>
              </PostMeta>
            </PostCard>
          ))}
        </PostList>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: ${theme.colors.background};
  min-height: 60vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Overline = styled.span`
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  color: ${theme.colors.accent};
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  line-height: ${theme.typography.h1.lineHeight};
  letter-spacing: ${theme.typography.h1.letterSpacing};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const WriteButton = styled.button`
  padding: 0.625rem 1.75rem;
  background: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.accent};
    border-color: ${theme.colors.accent};
    color: ${theme.colors.textLight};
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostCard = styled.div`
  padding: 1.25rem 1rem;
  border-bottom: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  border-left: 3px solid transparent;

  &:hover {
    border-left-color: ${theme.colors.accent};
    transform: translateX(4px);
    background: ${theme.colors.surfaceAlt};
  }
`;

const PostTitle = styled.h3`
  font-family: ${theme.typography.fontBody};
  font-size: 1.05rem;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textTertiary};
`;

const Separator = styled.span`
  color: ${theme.colors.borderLight};
  font-size: 0.75rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  color: ${theme.colors.textTertiary};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
`;
