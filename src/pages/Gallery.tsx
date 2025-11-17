import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ImageItem = {
  id: number;
  src: string;
  title: string;
};
export const Gallery = () => {
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined);

  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("http://localhost:5000/api/images");
      const data = await res.json();
      console.log(data);
      const formatted = data.map((url: any, index: number) => ({
        id: index,
        src: `http://localhost:5000${url}`,
        title: `이미지 ${index + 1}`,
      }));
      console.log(formatted);
      setImages(formatted);
    };
    fetchImages();
  }, []);
  const handleUploadClick = () => {
    navigate("/upload");
  };
  return (
    <Container>
      <TitleWrapper>
        <TiTle>한로로 갤러리</TiTle>
        <UploadButton onClick={handleUploadClick}> + </UploadButton>
      </TitleWrapper>
      <Grid>
        {images.map((img) => (
          <ImageCard key={img.id}>
            <img
              src={img.src}
              alt={img.title}
              onClick={() => setSelectedImg(img.src)}
            />
            <p>{img.title}</p>
          </ImageCard>
        ))}
      </Grid>
      {selectedImg && (
        <Modal onClick={() => setSelectedImg(undefined)}>
          <ModalContent>
            <img src={selectedImg || undefined} alt="확대 이미지" />
            <CloseButton onClick={() => setSelectedImg(undefined)}>
              x
            </CloseButton>
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

const ImageCard = styled.div`
  background-color: #f8f5f2;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    &:hover {
      cursor: pointer;
    }
  }

  p {
    padding: 0.5rem;
    font-size: 0.95rem;
    color: #444;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 80%;
  max-height: 80%;
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #fff;
  border: none;
  font-size: 1.5rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
