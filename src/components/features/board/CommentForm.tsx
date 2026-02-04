'use client';

import { useState } from 'react';
import styled from 'styled-components';

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
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isReply = !!parentId;

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
  background: ${(props) => (props.$isReply ? '#fff' : '#f8f5f2')};
  padding: ${(props) => (props.$isReply ? '1rem' : '1.5rem')};
  border-radius: 8px;
  margin-bottom: ${(props) => (props.$isReply ? '1rem' : '2rem')};
  ${(props) => props.$isReply && 'border: 1px solid #ddd;'}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AuthorInput = styled.input`
  width: 200px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #6a4c93;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #6a4c93;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CharCount = styled.span<{ $isOver: boolean }>`
  font-size: 0.875rem;
  color: ${(props) => (props.$isOver ? '#ff4444' : '#999')};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: #666;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const SubmitButton = styled(Button)`
  background: #6a4c93;
  color: white;

  &:hover:not(:disabled) {
    background: #5a3c83;
  }
`;
