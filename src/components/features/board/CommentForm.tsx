'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useCreateComment } from '@/hooks/queries/useBoard';

interface CommentFormProps {
  boardId: string;
  parentId?: string | null;
  onSubmitSuccess: () => void;
  placeholder?: string;
  buttonText?: string;
  onCancel?: () => void;
}

export default function CommentForm({
  boardId,
  parentId = null,
  onSubmitSuccess,
  placeholder = '댓글을 입력하세요...',
  buttonText = '댓글 작성',
  onCancel,
}: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');

  const createComment = useCreateComment(boardId);
  const submitting = createComment.isPending;

  const isReply = !!parentId;
  const isAnonymous = !session?.user;
  const showAuthorFields = !isReply || isAnonymous;

  useEffect(() => {
    if (session?.user) {
      setAuthor(session.user.nickname || session.user.name || '');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요');
      return;
    }

    if (showAuthorFields && !author.trim()) {
      alert('작성자명을 입력해주세요');
      return;
    }

    if (isAnonymous && password.length < 4) {
      alert('비밀번호를 4자 이상 입력해주세요 (댓글 수정·삭제 시 필요합니다)');
      return;
    }

    createComment.mutate(
      {
        content: content.trim(),
        author: author.trim() || '익명',
        parentId,
        password: isAnonymous ? password : undefined,
      },
      {
        onSuccess: () => {
          setContent('');
          setPassword('');
          if (!isReply) setAuthor('');
          onSubmitSuccess();
        },
        onError: (error) => {
          console.error('댓글 작성 오류:', error);
          alert(error instanceof Error ? error.message : '댓글 작성에 실패했습니다');
        },
      }
    );
  };

  return (
    <FormContainer $isReply={isReply}>
      <Form onSubmit={handleSubmit}>
        {showAuthorFields && (
          <AuthorInput
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="작성자명"
            maxLength={50}
            disabled={submitting}
            readOnly={!!(session?.user?.nickname || session?.user?.name)}
            style={(session?.user?.nickname || session?.user?.name) ? { backgroundColor: theme.colors.surfaceAlt } : undefined}
          />
        )}
        {isAnonymous && (
          <AuthorInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (4자 이상, 수정·삭제 시 필요)"
            disabled={submitting}
          />
        )}
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={500}
          disabled={submitting}
          rows={isReply ? 3 : 4}
        />
        <Footer>
          <CharCount $isOver={content.length > 500}>
            {content.length}/500
          </CharCount>
          <ButtonGroup>
            {onCancel && (
              <CancelButton type="button" onClick={onCancel} disabled={submitting}>
                취소
              </CancelButton>
            )}
            <SubmitButton type="submit" disabled={submitting || !content.trim()}>
              {submitting ? '작성 중...' : buttonText}
            </SubmitButton>
          </ButtonGroup>
        </Footer>
      </Form>
    </FormContainer>
  );
}

const FormContainer = styled.div<{ $isReply: boolean }>`
  background: ${(props) => (props.$isReply ? theme.colors.surface : theme.colors.surfaceAlt)};
  padding: ${(props) => (props.$isReply ? '1rem' : '1.5rem')};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${(props) => (props.$isReply ? '1rem' : '2rem')};
  ${(props) => props.$isReply && `border: 1px solid ${theme.colors.border};`}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AuthorInput = styled.input`
  width: 200px;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-family: inherit;
  background: ${theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }

  &:disabled {
    background: ${theme.colors.surfaceAlt};
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
  background: ${theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }

  &:disabled {
    background: ${theme.colors.surfaceAlt};
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CharCount = styled.span<{ $isOver: boolean }>`
  font-size: ${theme.typography.small.fontSize};
  color: ${(props) => (props.$isOver ? theme.colors.error : theme.colors.textTertiary)};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-weight: 500;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: ${theme.colors.surfaceWarm};
  color: ${theme.colors.textSecondary};

  &:hover:not(:disabled) {
    background: ${theme.colors.border};
  }
`;

const SubmitButton = styled(Button)`
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }
`;

