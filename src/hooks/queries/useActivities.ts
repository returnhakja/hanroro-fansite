import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';
import type { Activity, ActivityFormData } from '@/types/api/activity';
export type { Activity, ActivityFormData };


// ─── 공개 쿼리 훅 ────────────────────────────────────────────────
export function useActivities() {
  return useQuery({
    queryKey: queryKeys.activities.all,
    queryFn: async () => {
      const res = await fetch('/api/activities');
      if (!res.ok) throw new Error('연대기를 불러올 수 없습니다');
      const data = await res.json();
      return (data.activities || []) as Activity[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── 관리자 쿼리 훅 ─────────────────────────────────────────────
export function useAdminActivities() {
  return useQuery({
    queryKey: queryKeys.activities.admin,
    queryFn: async () => {
      const res = await fetch('/api/admin/activities', {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('활동 목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.activities || []) as Activity[];
    },
  });
}

// ─── 뮤테이션 훅 ────────────────────────────────────────────────
export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: ActivityFormData) => {
      const res = await fetch('/api/admin/activities', {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: ActivityFormData }) => {
      const res = await fetch(`/api/admin/activities/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/activities/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '삭제 실패');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
  });
}
