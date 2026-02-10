'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Spinner from '@/components/ui/Spinner';
import { theme } from '@/styles/theme';

export default function BoardWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  // 이미지 첨부 관련 상태
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setImageFiles((prev) => [...prev, ...fileArray]);

    // 미리보기 생성
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !author) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      // 1. 이미지 업로드 (있는 경우)
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', `${title}_image`);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          imageUrls.push(data.imageUrl);
        }
      }

      // 2. 게시글 작성
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author, imageUrls }),
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
      <PageTitle>새 글 작성</PageTitle>

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

        <FormGroup>
          <Label>이미지 첨부 (선택사항)</Label>
          <FileInput
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {imagePreviews.length > 0 && (
            <ImagePreviewContainer>
              {imagePreviews.map((preview, index) => (
                <ImagePreviewWrapper key={index}>
                  <PreviewImage src={preview} alt={`미리보기 ${index + 1}`} />
                  <RemoveButton
                    type="button"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </RemoveButton>
                </ImagePreviewWrapper>
              ))}
            </ImagePreviewContainer>
          )}
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '작성 중...' : '작성하기'}
          </SubmitButton>
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
  padding: 3rem 2rem;
  background: ${theme.colors.background};
  min-height: 60vh;
`;

const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  line-height: ${theme.typography.h2.lineHeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 2.5rem 0;
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
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  letter-spacing: 0.02em;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  transition: border-color ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  resize: vertical;
  transition: border-color ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const FileInput = styled.input`
  padding: 0.5rem;
  border: 2px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.95rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textSecondary};
  cursor: pointer;

  &::-webkit-file-upload-button {
    padding: 0.5rem 1rem;
    background: ${theme.colors.primary};
    color: ${theme.colors.textLight};
    border: none;
    border-radius: ${theme.borderRadius.sm};
    cursor: pointer;
    margin-right: 0.5rem;
    font-size: 0.875rem;
    transition: background ${theme.transitions.fast};

    &:hover {
      background: ${theme.colors.primaryDark};
    }
  }
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreviewWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(44, 36, 24, 0.6);
  color: ${theme.colors.textLight};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  transition: background ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.error};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    background: ${theme.colors.surfaceWarm};
    color: ${theme.colors.textTertiary};
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: ${theme.colors.surfaceAlt};
  color: ${theme.colors.textSecondary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.surfaceWarm};
  }
`;
