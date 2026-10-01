import type { Metadata } from "next";
import ConcertGameClient from "./ConcertGameClient";

const BASE_URL = "https://www.hanroro.co.kr";

export const metadata: Metadata = {
  title: "공연 맞추기 게임",
  description: "무대 사진 한 장으로 공연 날짜와 장소를 맞혀보세요.",
  keywords: ["한로로", "HANRORO", "공연", "날짜 맞추기", "게임", "랭킹"],
  openGraph: {
    title: "공연 맞추기 게임 | 한로로 팬사이트",
    description: "무대 사진 한 장으로 공연 날짜와 장소를 맞혀보세요.",
    url: `${BASE_URL}/game/concert`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/game/concert`,
  },
};

export default function ConcertGamePage() {
  return <ConcertGameClient />;
}
