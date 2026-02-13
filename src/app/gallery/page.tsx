'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { CloseButton } from '@/components/ui/CloseButton';
import Spinner from '@/components/ui/Spinner';
import { theme } from '@/styles/theme';

interface ImageType {
  _id: string;
  title: string;
  imageUrl: string;
  userId?: string | null;
  createdAt: string;
}

export default function GalleryPage() {
  const { data: session } = useSession();
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<ImageType | null>(null);

  // 업로드 관련 상태
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
    // Modal 접근성 설정
    Modal.setAppElement('body');
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('이미지 로딩 오류:', error);
      alert('이미지를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/image/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(images.filter((img) => img._id !== id));
        setSelectedImg(null);
        alert('삭제되었습니다');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('삭제에 실패했습니다');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      alert('파일과 제목을 모두 입력해주세요');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', uploadFile);
      formData.append('title', uploadTitle);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('업로드 성공!');
        setUploadModalOpen(false);
        resetUploadForm();
        fetchImages(); // 이미지 목록 새로고침
      } else {
        const error = await response.json();
        alert(error.error || '업로드 실패');
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('업로드에 실패했습니다');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadTitle('');
    setPreview(null);
  };

  if (loading) return <Spinner />;

  return (
    <Container>
      <Header>
        <div>
          <Overline>GALLERY</Overline>
          <Title>갤러리</Title>
          <Subtitle>한로로의 다양한 모습을 감상하세요</Subtitle>
        </div>
        {session && (
          <UploadButton onClick={() => setUploadModalOpen(true)}>
            이미지 업로드
          </UploadButton>
        )}
      </Header>

      {images.length === 0 ? (
        <EmptyState>아직 업로드된 이미지가 없습니다</EmptyState>
      ) : (
        <Grid>
          {images.map((img) => (
            <ImageCard key={img._id} onClick={() => setSelectedImg(img)}>
              <ImageWrapper>
                <StyledImage src={img.imageUrl} alt={img.title} />
              </ImageWrapper>
              <ImageTitle>{img.title}</ImageTitle>
            </ImageCard>
          ))}
        </Grid>
      )}

      {/* 이미지 상세보기 모달 */}
      <Modal
        isOpen={!!selectedImg}
        onRequestClose={() => setSelectedImg(null)}
        style={{
          overlay: {
            backgroundColor: 'rgba(44, 36, 24, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1000,
          },
          content: {
            background: 'transparent',
            border: 'none',
            padding: 0,
            inset: '50px',
          },
        }}
      >
        {selectedImg && (
          <ModalContent>
            <CloseButton onClick={() => setSelectedImg(null)} />
            <ModalImage src={selectedImg.imageUrl} alt={selectedImg.title} />
            <ModalTitle>{selectedImg.title}</ModalTitle>
            {session && selectedImg.userId === session.user?.id && (
              <DeleteButton onClick={() => handleDelete(selectedImg._id)}>
                삭제
              </DeleteButton>
            )}
          </ModalContent>
        )}
      </Modal>

      {/* 업로드 모달 */}
      <Modal
        isOpen={uploadModalOpen}
        onRequestClose={() => {
          setUploadModalOpen(false);
          resetUploadForm();
        }}
        style={{
          overlay: {
            backgroundColor: 'rgba(44, 36, 24, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1000,
          },
          content: {
            background: theme.colors.surfaceAlt,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
            padding: '2rem',
            maxWidth: '500px',
            margin: '50px auto',
            maxHeight: '80vh',
            overflow: 'auto',
          },
        }}
      >
        <UploadModalContent>
          <CloseButton
            onClick={() => {
              setUploadModalOpen(false);
              resetUploadForm();
            }}
          />
          <UploadModalTitle>이미지 업로드</UploadModalTitle>

          <UploadForm>
            <Label>제목</Label>
            <Input
              type="text"
              placeholder="이미지 제목을 입력하세요"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              disabled={uploading}
            />

            <Label>이미지 파일</Label>
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {preview && (
              <PreviewContainer>
                <PreviewImage src={preview} alt="미리보기" />
              </PreviewContainer>
            )}

            <UploadSubmitButton
              onClick={handleUpload}
              disabled={!uploadFile || !uploadTitle.trim() || uploading}
            >
              {uploading ? '업로드 중...' : '업로드'}
            </UploadSubmitButton>
          </UploadForm>
        </UploadModalContent>
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  gap: 1rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Overline = styled.span`
  display: block;
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accent};
  margin-bottom: 0.5rem;
  font-family: ${theme.typography.fontBody};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.textSecondary};
  font-family: ${theme.typography.fontBody};
  margin-bottom: 0;
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: ${theme.colors.primary};
  border: 1.5px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  font-family: ${theme.typography.fontBody};
  white-space: nowrap;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.accent};
    border-color: ${theme.colors.accent};
    color: ${theme.colors.textLight};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ImageCard = styled.div`
  cursor: pointer;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.normal};
  background: ${theme.colors.surface};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

const ImageWrapper = styled.div`
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  transition: transform ${theme.transitions.normal};

  ${ImageCard}:hover & {
    transform: scale(1.03);
  }
`;

const ImageTitle = styled.div`
  padding: 0.75rem 1rem;
  background: ${theme.colors.surfaceAlt};
  font-size: 0.9rem;
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontBody};
  border-top: 1px solid ${theme.colors.borderLight};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.textTertiary};
  font-size: 1.1rem;
  font-family: ${theme.typography.fontBody};
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: ${theme.borderRadius.md};
`;

const ModalTitle = styled.h3`
  color: ${theme.colors.textLight};
  margin-top: 1rem;
  font-size: 1.2rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
`;

const DeleteButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: ${theme.colors.error};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: #A94A4A;
    box-shadow: ${theme.shadows.sm};
  }
`;

const UploadModalContent = styled.div`
  position: relative;
`;

const UploadModalTitle = styled.h2`
  font-size: 1.8rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
  color: ${theme.colors.textPrimary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const UploadForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontBody};
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  transition: border-color ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.15);
  }

  &:disabled {
    background: ${theme.colors.surfaceWarm};
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  padding: 0.75rem;
  border: 2px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 0.95rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textSecondary};
  background: ${theme.colors.surface};
  cursor: pointer;
  transition: border-color ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.accent};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.sm};
`;

const UploadSubmitButton = styled.button`
  padding: 1rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: ${theme.typography.fontBody};
  transition: all ${theme.transitions.normal};
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: ${theme.colors.accent};
  }

  &:disabled {
    background: ${theme.colors.borderLight};
    color: ${theme.colors.textTertiary};
    cursor: not-allowed;
  }
`;
