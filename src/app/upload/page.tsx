'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Spinner from '@/components/ui/Spinner';

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file) {
      alert('제목과 이미지를 모두 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('업로드 성공!');
        router.push('/gallery');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('업로드에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && <Spinner />}
      <Title>Upload Image</Title>
      <Subtitle>새로운 이미지를 업로드하세요</Subtitle>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">제목</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="이미지 제목을 입력하세요"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="image">이미지</Label>
          <FileInput
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </FormGroup>

        {preview && (
          <PreviewSection>
            <PreviewLabel>미리보기:</PreviewLabel>
            <PreviewImage src={preview} alt="Preview" />
          </PreviewSection>
        )}

        <ButtonGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '업로드 중...' : '업로드'}
          </SubmitButton>
          <CancelButton type="button" onClick={() => router.push('/gallery')}>
            취소
          </CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #6a4c93;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
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

const FileInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6a4c93;
  }
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8f5f2;
  border-radius: 8px;
`;

const PreviewLabel = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: #6a4c93;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #5a3c83;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #ccc;
  }
`;
