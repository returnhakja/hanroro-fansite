import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type {
  RhythmChartSummary,
  RhythmChartDetail,
  RhythmSubmitResponse,
  RhythmRankingRow,
} from '@/types/api/rhythm';

export function useRhythmCharts() {
  return useQuery({
    queryKey: queryKeys.game.rhythmCharts,
    queryFn: async () => {
      const res = await fetch('/api/game/rhythm/charts');
      if (!res.ok) throw new Error('곡 목록을 불러올 수 없습니다');
      const data = await res.json();
      return data.charts as RhythmChartSummary[];
    },
  });
}

export function useFetchRhythmChart() {
  return useMutation({
    mutationFn: async (chartId: string) => {
      const res = await fetch(`/api/game/rhythm/charts/${chartId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '곡을 불러올 수 없습니다');
      }
      const data = await res.json();
      return data.chart as RhythmChartDetail;
    },
  });
}

export function useSubmitRhythmResult() {
  return useMutation({
    mutationFn: async (params: {
      chartId: string;
      score: number;
      maxCombo: number;
      perfectCount: number;
      greatCount: number;
      missCount: number;
    }) => {
      const res = await fetch('/api/game/rhythm/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '결과 저장에 실패했습니다');
      }
      return (await res.json()) as RhythmSubmitResponse;
    },
  });
}

export function useUpdateRhythmNickname() {
  return useMutation({
    mutationFn: async ({ id, nickname }: { id: string; nickname: string }) => {
      const res = await fetch(`/api/game/rhythm/result/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '닉네임 변경에 실패했습니다');
      }
      return (await res.json()) as { nickname: string };
    },
  });
}

export function useRhythmRanking(chartId: string) {
  return useQuery({
    queryKey: queryKeys.game.rhythmRanking(chartId),
    queryFn: async () => {
      const res = await fetch(`/api/game/rhythm/ranking?chartId=${chartId}`);
      if (!res.ok) throw new Error('랭킹을 불러올 수 없습니다');
      const data = await res.json();
      return data.ranking as RhythmRankingRow[];
    },
    enabled: !!chartId,
  });
}
