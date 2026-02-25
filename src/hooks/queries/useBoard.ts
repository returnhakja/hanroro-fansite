import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

// ─── 타입 ───────────────────────────────────────────────────────
export interface BoardPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  userId?: string;
  createdAt: string;
  views: number;
  likes: number;
  likedBy?: string[];
  imageUrls?: string[];
}

export interface Comment {
  _id: string;
  boardId: string;
  content: string;
  author: string;
  userId?: string;
  parentId: string | null;
  depth: number;
  createdAt: string;
  deleted: boolean;
}

// ─── 쿼리 훅 ────────────────────────────────────────────────────
export function useBoardList() {
  return useQuery({
    queryKey: queryKeys.board.all,
    queryFn: async () => {
      const res = await fetch('/api/board');
      if (!res.ok) throw new Error('게시글 목록을 불러올 수 없습니다');
      const data: BoardPost[] = await res.json();
      return data;
    },
  });
}

export function useBoardDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.board.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/board/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '게시글을 불러올 수 없습니다');
      }
      const data: BoardPost = await res.json();
      return data;
    },
    enabled: !!id,
  });
}

export function useComments(boardId: string) {
  return useQuery({
    queryKey: queryKeys.board.comments(boardId),
    queryFn: async () => {
      const res = await fetch(`/api/board/${boardId}/comments`);
      if (!res.ok) throw new Error('댓글을 불러올 수 없습니다');
      const data = await res.json();
      return data.comments as Comment[];
    },
    enabled: !!boardId,
  });
}

// ─── 뮤테이션 훅 ────────────────────────────────────────────────
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { title: string; content: string; author: string; imageUrls?: string[] }) => {
      const res = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '게시글 작성에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board.all });
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { title: string; content: string }) => {
      const res = await fetch(`/api/board/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '수정에 실패했습니다');
      }
      return res.json() as Promise<BoardPost>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.board.all });
    },
  });
}

export function useDeletePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/board/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '삭제에 실패했습니다');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board.all });
    },
  });
}

export function useLikePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/board/${id}/like`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '좋아요에 실패했습니다');
      }
      return res.json() as Promise<{ likes: number; liked: boolean }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board.detail(id) });
    },
  });
}

export function useCreateComment(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { content: string; author: string; parentId?: string | null }) => {
      const res = await fetch(`/api/board/${boardId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '댓글 작성에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board.comments(boardId) });
    },
  });
}

export function useUpdateComment(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const res = await fetch(`/api/board/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '댓글 수정에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board.comments(boardId) });
    },
  });
}

export function useDeleteComment(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`/api/board/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '댓글 삭제에 실패했습니다');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board.comments(boardId) });
    },
  });
}
