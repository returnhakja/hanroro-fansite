import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import Concert from "@/lib/db/models/Concert";

/**
 * 공연 포스터 이미지를 공개 URL로 서빙
 * - posterUrl은 DB에 base64 data URI로 저장됨 → 카카오 공유 등 외부 스크랩이 불가능
 * - 이 라우트가 data URI를 디코드해 실제 이미지 바이트로 응답하여 공유 썸네일로 사용 가능하게 함
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
    }

    await connectDB();
    const concert = await Concert.findById(id).select("posterUrl").lean<{
      posterUrl?: string;
    }>();

    const poster = concert?.posterUrl;
    if (!poster) {
      return NextResponse.json({ error: "포스터가 없습니다" }, { status: 404 });
    }

    // data:image/jpeg;base64,XXXX 형태 파싱
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/.exec(poster);
    if (!match) {
      // 이미 http(s) URL이면 그대로 리다이렉트
      if (/^https?:\/\//.test(poster)) {
        return NextResponse.redirect(poster);
      }
      return NextResponse.json(
        { error: "지원하지 않는 이미지 형식입니다" },
        { status: 415 },
      );
    }

    const [, mimeType, base64] = match;
    const buffer = Buffer.from(base64, "base64");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.length),
        // 카카오 스크랩 캐시 + CDN 캐시
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
      },
    });
  } catch (error) {
    console.error("포스터 서빙 오류:", error);
    return NextResponse.json(
      { error: "포스터를 불러오는 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
