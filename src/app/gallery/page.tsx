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

  useEffect(() => {
    fetchImages();
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

  if (loading) return <Spinner />;

  return (
    <Container>
      <Title>Gallery</Title>
      <Subtitle>한로로의 다양한 모습을 감상하세요</Subtitle>

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
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
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
