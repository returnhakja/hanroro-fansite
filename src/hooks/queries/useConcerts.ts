import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';
import type { Song, SetList, Concert, ActiveSetlistData, ConcertListResponse } from '@/types/api/concert';
export type { Song, SetList, Concert, ActiveSetlistData, ConcertListResponse };

/**
 * 셋리스트 생성/수정 요청 본문.
 * endDay/endDate 는 "여러 날 동일한 셋리스트"일 때만 채워 보낸다.
 */
export interface SetlistFormBody {
  day: number;
  date: string;
  endDay?: number | null;
  endDate?: string | null;
  songs: Song[];
}

// ─── 쿼리 훅 ────────────────────────────────────────────────────
// 공개: 공연 + 셋리스트 목록 (페이지네이션/검색)
export function useConcerts({ page = 1, q = '' }: { page?: number; q?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.concerts.list(page, q),
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set('q', q);
      const res = await fetch(`/api/concerts?${params.toString()}`);
      if (!res.ok) throw new Error('공연 목록을 불러올 수 없습니다');
      return (await res.json()) as ConcertListResponse;
    },
  });
}

// 공개: 공연 전체 목록 (페이지네이션 없이 전부 필요한 화면용, 예: 일정 페이지)
export function useAllConcerts() {
  return useQuery({
    queryKey: queryKeys.concerts.all,
    queryFn: async () => {
      const res = await fetch('/api/concerts?all=true');
      if (!res.ok) throw new Error('공연 목록을 불러올 수 없습니다');
      const data = (await res.json()) as ConcertListResponse;
      return data.concerts;
    },
  });
}

// 공개: concertId가 몇 페이지에 있는지 조회 (딥링크용, 1회성 fetch)
export async function locateConcertPage(concertId: string): Promise<number> {
  const res = await fetch(`/api/concerts?locateId=${concertId}`);
  if (!res.ok) throw new Error('공연 위치를 찾을 수 없습니다');
  const data = await res.json();
  return data.page as number;
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
    mutationFn: async (body: SetlistFormBody & { concertId: string }) => {
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
    mutationFn: async ({ id, body }: { id: string; body: SetlistFormBody }) => {
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
