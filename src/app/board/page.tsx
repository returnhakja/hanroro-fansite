'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Spinner from '@/components/ui/Spinner';

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
      <Header>
        <Title>Community Board</Title>
        <WriteButton onClick={() => router.push('/board/write')}>
          글쓰기
        </WriteButton>
      </Header>

      {posts.length === 0 ? (
        <EmptyState>아직 작성된 게시글이 없습니다</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>제목</Th>
              <Th width="120px">작성자</Th>
              <Th width="100px">조회수</Th>
              <Th width="100px">좋아요</Th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <Row key={post._id} onClick={() => router.push(`/board/${post._id}`)}>
                <Td>{post.title}</Td>
                <Td>{post.author}</Td>
                <Td>{post.views}</Td>
                <Td>❤️ {post.likes}</Td>
              </Row>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #6a4c93;
`;

const WriteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #6a4c93;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #5a3c83;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Th = styled.th<{ width?: string }>`
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #6a4c93;
  background: #f8f5f2;
  font-weight: 600;
  ${props => props.width && `width: ${props.width};`}
`;

const Row = styled.tr`
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8f5f2;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
  font-size: 1.1rem;
`;
