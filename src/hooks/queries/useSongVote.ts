import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type { SongChartResponse } from '@/types/api/song';

export interface MyVote {
  songTitle: string | null;
}

// 내 현재 최애곡 픽 (쿠키 기반)
export function useMyVote() {
  return useQuery({
    queryKey: queryKeys.songs.myVote,
    queryFn: async () => {
      const res = await fetch('/api/songs/vote');
      if (!res.ok) throw new Error('내 투표를 불러올 수 없습니다');
      return (await res.json()) as MyVote;
    },
    staleTime: 60_000,
  });
}

// 투표/변경/취소 — 서버 응답 전에 화면을 먼저 갱신(낙관적)하고, 실패 시 롤백
export function useVoteSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (songTitle: string) => {
      const res = await fetch('/api/songs/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songTitle }),
      });
      if (!res.ok) throw new Error('투표에 실패했습니다');
      return (await res.json()) as MyVote;
    },
    onMutate: async (songTitle) => {
      await qc.cancelQueries({ queryKey: queryKeys.songs.myVote });
      await qc.cancelQueries({ queryKey: queryKeys.songs.chart });

      const prevMy = qc.getQueryData<MyVote>(queryKeys.songs.myVote);
      const prevChart = qc.getQueryData<SongChartResponse>(queryKeys.songs.chart);

      const currentPick = prevMy?.songTitle ?? null;
      const newPick = currentPick === songTitle ? null : songTitle; // 같은 곡 재클릭 = 취소

      qc.setQueryData<MyVote>(queryKeys.songs.myVote, { songTitle: newPick });

      if (prevChart) {
        const songs = prevChart.songs
          .map((s) => {
            let count = s.count;
            if (currentPick && s.songTitle === currentPick) count -= 1;
            if (newPick && s.songTitle === newPick) count += 1;
            return { ...s, count };
          })
          .sort((a, b) => b.count - a.count);
        const delta = (newPick ? 1 : 0) - (currentPick ? 1 : 0);
        qc.setQueryData<SongChartResponse>(queryKeys.songs.chart, {
          ...prevChart,
          songs,
          totalVotes: prevChart.totalVotes + delta,
        });
      }

      return { prevMy, prevChart };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevMy) qc.setQueryData(queryKeys.songs.myVote, ctx.prevMy);
      if (ctx?.prevChart) qc.setQueryData(queryKeys.songs.chart, ctx.prevChart);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.songs.myVote });
      qc.invalidateQueries({ queryKey: queryKeys.songs.chart });
    },
  });
}
