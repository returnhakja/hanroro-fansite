'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface Comment {
  _id: string;
  boardId: string;
  content: string;
  author: string;
  userId?: string;
  parentId: string | null;
  depth: number;
  createdAt: string;
  deleted: boolean;
}

interface CommentSectionProps {
  boardId: string;
}

export default function CommentSection({ boardId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/board/${boardId}/comments`);

      if (!response.ok) {
        throw new Error('댓글을 불러올 수 없습니다');
      }

      const data = await response.json();
      setComments(data.comments);
      setError(null);
    } catch (err) {
      console.error('댓글 로딩 오류:', err);
      setError(err instanceof Error ? err.message : '댓글을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  const handleCommentSubmit = () => {
    fetchComments();
  };

  return (
    <Container>
      <Header>
        <Title>댓글 {comments.length}</Title>
      </Header>

      <CommentForm
        boardId={boardId}
        onSubmitSuccess={handleCommentSubmit}
        placeholder="댓글을 입력하세요..."
        buttonText="댓글 작성"
      />

      {loading ? (
        <LoadingText>댓글을 불러오는 중...</LoadingText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : comments.length === 0 ? (
        <EmptyText>첫 댓글을 작성해보세요!</EmptyText>
      ) : (
        <CommentList comments={comments} onRefresh={fetchComments} />
      )}
    </Container>
  );
}

const Container = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid ${theme.colors.borderLight};
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.5rem;
  color: ${theme.colors.textPrimary};
  font-weight: 400;
  margin: 0;
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${theme.colors.textTertiary};
  padding: 2rem;
  margin: 0;
`;

const ErrorText = styled.p`
  text-align: center;
  color: ${theme.colors.error};
  padding: 2rem;
  margin: 0;
`;

const EmptyText = styled.p`
  text-align: center;
  color: ${theme.colors.textTertiary};
  padding: 2rem;
  font-size: 1rem;
  margin: 0;
`;
