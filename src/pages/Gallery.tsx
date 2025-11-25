import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../components/LoadingContext";
import Spinner from "../components/Spinner";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import { CloseButton } from "../components/CloseButton";
import { deleteImage, fetchImages } from "../api/api";

type ImageItem = {
  _id: string;
  imageUrl: string;
  title: string;
  createdAt?: string;
};

export const Gallery = () => {
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<ImageItem[]>([]);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const data = await fetchImages();
        setImages(data);
      } catch (err) {
        console.error("이미지 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadClick = () => {
    navigate("/upload");
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const success = await deleteImage(id);
      if (success) {
        setImages((prev) => prev.filter((img) => img._id !== id));
      } else {
        alert("삭제 실패");
      }
    } catch (err) {
      console.error("삭제 중 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && <Spinner />}
      <TitleWrapper>
        <TiTle>한로로 갤러리</TiTle>
        <UploadButton onClick={handleUploadClick}> + </UploadButton>
      </TitleWrapper>
      <Grid>
        {images.map((img) => (
          <ImageCard key={img._id}>
            <img
              src={img.imageUrl}
              alt={img.title}
              onClick={() => setSelectedImg(img.imageUrl)}
            />
            <DeleteButton onClick={() => handleDelete(img._id)}>
              🗑️
            </DeleteButton>
            <p>{img.title}</p>
            {img.createdAt && (
              <DateText>{formatRelativeTime(img.createdAt)}</DateText>
            )}
          </ImageCard>
        ))}
      </Grid>
      {selectedImg && (
        <Modal onClick={() => setSelectedImg(undefined)}>
          <ModalContent>
            <ModalImage src={selectedImg} alt="확대 이미지" />
            <CloseButton onClick={() => setSelectedImg(undefined)} />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const TiTle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #6a4c93;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 1.2rem;
  line-height: 1;
`;

const ImageCard = styled.div`
  position: relative;
  background-color: #f8f5f2;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    cursor: pointer;
  }

  &:hover ${DeleteButton} {
    opacity: 1;
  }

  p {
    padding: 0.5rem;
    font-size: 0.95rem;
    color: #444;
  }
`;

const DateText = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  background: white;
  padding: 1rem;
  border-radius: 12px;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UploadButton = styled.button`
  font-size: 1.5rem;
  background: #6a4c93;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background 0.2s;

  &:hover {
    background: #8b5fbf;
  }
`;
