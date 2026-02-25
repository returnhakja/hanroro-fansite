'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useComments } from '@/hooks/queries/useBoard';

interface CommentSectionProps {
  boardId: string;
}

export default function CommentSection({ boardId }: CommentSectionProps) {
  const { data: comments = [], isLoading, isError } = useComments(boardId);

  return (
    <Container>
      <Header>
        <Title>댓글 {comments.length}</Title>
      </Header>

      <CommentForm
        boardId={boardId}
        onSubmitSuccess={() => {}}
        placeholder="댓글을 입력하세요..."
        buttonText="댓글 작성"
      />

      {isLoading ? (
        <LoadingText>댓글을 불러오는 중...</LoadingText>
      ) : isError ? (
        <ErrorText>댓글을 불러올 수 없습니다</ErrorText>
      ) : comments.length === 0 ? (
        <EmptyText>첫 댓글을 작성해보세요!</EmptyText>
      ) : (
        <CommentList comments={comments} onRefresh={() => {}} />
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
