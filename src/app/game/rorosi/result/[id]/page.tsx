import type { Metadata } from "next";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import LorosiResult from "@/lib/db/models/LorosiResult";
import type { RorosiResultDetail } from "@/types/api/rorosi";
import ResultClient from "./ResultClient";

const BASE_URL = "https://www.hanroro.co.kr";

async function getResult(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  return LorosiResult.findById(id).lean();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const canonical = `${BASE_URL}/game/rorosi/result/${id}`;

  const result = await getResult(id);
  if (!result) {
    return {
      title: "결과를 찾을 수 없습니다",
      alternates: { canonical },
      robots: { index: false, follow: true },
    };
  }

  const diffSec = (result.diffMs / 1000).toFixed(2);
  const description = `${result.nickname}님이 11.11초에서 ${diffSec}초 차이로 멈췄어요. 나도 도전해보세요!`;

  return {
    title: `${result.nickname}님의 로로시 게임 결과`,
    description,
    openGraph: {
      title: "한로로 로로시 게임",
      description,
      url: canonical,
      type: "website",
    },
    alternates: { canonical },
  };
}

export default async function RorosiResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  let initialData: RorosiResultDetail | undefined;
  if (result) {
    initialData = {
      _id: (result._id as { toString(): string }).toString(),
      nickname: result.nickname,
      elapsedMs: result.elapsedMs,
      diffMs: result.diffMs,
      createdAt: result.createdAt.toISOString(),
    };
  }

  return <ResultClient id={id} initialData={initialData} />;
}
