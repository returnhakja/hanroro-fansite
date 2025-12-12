import { useCallback, useEffect, useState } from "react";
import { deleteImage, fetchImages } from "../api/api";
import { useLoading } from "../components/LoadingContext";

export type ImageItem = {
  _id: string;
  imageUrl: string;
  title: string;
  createdAt?: string;
};

export const useImages = () => {
  const { loading, setLoading } = useLoading();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchImages()) as ImageItem[];
      setImages(data);
    } catch (err) {
      console.error("이미지 불러오기 실패:", err);
      setError("이미지를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  const removeImage = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const success = await deleteImage(id);
        if (success) {
          setImages((prev) => prev.filter((img) => img._id !== id));
          return { success: true as const };
        }
        return { success: false as const, message: "삭제에 실패했어요." };
      } catch (err) {
        console.error("삭제 중 오류:", err);
        return {
          success: false as const,
          message: "삭제 중 오류가 발생했습니다.",
        };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return { images, loading, error, reload: loadImages, removeImage };
};

