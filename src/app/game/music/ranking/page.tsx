import type { Metadata } from "next";
import RankingClient from "./RankingClient";

const BASE_URL = "https://www.hanroro.co.kr";

export const metadata: Metadata = {
  title: "음악 맞추기 랭킹",
  description: "한로로 음악 맞추기 게임의 난이도별 랭킹을 확인하세요.",
  openGraph: {
    title: "음악 맞추기 랭킹 | 한로로 팬사이트",
    description: "한로로 음악 맞추기 게임의 난이도별 랭킹을 확인하세요.",
    url: `${BASE_URL}/game/music/ranking`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/game/music/ranking`,
  },
};

export default function RankingPage() {
  return <RankingClient />;
}
