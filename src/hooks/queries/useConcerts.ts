import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';
import type { Song, SetList, Concert, ActiveSetlistData } from '@/types/api/concert';
export type { Song, SetList, Concert, ActiveSetlistData };

// ─── 쿼리 훅 ────────────────────────────────────────────────────
// 공개: 공연 + 셋리스트 목록
export function useConcerts() {
  return useQuery({
    queryKey: queryKeys.concerts.all,
    queryFn: async () => {
      const res = await fetch('/api/concerts');
      if (!res.ok) throw new Error('공연 목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.concerts || []) as Concert[];
    },
  });
}

// 공개: 활성 셋리스트 (홈 화면용)
export function useActiveSetlist() {
  return useQuery({
    queryKey: queryKeys.setlists.active,
    queryFn: async () => {
      const res = await fetch('/api/setlists/active');
      if (!res.ok) throw new Error('셋리스트를 불러올 수 없습니다');
      const data: ActiveSetlistData = await res.json();
      return data;
    },
  });
}

// 관리자: 공연 목록
export function useAdminConcerts() {
  return useQuery({
    queryKey: queryKeys.concerts.admin,
    queryFn: async () => {
      const res = await fetch('/api/admin/concerts', {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('공연 목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.concerts || []) as Concert[];
    },
  });
}

// 관리자: 특정 공연의 셋리스트 (concertId 있을 때만 실행)
export function useSetlists(concertId: string | null) {
  return useQuery({
    queryKey: queryKeys.setlists.byConcert(concertId ?? ''),
    queryFn: async () => {
      const res = await fetch(`/api/admin/setlists?concertId=${concertId}`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('셋리스트를 불러올 수 없습니다');
      const data = await res.json();
      return (data.setlists || []) as SetList[];
    },
    enabled: !!concertId,
  });
}

// ─── 공연 뮤테이션 훅 ───────────────────────────────────────────
export function useCreateConcert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Omit<Concert, '_id' | 'isActive' | 'setlists'>) => {
      const res = await fetch('/api/admin/concerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '저장 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.concerts.admin });
    },
  });
}

export function useUpdateConcert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: Partial<Concert> }) => {
      const res = await fetch(`/api/admin/concerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '수정 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.concerts.admin });
    },
  });
}

export function useDeleteConcert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/concerts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '삭제 실패');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.concerts.admin });
    },
  });
}

export function useToggleConcertActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/concerts/${id}/activate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '활성화 상태 변경 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.concerts.admin });
    },
  });
}

// ─── 셋리스트 뮤테이션 훅 ─────────────────────────────────────────
export function useCreateSetlist(concertId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { day: number; date: string; songs: Song[]; concertId: string }) => {
      const res = await fetch('/api/admin/setlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '저장 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.setlists.byConcert(concertId) });
    },
  });
}

export function useUpdateSetlist(concertId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: { day: number; date: string; songs: Song[] } }) => {
      const res = await fetch(`/api/admin/setlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '수정 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.setlists.byConcert(concertId) });
    },
  });
}

export function useDeleteSetlist(concertId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/setlists/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '삭제 실패');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.setlists.byConcert(concertId) });
    },
  });
}
