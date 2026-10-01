import type { Metadata } from "next";
import ConcertRankingClient from "./ConcertRankingClient";

const BASE_URL = "https://www.hanroro.co.kr";

export const metadata: Metadata = {
  title: "공연 맞추기 게임 랭킹",
  description: "공연 맞추기 게임 전체 랭킹을 확인해보세요.",
  openGraph: {
    title: "공연 맞추기 게임 랭킹 | 한로로 팬사이트",
    description: "공연 맞추기 게임 전체 랭킹을 확인해보세요.",
    url: `${BASE_URL}/game/concert/ranking`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/game/concert/ranking`,
  },
};

export default function ConcertRankingPage() {
  return <ConcertRankingClient />;
}
