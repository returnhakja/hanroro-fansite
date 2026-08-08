import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type {
  SongChartItem,
  SongChartResponse,
  SetlistStatItem,
  SetlistStatsResponse,
} from '@/types/api/song';
export type {
  SongChartItem,
  SongChartResponse,
  SetlistStatItem,
  SetlistStatsResponse,
};

// ─── 공개 훅 ─────────────────────────────────────────────────────
// 실시간 팬 최애곡: 30초마다 폴링(탭이 보일 때만)
export function useSongChart() {
  return useQuery({
    queryKey: queryKeys.songs.chart,
    queryFn: async () => {
      const res = await fetch('/api/songs/chart');
      if (!res.ok) throw new Error('곡 차트를 불러올 수 없습니다');
      return (await res.json()) as SongChartResponse;
    },
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    staleTime: 25_000,
  });
}

// 무대 최다 셋리스트: 셋리스트가 바뀔 때만 갱신되므로 오래 캐시
export function useSetlistStats() {
  return useQuery({
    queryKey: queryKeys.songs.setlistStats,
    queryFn: async () => {
      const res = await fetch('/api/songs/setlist-stats');
      if (!res.ok) throw new Error('셋리스트 집계를 불러올 수 없습니다');
      return (await res.json()) as SetlistStatsResponse;
    },
    staleTime: 5 * 60_000,
  });
}
