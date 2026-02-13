'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { formatRelativeTime } from '@/lib/utils/time';
import CommentForm from './CommentForm';

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
  const { data: session } = useSession();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [timeText, setTimeText] = useState('');

  // 수정 모드 상태
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const isAuthor = comment.userId && session?.user?.id && comment.userId === session.user.id;

  useEffect(() => {
    setTimeText(formatRelativeTime(comment.createdAt));
  }, [comment.createdAt]);

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

  const startEdit = () => {
    setEditContent(comment.content);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditContent('');
  };

  const handleSave = async () => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/board/comments/${comment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '댓글 수정에 실패했습니다');
      }

      setEditing(false);
      onReplySubmit(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 수정 오류:', error);
      alert(error instanceof Error ? error.message : '댓글 수정에 실패했습니다');
    } finally {
      setSaving(false);
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
              <Separator>&middot;</Separator>
              <TimeStamp>{timeText}</TimeStamp>
            </>
          )}
        </CommentHeader>

        {editing ? (
          <EditArea>
            <EditTextarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="댓글 내용을 입력하세요"
              maxLength={500}
            />
            <EditActions>
              <SaveButton onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </SaveButton>
              <CancelButton onClick={cancelEdit} disabled={saving}>
                취소
              </CancelButton>
            </EditActions>
          </EditArea>
        ) : (
          <CommentContent $isDeleted={comment.deleted}>
            {comment.content}
          </CommentContent>
        )}

        {!comment.deleted && !editing && (
          <CommentActions>
            {!isReply && (
              <ActionButton
                onClick={() => setShowReplyForm(!showReplyForm)}
                $active={showReplyForm}
              >
                답글
              </ActionButton>
            )}
            {isAuthor && (
              <>
                <ActionButton onClick={startEdit}>수정</ActionButton>
                <ActionButton onClick={handleDelete} disabled={deleting} $delete>
                  {deleting ? '삭제 중...' : '삭제'}
                </ActionButton>
              </>
            )}
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
  border-bottom: 1px solid ${theme.colors.borderLight};
  background: ${(props) => {
    if (props.$isDeleted) return theme.colors.surfaceAlt;
    return props.$isReply ? theme.colors.background : theme.colors.surface;
  }};
  margin-left: ${(props) => (props.$isReply ? '3rem' : '0')};

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-left: ${(props) => (props.$isReply ? '1.5rem' : '0')};
    padding: 0.75rem;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: ${theme.typography.small.fontSize};
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const Separator = styled.span`
  color: ${theme.colors.border};
`;

const TimeStamp = styled.span`
  color: ${theme.colors.textTertiary};
`;

const DeletedInfo = styled.span`
  color: ${theme.colors.textTertiary};
  font-style: italic;
`;

const CommentContent = styled.p<{ $isDeleted: boolean }>`
  margin: 0 0 0.75rem 0;
  line-height: 1.6;
  color: ${(props) => (props.$isDeleted ? theme.colors.textTertiary : theme.colors.textPrimary)};
  white-space: pre-wrap;
  word-break: break-word;
  ${(props) => props.$isDeleted && 'font-style: italic;'}
`;

const EditArea = styled.div`
  margin-bottom: 0.75rem;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  resize: vertical;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SaveButton = styled.button`
  padding: 0.375rem 1rem;
  background: ${theme.colors.accent};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${theme.colors.accentDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 0.375rem 1rem;
  background: transparent;
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${theme.colors.surfaceAlt};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CommentActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button<{ $active?: boolean; $delete?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => {
    if (props.$delete) return theme.colors.error;
    if (props.$active) return theme.colors.accent;
    return theme.colors.textSecondary;
  }};
  font-size: ${theme.typography.small.fontSize};
  cursor: pointer;
  padding: 0;
  transition: color ${theme.transitions.fast};

  &:hover:not(:disabled) {
    color: ${(props) => (props.$delete ? '#a04040' : theme.colors.accent)};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReplyFormContainer = styled.div`
  margin-top: 1rem;
`;

const RepliesContainer = styled.div``;
