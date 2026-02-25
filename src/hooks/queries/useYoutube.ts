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
