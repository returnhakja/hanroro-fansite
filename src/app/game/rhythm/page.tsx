import type { Metadata } from "next";
import RhythmGameClient from "./RhythmGameClient";

// 비공개 테스트 단계: 게임 허브/사이트맵에 올리지 않고 관리자 페이지 링크로만 접근한다.
export const metadata: Metadata = {
  title: "로로비트 (테스트)",
  robots: { index: false, follow: false },
};

export default function RhythmGamePage() {
  return <RhythmGameClient />;
}
