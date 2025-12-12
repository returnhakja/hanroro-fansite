import { formatRelativeTime } from "../utils/formatRelativeTime";
import { DateText, DeleteButton, Grid, ImageCard } from "./Gallery.styles";
import type { ImageItem } from "../hooks/useImages";

type Props = {
  images: ImageItem[];
  onSelect: (img: ImageItem) => void;
  onDelete: (id: string) => void;
};

export const GalleryGrid = ({ images, onSelect, onDelete }: Props) => {
  return (
    <Grid>
      {images.map((img) => (
        <ImageCard key={img._id}>
          <img
            src={img.imageUrl}
            alt={img.title}
            onClick={() => onSelect(img)}
          />
          <DeleteButton onClick={() => onDelete(img._id)}>🗑️</DeleteButton>
          <p>{img.title}</p>
          {img.createdAt && (
            <DateText>{formatRelativeTime(img.createdAt)}</DateText>
          )}
        </ImageCard>
      ))}
    </Grid>
  );
};
