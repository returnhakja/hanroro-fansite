import type { Metadata } from "next";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import GameResult from "@/lib/db/models/GameResult";
import { DIFFICULTY_LABEL, QUESTIONS_PER_ROUND } from "@/lib/game/difficulty";
import type { GameResultDetail, GameDifficulty } from "@/types/api/game";
import ResultClient from "./ResultClient";

const BASE_URL = "https://www.hanroro.co.kr";

async function getResult(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  return GameResult.findById(id).lean();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const canonical = `${BASE_URL}/game/music/result/${id}`;

  const result = await getResult(id);
  if (!result) {
    return {
      title: "결과를 찾을 수 없습니다",
      alternates: { canonical },
      robots: { index: false, follow: true },
    };
  }

  const label = DIFFICULTY_LABEL[result.difficulty as GameDifficulty];
  const description = `${result.nickname}님이 ${label} 난이도에서 ${result.score}/${QUESTIONS_PER_ROUND}점을 받았어요. 나도 도전해보세요!`;

  return {
    title: `${result.nickname}님의 음악 맞추기 결과`,
    description,
    openGraph: {
      title: "한로로 음악 맞추기",
      description,
      url: canonical,
      type: "website",
    },
    alternates: { canonical },
    // 플레이할 때마다 계속 생기는 1인용 결과 페이지라 검색 색인은 막는다
    // (카카오톡 공유는 og 메타만 보고 가져가므로 색인 여부와 무관하게 그대로 동작함)
    robots: { index: false, follow: true },
  };
}

export default async function GameResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  let initialData: GameResultDetail | undefined;
  if (result) {
    initialData = {
      _id: (result._id as { toString(): string }).toString(),
      nickname: result.nickname,
      difficulty: result.difficulty as GameDifficulty,
      score: result.score,
      elapsedMs: result.elapsedMs,
      createdAt: result.createdAt.toISOString(),
    };
  }

  return <ResultClient id={id} initialData={initialData} />;
}
