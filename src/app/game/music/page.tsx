import type { Metadata } from "next";
import GameClient from "./GameClient";

const BASE_URL = "https://www.hanroro.co.kr";

export const metadata: Metadata = {
  title: "음악 맞추기",
  description:
    "한로로의 곡을 짧은 스니펫만 듣고 맞춰보세요. 난이도별로 랭킹이 따로 집계돼요.",
  keywords: ["한로로", "HANRORO", "음악 맞추기", "노래 맞추기", "게임", "랭킹"],
  openGraph: {
    title: "음악 맞추기 | 한로로 팬사이트",
    description: "한로로의 곡을 짧은 스니펫만 듣고 맞춰보세요.",
    url: `${BASE_URL}/game/music`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/game/music`,
  },
};

export default function GamePage() {
  return <GameClient />;
}
