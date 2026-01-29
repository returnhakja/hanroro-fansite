import { useRef } from "react";
import {
  DropZone,
  Field,
  Label,
  RemoveThumb,
  ThumbGrid,
  ThumbItem,
} from "../pages/BoardWrite.styles";

interface ImageUploadSectionProps {
  existingUrls: string[];
  previews: string[];
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: (files: FileList) => void;
  onFileSelect: (files: FileList) => void;
  onRemoveExisting: (index: number) => void;
  onRemoveNew: (index: number) => void;
}

export const ImageUploadSection = ({
  existingUrls,
  previews,
  dragging,
  onDragStart,
  onDragEnd,
  onDrop,
  onFileSelect,
  onRemoveExisting,
  onRemoveNew,
}: ImageUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragEnd();
    if (e.dataTransfer.files) {
      onDrop(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(e.target.files);
    }
    e.target.value = "";
  };

  return (
    <Field>
      <Label>사진 첨부 (선택)</Label>
      <DropZone
        $dragging={dragging}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          onDragStart();
        }}
        onDragLeave={onDragEnd}
        onDrop={handleDrop}
      >
        클릭하거나 이미지를 끌어다 놓으세요.
        <br />
        여러 장 첨부할 수 있어요.
      </DropZone>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {(existingUrls.length > 0 || previews.length > 0) && (
        <ThumbGrid>
          {existingUrls.map((url, idx) => (
            <ThumbItem key={`existing-${url}-${idx}`}>
              <img src={url} alt="기존 첨부 이미지" />
              <RemoveThumb type="button" onClick={() => onRemoveExisting(idx)}>
                ×
              </RemoveThumb>
            </ThumbItem>
          ))}
          {previews.map((url, idx) => (
            <ThumbItem key={`new-${url}-${idx}`}>
              <img src={url} alt="새 첨부 이미지" />
              <RemoveThumb type="button" onClick={() => onRemoveNew(idx)}>
                ×
              </RemoveThumb>
            </ThumbItem>
          ))}
        </ThumbGrid>
      )}
    </Field>
  );
};
