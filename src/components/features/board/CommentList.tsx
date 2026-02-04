'use client';

import { useMemo } from 'react';
import styled from 'styled-components';
import CommentItem from './CommentItem';

interface Comment {
  _id: string;
  boardId: string;
  content: string;
  author: string;
  parentId: string | null;
  depth: number;
  createdAt: string;
  deleted: boolean;
}

interface CommentListProps {
  comments: Comment[];
  onRefresh: () => void;
}

export default function CommentList({ comments, onRefresh }: CommentListProps) {
  const groupedComments = useMemo(() => {
    // Separate top-level comments and replies
    const topLevel = comments.filter((c) => !c.parentId);
    const replies = comments.filter((c) => c.parentId);

    // Group replies under their parent comments
    return topLevel.map((comment) => ({
      ...comment,
      replies: replies.filter((r) => r.parentId === comment._id),
    }));
  }, [comments]);

  return (
    <Container>
      {groupedComments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          replies={comment.replies}
          onReplySubmit={onRefresh}
          onDelete={onRefresh}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
`;
