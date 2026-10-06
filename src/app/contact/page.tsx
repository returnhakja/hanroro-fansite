import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

// 레이아웃의 title/description은 유지하고, canonical만 이 세그먼트(/contact)로 지정한다.
// (지정 안 하면 루트 레이아웃의 canonical "/" 이 그대로 상속돼 홈페이지로 잡힌다)
export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.hanroro.co.kr/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
