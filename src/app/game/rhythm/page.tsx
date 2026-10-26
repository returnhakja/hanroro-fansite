import type { Metadata } from "next";
import RhythmGameClient from "./RhythmGameClient";

const BASE_URL = "https://www.hanroro.co.kr";

export const metadata: Metadata = {
  title: "로로비트",
  description: "노래에 맞춰 떨어지는 노트를 정확한 타이밍에 눌러보세요.",
  keywords: ["한로로", "HANRORO", "로로비트", "리듬게임", "게임", "랭킹"],
  openGraph: {
    title: "로로비트 | 한로로 팬사이트",
    description: "노래에 맞춰 떨어지는 노트를 정확한 타이밍에 눌러보세요.",
    url: `${BASE_URL}/game/rhythm`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/game/rhythm`,
  },
};

export default function RhythmGamePage() {
  return <RhythmGameClient />;
}
