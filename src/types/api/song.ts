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
