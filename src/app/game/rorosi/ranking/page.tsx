import type { Metadata } from "next";
import RorosiRankingClient from "./RorosiRankingClient";

const BASE_URL = "https://www.hanroro.co.kr";

export const metadata: Metadata = {
  title: "로로시 게임 랭킹",
  description: "한로로 로로시 게임의 랭킹을 확인하세요.",
  openGraph: {
    title: "로로시 게임 랭킹 | 한로로 팬사이트",
    description: "한로로 로로시 게임의 랭킹을 확인하세요.",
    url: `${BASE_URL}/game/rorosi/ranking`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/game/rorosi/ranking`,
  },
};

export default function RorosiRankingPage() {
  return <RorosiRankingClient />;
}
