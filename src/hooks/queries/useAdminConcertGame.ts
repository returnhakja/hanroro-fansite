import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';

export interface AdminConcertQuestion {
  _id: string;
  imageUrl: string;
  correctDate: string;
  correctVenue: string;
  wrongDates: string[];
  wrongVenues: string[];
  credit: string;
  isActive: boolean;
  createdAt: string;
}

export interface ConcertQuestionFormValues {
  imageUrl: string;
  correctDate: string;
  correctVenue: string;
  wrongDates: string[];
  wrongVenues: string[];
  credit: string;
  isActive?: boolean;
}

export interface AdminConcertResultRow {
  _id: string;
  nickname: string;
  score: number;
  dateCorrectCount: number;
  venueCorrectCount: number;
  createdAt: string;
}

export function useAdminConcertQuestions() {
  return useQuery({
    queryKey: queryKeys.game.adminConcertQuestions,
    queryFn: async () => {
      const res = await fetch('/api/admin/game/concert/questions', { headers: getAuthHeader() });
      if (!res.ok) throw new Error('문제 목록을 불러올 수 없습니다');
      const data = await res.json();
      return data.questions as AdminConcertQuestion[];
    },
  });
}

export function useCreateConcertQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ConcertQuestionFormValues) => {
      const res = await fetch('/api/admin/game/concert/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '등록에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminConcertQuestions });
    },
  });
}

export function useUpdateConcertQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: ConcertQuestionFormValues }) => {
      const res = await fetch(`/api/admin/game/concert/questions/${id}`, {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminConcertQuestions });
    },
  });
}

export function useDeleteConcertQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/game/concert/questions/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminConcertQuestions });
    },
  });
}

export function useAdminConcertResults() {
  return useQuery({
    queryKey: queryKeys.game.adminConcertResults,
    queryFn: async () => {
      const res = await fetch('/api/admin/game/concert/results', { headers: getAuthHeader() });
      if (!res.ok) throw new Error('결과 목록을 불러올 수 없습니다');
      const data = await res.json();
      return data.results as AdminConcertResultRow[];
    },
  });
}

export function useDeleteAdminConcertResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/game/concert/results/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.game.adminConcertResults });
    },
  });
}
