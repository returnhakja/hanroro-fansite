import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type {
  GameDifficulty,
  GameRoundResponse,
  GameSubmitResponse,
  GameRankingRow,
  GameResultDetail,
} from '@/types/api/game';

export function useStartGameRound() {
  return useMutation({
    mutationFn: async (difficulty: GameDifficulty) => {
      const res = await fetch('/api/game/round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '라운드를 시작할 수 없습니다');
      }
      return (await res.json()) as GameRoundResponse;
    },
  });
}

export function useCheckGameAnswer() {
  return useMutation({
    mutationFn: async (payload: { roundToken: string; index: number; guess: string }) => {
      const res = await fetch('/api/game/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '정답 확인에 실패했습니다');
      }
      return (await res.json()) as { correct: boolean; answer: string };
    },
  });
}

export function useSubmitGame() {
  return useMutation({
    mutationFn: async (payload: {
      roundToken: string;
      nickname: string;
      guesses: string[];
      elapsedMs: number;
    }) => {
      const res = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '채점에 실패했습니다');
      }
      return (await res.json()) as GameSubmitResponse;
    },
  });
}

export function useGameRanking(difficulty: GameDifficulty) {
  return useQuery({
    queryKey: queryKeys.game.ranking(difficulty),
    queryFn: async () => {
      const res = await fetch(`/api/game/ranking?difficulty=${difficulty}`);
      if (!res.ok) throw new Error('랭킹을 불러올 수 없습니다');
      const data = await res.json();
      return data.ranking as GameRankingRow[];
    },
  });
}

export function useGameResult(id: string, initialData?: GameResultDetail) {
  return useQuery({
    queryKey: queryKeys.game.result(id),
    queryFn: async () => {
      const res = await fetch(`/api/game/result/${id}`);
      if (!res.ok) throw new Error('결과를 불러올 수 없습니다');
      const data = await res.json();
      return data.result as GameResultDetail;
    },
    enabled: !!id,
    initialData,
  });
}
