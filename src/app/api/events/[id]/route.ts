import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Event from "@/lib/db/models/Event";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const event = await Event.findById(id).lean();
    if (!event) {
      return NextResponse.json(
        { error: "이벤트를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("이벤트 조회 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 불러오는 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
