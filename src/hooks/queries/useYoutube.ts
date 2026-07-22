import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export interface YoutubeVideo {
  id: string;
  title: string;
}

export function useYoutubeVideos() {
  return useQuery({
    queryKey: queryKeys.youtube.videos,
    queryFn: async () => {
      const res = await fetch("/api/youtube/videos");
      if (!res.ok) throw new Error("유튜브 영상을 불러올 수 없습니다");
      const data = await res.json();
      return (data.items || []).map((item: any) => ({
        id: item.id.videoId as string,
        title: item.snippet.title as string,
      })) as YoutubeVideo[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export interface YoutubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
}

// 채널의 재생목록(카테고리) 목록 — 비어있는 재생목록은 제외
export function useYoutubePlaylists() {
  return useQuery({
    queryKey: queryKeys.youtube.playlists,
    queryFn: async () => {
      const res = await fetch("/api/youtube/playlists");
      if (!res.ok) throw new Error("재생목록을 불러올 수 없습니다");
      const data = await res.json();
      return (data.items || [])
        .map((item: any) => ({
          id: item.id as string,
          title: item.snippet.title as string,
          description: (item.snippet.description ?? "") as string,
          thumbnail: (item.snippet.thumbnails?.medium?.url ||
            item.snippet.thumbnails?.default?.url ||
            "") as string,
          itemCount: (item.contentDetails?.itemCount ?? 0) as number,
        }))
        .filter((p: YoutubePlaylist) => p.itemCount > 0) as YoutubePlaylist[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export interface YoutubePlaylistItem {
  id: string;
  title: string;
  thumbnail: string;
}

// playlistItems 응답을 공통 형태로 매핑 — 비공개/삭제된 영상은 제외
function mapPlaylistItems(items: any[]): YoutubePlaylistItem[] {
  return (items || [])
    .map((item: any) => {
      const videoId: string =
        item.contentDetails?.videoId || item.snippet?.resourceId?.videoId || "";
      return {
        id: videoId,
        title: item.snippet.title as string,
        thumbnail: (item.snippet.thumbnails?.medium?.url ||
          (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "")) as string,
      };
    })
    .filter(
      (v: YoutubePlaylistItem) =>
        v.id && v.title !== "Private video" && v.title !== "Deleted video",
    );
}

// 특정 재생목록의 영상 목록 — 비공개/삭제된 영상은 제외
export function useYoutubePlaylistItems(playlistId: string) {
  return useQuery({
    queryKey: queryKeys.youtube.playlistItems(playlistId),
    queryFn: async () => {
      const res = await fetch(`/api/youtube/playlists/${playlistId}`);
      if (!res.ok) throw new Error("영상을 불러올 수 없습니다");
      const data = await res.json();
      return mapPlaylistItems(data.items);
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!playlistId,
  });
}

// 채널 업로드 전체 중 제목에 키워드가 포함된 영상 목록
export function useYoutubeKeywordVideos(keyword: string) {
  return useQuery({
    queryKey: queryKeys.youtube.keyword(keyword),
    queryFn: async () => {
      const res = await fetch(`/api/youtube/search?keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error("영상을 불러올 수 없습니다");
      const data = await res.json();
      return mapPlaylistItems(data.items);
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!keyword,
  });
}
