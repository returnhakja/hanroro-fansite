import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #6a4c93;
`;

export const Grid = styled.div`
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

export const DeleteButton = styled.button`
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

export const ImageCard = styled.div`
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

export const DateText = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.5rem;
`;

export const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  background: white;
  padding: 1rem;
  border-radius: 12px;
`;

export const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const UploadButton = styled.button`
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

export const EmptyText = styled.p`
  margin-top: 2rem;
  text-align: center;
  color: #666;
`;

export const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    border: "none",
    background: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
} as const;
