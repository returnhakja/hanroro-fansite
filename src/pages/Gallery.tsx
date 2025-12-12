import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useImages, type ImageItem } from "../hooks/useImages";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryModal } from "./GalleryModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { useToast } from "../components/ToastContext";
import {
  Container,
  EmptyText,
  Title,
  TitleWrapper,
  UploadButton,
} from "./Gallery.styles";

export const Gallery = () => {
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState<ImageItem | null>(null);
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);
  const { images, loading, error, removeImage } = useImages();
  const { showToast } = useToast();

  const handleUploadClick = () => {
    navigate("/upload");
  };

  return (
    <Container>
      {loading && <Spinner />}
      <TitleWrapper>
        <Title>포토갤러리</Title>
        <UploadButton onClick={handleUploadClick}> + </UploadButton>
      </TitleWrapper>

      {error && <EmptyText>{error}</EmptyText>}
      {!loading && !error && images.length === 0 && (
        <EmptyText>아직 등록된 이미지가 없어요.</EmptyText>
      )}

      {images.length > 0 && (
        <GalleryGrid
          images={images}
          onSelect={setSelectedImg}
          onDelete={(id) => setConfirmTargetId(id)}
        />
      )}

      <GalleryModal image={selectedImg} onClose={() => setSelectedImg(null)} />

      <ConfirmModal
        isOpen={confirmTargetId !== null}
        title="이미지 삭제"
        description="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        onCancel={() => setConfirmTargetId(null)}
        onConfirm={async () => {
          if (!confirmTargetId) return;
          const result = await removeImage(confirmTargetId);
          setConfirmTargetId(null);
          if (result.success) {
            showToast("삭제되었습니다.", "success");
          } else {
            showToast(result.message, "error");
          }
        }}
      />
    </Container>
  );
};

