import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오프라인",
  description: "네트워크 연결이 필요합니다",
};

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 400,
          color: "#2C2418",
          letterSpacing: "0.01em",
        }}
      >
        오프라인입니다
      </h1>
      <p
        style={{
          fontSize: "1rem",
          color: "#7A6E5D",
          lineHeight: 1.75,
          maxWidth: 480,
        }}
      >
        인터넷 연결을 확인해주세요.
        <br />
        이미 둘러본 페이지는 연결 없이도 다시 볼 수 있어요.
      </p>
    </main>
  );
}
