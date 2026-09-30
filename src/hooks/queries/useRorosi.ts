import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type { RorosiSubmitResponse, RorosiRankingRow, RorosiResultDetail } from '@/types/api/rorosi';

export function useSubmitRorosi() {
  return useMutation({
    mutationFn: async (elapsedMs: number) => {
      const res = await fetch('/api/game/rorosi/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elapsedMs }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '기록에 실패했습니다');
      }
      return (await res.json()) as RorosiSubmitResponse;
    },
  });
}

export function useUpdateRorosiNickname() {
  return useMutation({
    mutationFn: async ({ id, nickname }: { id: string; nickname: string }) => {
      const res = await fetch(`/api/game/rorosi/result/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '닉네임 변경에 실패했습니다');
      }
      return (await res.json()) as { result: RorosiResultDetail };
    },
  });
}

export function useRorosiRanking() {
  return useQuery({
    queryKey: queryKeys.game.rorosiRanking,
    queryFn: async () => {
      const res = await fetch('/api/game/rorosi/ranking');
      if (!res.ok) throw new Error('랭킹을 불러올 수 없습니다');
      const data = await res.json();
      return data.ranking as RorosiRankingRow[];
    },
  });
}

export function useRorosiResult(id: string, initialData?: RorosiResultDetail) {
  return useQuery({
    queryKey: queryKeys.game.rorosiResult(id),
    queryFn: async () => {
      const res = await fetch(`/api/game/rorosi/result/${id}`);
      if (!res.ok) throw new Error('결과를 불러올 수 없습니다');
      const data = await res.json();
      return data.result as RorosiResultDetail;
    },
    enabled: !!id,
    initialData,
  });
}
