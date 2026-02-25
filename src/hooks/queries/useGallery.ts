import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

// ─── 타입 ───────────────────────────────────────────────────────
export interface GalleryImage {
  _id: string;
  title: string;
  filename?: string;
  imageUrl: string;
  userId?: string | null;
  createdAt: string;
}

// ─── 쿼리 훅 ────────────────────────────────────────────────────
export function useImages() {
  return useQuery({
    queryKey: queryKeys.images.all,
    queryFn: async () => {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error('이미지를 불러올 수 없습니다');
      const data: GalleryImage[] = await res.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
}

// ─── 뮤테이션 훅 ────────────────────────────────────────────────
export function useUploadImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '업로드에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.images.all });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/image/${id}`, { method: 'DELETE' });
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
