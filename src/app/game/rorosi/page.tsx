import type { Metadata } from "next";
import RorosiClient from "./RorosiClient";

const BASE_URL = "https://www.hanroro.co.kr";

export const metadata: Metadata = {
  title: "로로시 게임",
  description: "스톱워치를 11.11초에 최대한 가깝게 멈춰보세요.",
  keywords: ["한로로", "HANRORO", "로로시", "11:11", "게임", "랭킹"],
  openGraph: {
    title: "로로시 게임 | 한로로 팬사이트",
    description: "스톱워치를 11.11초에 최대한 가깝게 멈춰보세요.",
    url: `${BASE_URL}/game/rorosi`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/game/rorosi`,
  },
};

export default function RorosiPage() {
  return <RorosiClient />;
}
