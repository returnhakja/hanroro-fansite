'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

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
  const [submitting, setSubmitting] = useState(false);

  const isReply = !!parentId;

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

    if (!author.trim() && !isReply) {
      alert('작성자명을 입력해주세요');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/board/${boardId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          author: author.trim() || '익명',
          parentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '댓글 작성에 실패했습니다');
      }

      setContent('');
      if (!isReply) {
        setAuthor('');
      }
      onSubmitSuccess();
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      alert(error instanceof Error ? error.message : '댓글 작성에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return (
      <FormContainer $isReply={isReply}>
        <LoginPrompt>
          댓글을 작성하려면{' '}
          <LoginLink onClick={() => signIn('google')}>로그인</LoginLink>
          해주세요.
        </LoginPrompt>
      </FormContainer>
    );
  }

  return (
    <FormContainer $isReply={isReply}>
      <Form onSubmit={handleSubmit}>
        {!isReply && (
          <AuthorInput
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="작성자명"
            maxLength={50}
            disabled={submitting}
            readOnly={!!(session.user?.nickname || session.user?.name)}
            style={(session.user?.nickname || session.user?.name) ? { backgroundColor: theme.colors.surfaceAlt } : undefined}
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

const LoginPrompt = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.95rem;
  text-align: center;
  padding: 1rem;
  margin: 0;
`;

const LoginLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.accent};
  cursor: pointer;
  font-size: inherit;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
`;
