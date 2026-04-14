import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';
import type { AdminPost, AdminBoardStats } from '@/types/api/board';
export type { AdminPost, AdminBoardStats };

export function useAdminBoard(page: number, searchQuery: string) {
  return useQuery({
    queryKey: queryKeys.adminBoard.list(page, searchQuery),
    queryFn: async () => {
      const url = new URL('/api/admin/board', window.location.origin);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', '20');
      if (searchQuery) url.searchParams.append('search', searchQuery);

      const res = await fetch(url.toString(), { headers: getAuthHeader() });
      if (!res.ok) throw new Error('게시글 목록을 불러올 수 없습니다');
      const data = await res.json();
      return {
        posts: data.posts as AdminPost[],
        stats: data.stats as AdminBoardStats,
        totalPages: data.pagination.totalPages as number,
      };
    },
  });
}

export function useAdminDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/board/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('게시글 삭제 실패');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminBoard.all });
    },
  });
}
