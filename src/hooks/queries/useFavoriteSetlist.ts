import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoriteSetlist } from '@/types/api/setlistBuilder';
export type { FavoriteSetlist };

export function useFavoriteSetlist(id: string) {
  return useQuery({
    queryKey: ['favoriteSetlist', id],
    queryFn: async () => {
      const res = await fetch(`/api/setlist-builder/${id}`);
      if (!res.ok) throw new Error('세트리스트를 불러올 수 없습니다');
      return (await res.json()) as FavoriteSetlist;
    },
    enabled: !!id,
  });
}

export function useMyFavoriteSetlists(enabled: boolean) {
  return useQuery({
    queryKey: ['favoriteSetlist', 'mine'],
    queryFn: async () => {
      const res = await fetch('/api/setlist-builder?mine=1');
      if (!res.ok) throw new Error('목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.setlists || []) as FavoriteSetlist[];
    },
    enabled,
  });
}

export function useCreateFavoriteSetlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (songs: string[]) => {
      const res = await fetch('/api/setlist-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songs }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '세트리스트를 저장할 수 없습니다');
      }
      return (await res.json()) as FavoriteSetlist;
    },
    onSuccess: () => {
      // 마이페이지 "내가 만든 최애 세트리스트" 목록 캐시가 5분간 유지되어,
      // 방금 만든 게 새로고침 없이는 안 보이던 문제를 막기 위해 즉시 갱신
      queryClient.invalidateQueries({ queryKey: ['favoriteSetlist', 'mine'] });
    },
  });
}
