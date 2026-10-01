import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type {
  ConcertGameRoundResponse,
  ConcertGameSubmitResponse,
  ConcertGameRankingRow,
  ConcertGameResultDetail,
} from '@/types/api/concertGame';

export function useConcertGameRound() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/game/concert/questions');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '문제를 불러올 수 없습니다');
      }
      return (await res.json()) as ConcertGameRoundResponse;
    },
  });
}

export function useSubmitConcertGame() {
  return useMutation({
    mutationFn: async (params: {
      roundToken: string;
      answers: { questionId: string; pickedDate: string; pickedVenue: string }[];
    }) => {
      const res = await fetch('/api/game/concert/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '채점에 실패했습니다');
      }
      return (await res.json()) as ConcertGameSubmitResponse;
    },
  });
}

export function useUpdateConcertGameNickname() {
  return useMutation({
    mutationFn: async ({ id, nickname }: { id: string; nickname: string }) => {
      const res = await fetch(`/api/game/concert/result/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '닉네임 변경에 실패했습니다');
      }
      return (await res.json()) as { result: ConcertGameResultDetail };
    },
  });
}

export function useConcertGameRanking() {
  return useQuery({
    queryKey: queryKeys.game.concertRanking,
    queryFn: async () => {
      const res = await fetch('/api/game/concert/ranking');
      if (!res.ok) throw new Error('랭킹을 불러올 수 없습니다');
      const data = await res.json();
      return data.ranking as ConcertGameRankingRow[];
    },
  });
}

export function useConcertGameResult(id: string, initialData?: ConcertGameResultDetail) {
  return useQuery({
    queryKey: queryKeys.game.concertResult(id),
    queryFn: async () => {
      const res = await fetch(`/api/game/concert/result/${id}`);
      if (!res.ok) throw new Error('결과를 불러올 수 없습니다');
      const data = await res.json();
      return data.result as ConcertGameResultDetail;
    },
    enabled: !!id,
    initialData,
  });
}
