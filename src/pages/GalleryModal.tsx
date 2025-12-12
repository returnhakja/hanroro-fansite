import Modal from "react-modal";
import { CloseButton } from "../components/CloseButton";
import { ModalContent, ModalImage, modalStyles } from "./Gallery.styles";
import type { ImageItem } from "../hooks/useImages";

type Props = {
  image: ImageItem | null;
  onClose: () => void;
};

export const GalleryModal = ({ image, onClose }: Props) => {
  if (!image) return null;

  return (
    <Modal isOpen onRequestClose={onClose} style={modalStyles}>
      <ModalContent>
        <ModalImage src={image.imageUrl} alt={image.title} />
        <CloseButton onClick={onClose} />
      </ModalContent>
    </Modal>
  );
};
