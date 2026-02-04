'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { formatRelativeTime } from '@/lib/utils/time';
import CommentForm from './CommentForm';

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

interface CommentItemProps {
  comment: Comment;
  replies?: Comment[];
  onReplySubmit: () => void;
  onDelete: (id: string) => void;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  replies = [],
  onReplySubmit,
  onDelete,
  isReply = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/board/comments/${comment._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '댓글 삭제에 실패했습니다');
      }

      onDelete(comment._id);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert(error instanceof Error ? error.message : '댓글 삭제에 실패했습니다');
    } finally {
      setDeleting(false);
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReplySubmit();
  };

  return (
    <>
      <CommentContainer $isReply={isReply} $isDeleted={comment.deleted}>
        <CommentHeader>
          {comment.deleted ? (
            <DeletedInfo>삭제된 댓글</DeletedInfo>
          ) : (
            <>
              <AuthorName>{comment.author}</AuthorName>
              <Separator>•</Separator>
              <TimeStamp>{formatRelativeTime(comment.createdAt)}</TimeStamp>
            </>
          )}
        </CommentHeader>

        <CommentContent $isDeleted={comment.deleted}>
          {comment.content}
        </CommentContent>

        {!comment.deleted && (
          <CommentActions>
            {!isReply && (
              <ActionButton
                onClick={() => setShowReplyForm(!showReplyForm)}
                $active={showReplyForm}
              >
                답글
              </ActionButton>
            )}
            <ActionButton onClick={handleDelete} disabled={deleting} $delete>
              {deleting ? '삭제 중...' : '삭제'}
            </ActionButton>
          </CommentActions>
        )}

        {showReplyForm && (
          <ReplyFormContainer>
            <CommentForm
              boardId={comment.boardId}
              parentId={comment._id}
              onSubmitSuccess={handleReplySuccess}
              placeholder="답글을 입력하세요..."
              buttonText="답글 작성"
              onCancel={() => setShowReplyForm(false)}
            />
          </ReplyFormContainer>
        )}
      </CommentContainer>

      {replies.length > 0 && (
        <RepliesContainer>
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReplySubmit={onReplySubmit}
              onDelete={onDelete}
              isReply
            />
          ))}
        </RepliesContainer>
      )}
    </>
  );
}

const CommentContainer = styled.div<{ $isReply: boolean; $isDeleted: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: ${(props) => {
    if (props.$isDeleted) return '#f9f9f9';
    return props.$isReply ? '#fafafa' : 'white';
  }};
  margin-left: ${(props) => (props.$isReply ? '3rem' : '0')};

  @media (max-width: 768px) {
    margin-left: ${(props) => (props.$isReply ? '1.5rem' : '0')};
    padding: 0.75rem;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #333;
`;

const Separator = styled.span`
  color: #ccc;
`;

const TimeStamp = styled.span`
  color: #999;
`;

const DeletedInfo = styled.span`
  color: #999;
  font-style: italic;
`;

const CommentContent = styled.p<{ $isDeleted: boolean }>`
  margin: 0 0 0.75rem 0;
  line-height: 1.6;
  color: ${(props) => (props.$isDeleted ? '#999' : '#333')};
  white-space: pre-wrap;
  word-break: break-word;
  ${(props) => props.$isDeleted && 'font-style: italic;'}
`;

const CommentActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button<{ $active?: boolean; $delete?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => {
    if (props.$delete) return '#ff4444';
    if (props.$active) return '#6a4c93';
    return '#666';
  }};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover:not(:disabled) {
    color: ${(props) => (props.$delete ? '#cc0000' : '#6a4c93')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReplyFormContainer = styled.div`
  margin-top: 1rem;
`;

const RepliesContainer = styled.div`
  /* Replies are rendered with margin-left in CommentContainer */
`;
