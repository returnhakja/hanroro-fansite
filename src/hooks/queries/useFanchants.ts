import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type { ILyricLine, ILyricSegment } from '@/lib/db/models/Fanchant';
export type { ILyricLine, ILyricSegment };

// ─── 타입 ───────────────────────────────────────────────────────
export interface Fanchant {
  _id: string;
  songTitle: string;
  album: string;
  albumImageUrl?: string;
  order: number;
  lyrics: ILyricLine[];
}

export interface FanchantFormData {
  songTitle: string;
  album: string;
  albumImageUrl?: string;
  order: number;
  lyricsRaw: string;
}

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── 공개 훅 ─────────────────────────────────────────────────────
export function useFanchants() {
  return useQuery({
    queryKey: queryKeys.fanchants.all,
    queryFn: async () => {
      const res = await fetch('/api/fanchants');
      if (!res.ok) throw new Error('응원법 목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.fanchants || []) as Fanchant[];
    },
  });
}

// ─── 관리자 훅 ───────────────────────────────────────────────────
export function useAdminFanchants() {
  return useQuery({
    queryKey: queryKeys.fanchants.admin,
    queryFn: async () => {
      const res = await fetch('/api/admin/fanchants', {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('응원법 목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.fanchants || []) as Fanchant[];
    },
  });
}

export function useCreateFanchant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FanchantFormData) => {
      const res = await fetch('/api/admin/fanchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '생성 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fanchants.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.fanchants.all });
    },
  });
}

export function useUpdateFanchant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FanchantFormData }) => {
      const res = await fetch(`/api/admin/fanchants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '수정 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fanchants.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.fanchants.all });
    },
  });
}

export function useDeleteFanchant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/fanchants/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '삭제 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fanchants.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.fanchants.all });
    },
  });
}
