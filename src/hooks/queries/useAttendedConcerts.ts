import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { queryKeys } from '@/lib/queryKeys';
import type { AttendedConcert, UserStats } from '@/types/api/user';
export type { AttendedConcert, UserStats };

export interface AttendedConcertInput {
  sourceType: 'event' | 'concert';
  sourceId: string;
  title: string;
  venue?: string;
  date: string;
}

// 내가 체크한 공연 목록 (로그인 상태일 때만 조회)
export function useAttendedConcerts() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: queryKeys.attendedConcerts.all,
    queryFn: async () => {
      const res = await fetch('/api/user/attended-concerts');
      if (!res.ok) throw new Error('공연 목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.items || []) as AttendedConcert[];
    },
    enabled: !!session?.user,
  });
}

// 마이페이지 활동 요약 (로그인 상태일 때만 조회)
export function useUserStats() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: queryKeys.userStats.all,
    queryFn: async () => {
      const res = await fetch('/api/user/stats');
      if (!res.ok) throw new Error('통계를 불러올 수 없습니다');
      return (await res.json()) as UserStats;
    },
    enabled: !!session?.user,
  });
}

// 공연 체크 추가/해제 토글
export function useToggleAttendedConcert() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.attendedConcerts.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.userStats.all });
  };

  const check = useMutation({
    mutationFn: async (input: AttendedConcertInput) => {
      const res = await fetch('/api/user/attended-concerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '체크에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: invalidate,
  });

  const uncheck = useMutation({
    mutationFn: async (input: { sourceType: 'event' | 'concert'; sourceId: string }) => {
      const res = await fetch('/api/user/attended-concerts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '체크 해제에 실패했습니다');
      }
    },
    onSuccess: invalidate,
  });

  return { check, uncheck };
}
