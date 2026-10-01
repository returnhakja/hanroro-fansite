import type { Metadata } from "next";
import {
  HubWrapper,
  HubHeader,
  HubTitle,
  HubSub,
  GameGrid,
  GameCard,
  GameIcon,
  GameName,
  GameDesc,
} from "./GameHub.styles";

const BASE_URL = "https://www.hanroro.co.kr";

export const metadata: Metadata = {
  title: "게임",
  description: "한로로 팬사이트의 미니게임을 즐겨보세요.",
  openGraph: {
    title: "게임 | 한로로 팬사이트",
    description: "한로로 팬사이트의 미니게임을 즐겨보세요.",
    url: `${BASE_URL}/game`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/game`,
  },
};

const IconMusic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const IconTimer = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l3 2M9 2h6" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export default function GameHubPage() {
  return (
    <HubWrapper>
      <HubHeader>
        <HubTitle>게임</HubTitle>
        <HubSub>즐기고 싶은 게임을 골라보세요</HubSub>
      </HubHeader>
      <GameGrid>
        <GameCard href="/game/music">
          <GameIcon><IconMusic /></GameIcon>
          <GameName>음악 맞추기</GameName>
          <GameDesc>짧은 스니펫만 듣고 곡 제목을 맞춰보세요. 난이도별 랭킹.</GameDesc>
        </GameCard>
        <GameCard href="/game/rorosi">
          <GameIcon><IconTimer /></GameIcon>
          <GameName>로로시 게임</GameName>
          <GameDesc>스톱워치를 11.11초에 가장 가깝게 멈춰보세요.</GameDesc>
        </GameCard>
        <GameCard href="/game/concert">
          <GameIcon><IconCalendar /></GameIcon>
          <GameName>공연 맞추기</GameName>
          <GameDesc>무대 사진으로 공연 날짜와 장소를 맞혀보세요.</GameDesc>
        </GameCard>
      </GameGrid>
    </HubWrapper>
  );
}
