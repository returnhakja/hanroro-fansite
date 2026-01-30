'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Spinner from '@/components/ui/Spinner';

export default function BoardWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !author) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author }),
      });

      if (response.ok) {
        alert('작성 완료!');
        router.push('/board');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('작성 오류:', error);
      alert('작성에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && <Spinner />}
      <Title>새 글 작성</Title>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>제목</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>작성자</Label>
          <Input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="작성자명을 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>내용</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
          />
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit">작성하기</SubmitButton>
          <CancelButton type="button" onClick={() => router.push('/board')}>
            취소
          </CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #6a4c93;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6a4c93;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #6a4c93;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.875rem;
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

const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: #ddd;
  color: #333;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #ccc;
  }
`;
