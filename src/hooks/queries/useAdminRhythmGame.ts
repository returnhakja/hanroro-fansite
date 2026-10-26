import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';
import type { RhythmNote } from '@/types/api/rhythm';

export interface AdminRhythmChartRow {
  _id: string;
  title: string;
  youtubeId: string;
  startSeconds: number;
  bpm: number;
  offsetMs: number;
  difficulty: 'easy' | 'normal' | 'hard';
  noteCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminRhythmChartDetail {
  _id: string;
  title: string;
  youtubeId: string;
  startSeconds: number;
  bpm: number;
  offsetMs: number;
  difficulty: 'easy' | 'normal' | 'hard';
  notes: RhythmNote[];
  isActive: boolean;
}

export interface RhythmChartFormValues {
  title: string;
  youtubeId: string;
  startSeconds: number;
  bpm: number;
  offsetMs: number;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface AdminRhythmResultRow {
  _id: string;
  chartTitle: string;
  nickname: string;
  score: number;
  maxCombo: number;
  perfectCount: number;
  greatCount: number;
  missCount: number;
  createdAt: string;
}

export function useAdminRhythmCharts() {
  return useQuery({
    queryKey: queryKeys.game.adminRhythmCharts,
    queryFn: async () => {
      const res = await fetch('/api/admin/game/rhythm/charts', { headers: getAuthHeader() });
      if (!res.ok) throw new Error('곡 목록을 불러올 수 없습니다');
      const data = await res.json();
      return data.charts as AdminRhythmChartRow[];
    },
  });
}

export function useAdminRhythmChart(id: string) {
  return useQuery({
    queryKey: queryKeys.game.adminRhythmChart(id),
    queryFn: async () => {
      const res = await fetch(`/api/admin/game/rhythm/charts/${id}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('곡을 불러올 수 없습니다');
      const data = await res.json();
      return data.chart as AdminRhythmChartDetail;
    },
    enabled: !!id,
  });
}

export function useCreateRhythmChart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: RhythmChartFormValues) => {
      const res = await fetch('/api/admin/game/rhythm/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '등록에 실패했습니다');
      }
      return res.json() as Promise<{ _id: string }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminRhythmCharts });
    },
  });
}

export function useUpdateRhythmChart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<RhythmChartFormValues> & { notes?: RhythmNote[]; isActive?: boolean } }) => {
      const res = await fetch(`/api/admin/game/rhythm/charts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '수정에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminRhythmCharts });
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminRhythmChart(variables.id) });
    },
  });
}

export function useDeleteRhythmChart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/game/rhythm/charts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '삭제에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminRhythmCharts });
    },
  });
}

export function useAdminRhythmResults() {
  return useQuery({
    queryKey: queryKeys.game.adminRhythmResults,
    queryFn: async () => {
      const res = await fetch('/api/admin/game/rhythm/results', { headers: getAuthHeader() });
      if (!res.ok) throw new Error('결과 목록을 불러올 수 없습니다');
      const data = await res.json();
      return { results: data.results as AdminRhythmResultRow[], totalCount: data.totalCount as number };
    },
  });
}

export function useDeleteAdminRhythmResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/game/rhythm/results/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '삭제에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminRhythmResults });
    },
  });
}
