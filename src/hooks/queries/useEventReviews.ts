import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type { EventReview } from '@/types/api/event';
export type { EventReview };

export function useEventReviews(eventId: string) {
  return useQuery({
    queryKey: queryKeys.eventReviews.list(eventId),
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}/reviews`);
      if (!res.ok) throw new Error('후기를 불러올 수 없습니다');
      const data = await res.json();
      return (data.reviews || []) as EventReview[];
    },
    enabled: !!eventId,
  });
}

export function useCreateEventReview(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      author: string;
      content: string;
      password?: string;
      imageUrls?: string[];
    }) => {
      const res = await fetch(`/api/events/${eventId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '후기 작성에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventReviews.list(eventId) });
    },
  });
}

export function useDeleteEventReview(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, password }: { reviewId: string; password?: string }) => {
      const res = await fetch(`/api/events/${eventId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '후기 삭제에 실패했습니다');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventReviews.list(eventId) });
    },
  });
}
