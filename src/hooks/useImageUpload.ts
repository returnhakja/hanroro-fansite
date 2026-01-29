import { useEffect, useState } from "react";

export const useImageUpload = (initialUrls: string[] = []) => {
  const [existingUrls, setExistingUrls] = useState<string[]>(initialUrls);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  // 미리보기 생성
  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [newImages]);

  const addFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length > 0) {
      setNewImages((prev) => [...prev, ...imageFiles]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setNewImages([]);
    setPreviews([]);
    setDragging(false);
  };

  const getAllImageUrls = (uploadedUrls: string[] = []) => {
    return [...existingUrls, ...uploadedUrls];
  };

  return {
    existingUrls,
    setExistingUrls,
    newImages,
    previews,
    dragging,
    setDragging,
    addFiles,
    removeExistingImage,
    removeNewImage,
    reset,
    getAllImageUrls,
  };
};
