import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';
import type { Event, EventFormData } from '@/types/api/event';
export type { Event, EventFormData };

// ─── 쿼리 훅 ────────────────────────────────────────────────────
export function useUpcomingEvents() {
  return useQuery({
    queryKey: queryKeys.events.upcoming,
    queryFn: async () => {
      const res = await fetch('/api/events/upcoming');
      if (!res.ok) throw new Error('일정을 불러올 수 없습니다');
      const data = await res.json();
      return (data.events || []) as Event[];
    },
  });
}

export function useAdminEvents() {
  return useQuery({
    queryKey: queryKeys.events.admin,
    queryFn: async () => {
      const res = await fetch('/api/admin/events', {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('일정 목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.events || []) as Event[];
    },
  });
}

// ─── 뮤테이션 훅 ────────────────────────────────────────────────
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: EventFormData) => {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '저장 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: EventFormData }) => {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '수정 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '삭제 실패');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming });
    },
  });
}

export function useTogglePin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPinned }: { id: string; isPinned: boolean }) => {
      const res = await fetch(`/api/admin/events/${id}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ isPinned }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '핀 설정 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.admin });
    },
  });
}
