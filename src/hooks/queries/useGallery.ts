import { useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadToR2 } from '@/lib/storage/uploadClient';
import { queryKeys } from '@/lib/queryKeys';
import type { GalleryImage, UploadMediaParams } from '@/types/api/gallery';
export type { GalleryImage, UploadMediaParams };

// ─── 쿼리 훅 ────────────────────────────────────────────────────
export function useImages(type?: 'image' | 'video') {
  return useQuery({
    queryKey: type ? [...queryKeys.images.all, type] : queryKeys.images.all,
    queryFn: async () => {
      const url = type ? `/api/images?type=${type}` : '/api/images';
      const res = await fetch(url);
      if (!res.ok) throw new Error('미디어를 불러올 수 없습니다');
      const data: GalleryImage[] = await res.json();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── 업로드 (클라이언트 직접 업로드) ────────────────────────────
export function useUploadMedia() {
  const queryClient = useQueryClient();

  const uploadMedia = async ({ file, title, onProgress }: UploadMediaParams) => {
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

    // 1단계: R2에 직접 업로드 (presigned PUT)
    const publicUrl = await uploadToR2(file, {
      type: 'gallery',
      onProgress,
    });

    // 2단계: 클라이언트에서 직접 DB 저장
    const res = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        imageUrl: publicUrl,
        filename: publicUrl.split('/').pop(),
        type: mediaType,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || '저장에 실패했습니다');
    }

    await queryClient.invalidateQueries({ queryKey: queryKeys.images.all });
    return { url: publicUrl };
  };

  return { uploadMedia };
}

// ─── 삭제 뮤테이션 ────────────────────────────────────────────
import { useMutation } from '@tanstack/react-query';

export function useDeleteImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '삭제에 실패했습니다');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.images.all });
    },
  });
}
