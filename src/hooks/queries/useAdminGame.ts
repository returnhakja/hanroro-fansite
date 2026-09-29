import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';

export interface AdminGameSongRow {
  songTitle: string;
  album: string;
  albumImageUrl: string;
  youtubeId: string;
  startSeconds: number | null;
}

export interface AdminGameResultRow {
  _id: string;
  nickname: string;
  difficulty: 'easy' | 'normal' | 'hard';
  score: number;
  elapsedMs: number;
  createdAt: string;
}

export function useAdminGameSongs() {
  return useQuery({
    queryKey: queryKeys.game.adminSongs,
    queryFn: async () => {
      const res = await fetch('/api/admin/game/songs', { headers: getAuthHeader() });
      if (!res.ok) throw new Error('곡 목록을 불러올 수 없습니다');
      const data = await res.json();
      return data.songs as AdminGameSongRow[];
    },
  });
}

export function useSaveAdminGameSongs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (songs: AdminGameSongRow[]) => {
      const res = await fetch('/api/admin/game/songs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ songs }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '저장에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminSongs });
    },
  });
}

export function useAdminGameResults() {
  return useQuery({
    queryKey: queryKeys.game.adminResults,
    queryFn: async () => {
      const res = await fetch('/api/admin/game/results', { headers: getAuthHeader() });
      if (!res.ok) throw new Error('결과 목록을 불러올 수 없습니다');
      const data = await res.json();
      return data.results as AdminGameResultRow[];
    },
  });
}

export function useDeleteAdminGameResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/game/results/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminResults });
    },
  });
}
