// 팬 최애곡 차트 API 타입

export interface SongChartItem {
  songTitle: string;
  album: string;
  albumImageUrl: string;
  count: number;
}

export interface SongChartResponse {
  songs: SongChartItem[];
  totalVotes: number;
  updatedAt: string;
}

// 무대 최다 셋리스트 차트 (객관 데이터)
export interface SetlistStatItem {
  songTitle: string;
  album: string;
  albumImageUrl: string | null;
  count: number; // 등장한 공연 수
  pct: number; // 등장률(%)
  tag: string; // 매 공연 / 오프닝 단골 / 피날레 단골 / 셋리스트 단골 / ''
}

export interface SetlistStatsResponse {
  songs: SetlistStatItem[];
  totalShows: number;
}
