'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { CloseButton } from '@/components/ui/CloseButton';
import Spinner from '@/components/ui/Spinner';

interface ImageType {
  _id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

export default function GalleryPage() {
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
          <Title>Gallery</Title>
          <Subtitle>한로로의 다양한 모습을 감상하세요</Subtitle>
        </div>
        <UploadButton onClick={() => setUploadModalOpen(true)}>
          이미지 업로드
        </UploadButton>
      </Header>

      {images.length === 0 ? (
        <EmptyState>아직 업로드된 이미지가 없습니다</EmptyState>
      ) : (
        <Grid>
          {images.map((img) => (
            <ImageCard key={img._id} onClick={() => setSelectedImg(img)}>
              <Image src={img.imageUrl} alt={img.title} />
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
          overlay: { backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000 },
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
            <DeleteButton onClick={() => handleDelete(selectedImg._id)}>
              삭제
            </DeleteButton>
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
          overlay: { backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000 },
          content: {
            background: '#fff',
            borderRadius: '12px',
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
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #6a4c93;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0;
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #6a4c93;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: #553a75;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
`;

const ImageCard = styled.div`
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ImageTitle = styled.div`
  padding: 0.75rem;
  background: #f8f5f2;
  font-size: 0.9rem;
  color: #333;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
  font-size: 1.1rem;
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
  border-radius: 8px;
`;

const ModalTitle = styled.h3`
  color: white;
  margin-top: 1rem;
  font-size: 1.2rem;
`;

const DeleteButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #cc0000;
  }
`;

const UploadModalContent = styled.div`
  position: relative;
`;

const UploadModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #6a4c93;
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
  color: #333;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6a4c93;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  padding: 0.5rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;

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
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UploadSubmitButton = styled.button`
  padding: 1rem;
  background: #6a4c93;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #553a75;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
