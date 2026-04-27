"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";
import { HomeHeroQuickRoot } from "./HomeHeroQuick.styles";
import {
  HeroSection,
  HeroBackground,
  HeroInner,
  HeroCopy,
  HeroOverline,
  HeroTitle,
  HeroSubtitle,
  HeroCTA,
  FeaturedCard,
  FeaturedHeader,
  FeaturedLabel,
  FeaturedBadge,
  FeaturedPoster,
  FeaturedTitle,
  FeaturedMeta,
  FeaturedCTAButton,
  QuickNavBar,
  QuickTile,
  QuickTileIcon,
  QuickTileText,
  QuickTileTitle,
  QuickTileSub,
} from "@/app/schedule/Schedule.styles";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const IconCalendar = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconPin = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const IconMic = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
  </svg>
);
const IconImage = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);
const IconHistory = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export default function HomeHeroQuick() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data } = useUpcomingEvents();

  useEffect(() => {
    setMounted(true);
  }, []);

  const allUpcoming = useMemo(
    () =>
      (data || [])
        .filter(
          (e) => new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)),
        )
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
    [data],
  );

  const featured = allUpcoming[0];

  const calcDaysUntil = (dateString: string): number => {
    const baseToday = new Date();
    const eventDate = new Date(dateString);
    baseToday.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - baseToday.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = WEEKDAYS[date.getDay()];
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} (${weekday})`;
  };

  const featuredDday =
    featured && mounted ? calcDaysUntil(featured.date) : null;

  const openEventDetail = (id: string) => {
    router.push(`/schedule?event=${id}`);
  };

  return (
    <HomeHeroQuickRoot>
      <HeroSection>
        <HeroBackground $posterUrl={featured?.posterUrl} />
        <HeroInner>
          <HeroCopy>
            <HeroOverline>HANRORO</HeroOverline>
            <HeroTitle>
              공연이 주는 가슴 벅찬
              <br />
              감동을 함께해요
            </HeroTitle>
            <HeroSubtitle>
              다가오는 공연과 지난 순간들을 한 곳에서 만나보세요.
              <br />
              한로로의 모든 일정을 팬과 함께 기록합니다.
            </HeroSubtitle>
            <HeroCTA href="/schedule">
              일정 보러가기 <IconArrow />
            </HeroCTA>
          </HeroCopy>

          {featured ? (
            <FeaturedCard>
              <FeaturedHeader>
                <FeaturedLabel>다가오는 공연</FeaturedLabel>
                {featuredDday !== null && (
                  <FeaturedBadge $isToday={featuredDday === 0}>
                    {featuredDday === 0 ? "D-DAY" : `D-${featuredDday}`}
                  </FeaturedBadge>
                )}
              </FeaturedHeader>
              <FeaturedPoster $posterUrl={featured.posterUrl} />
              <FeaturedTitle>{featured.title}</FeaturedTitle>
              <FeaturedMeta>
                {featured.place && (
                  <span>
                    <IconPin /> {featured.place}
                  </span>
                )}
                <span>
                  <IconCalendar /> {formatDate(featured.date)}
                  {featured.time ? ` ${featured.time}` : ""}
                </span>
              </FeaturedMeta>
              <FeaturedCTAButton
                type="button"
                onClick={() => openEventDetail(featured._id)}
                aria-label="일정 상세 보기"
              >
                자세히 보기
              </FeaturedCTAButton>
            </FeaturedCard>
          ) : (
            <FeaturedCard>
              <FeaturedHeader>
                <FeaturedLabel>안내</FeaturedLabel>
              </FeaturedHeader>
              <FeaturedTitle>다가오는 공연이 준비 중입니다</FeaturedTitle>
              <FeaturedMeta>
                <span>새 일정이 등록되면 이곳에서 가장 먼저 안내드릴게요.</span>
              </FeaturedMeta>
              <FeaturedCTAButton
                type="button"
                onClick={() => router.push("/schedule")}
              >
                일정 페이지로 이동
              </FeaturedCTAButton>
            </FeaturedCard>
          )}
        </HeroInner>
      </HeroSection>

      <QuickNavBar>
        <QuickTile href="/schedule#calendar">
          <QuickTileIcon>
            <IconCalendar />
          </QuickTileIcon>
          <QuickTileText>
            <QuickTileTitle>전체 일정</QuickTileTitle>
            <QuickTileSub>한눈에 보기</QuickTileSub>
          </QuickTileText>
        </QuickTile>
        <QuickTile href="/schedule#past">
          <QuickTileIcon>
            <IconHistory />
          </QuickTileIcon>
          <QuickTileText>
            <QuickTileTitle>지난 공연</QuickTileTitle>
            <QuickTileSub>추억 다시 보기</QuickTileSub>
          </QuickTileText>
        </QuickTile>
        <QuickTile href="/fanchant">
          <QuickTileIcon>
            <IconMic />
          </QuickTileIcon>
          <QuickTileText>
            <QuickTileTitle>응원법</QuickTileTitle>
            <QuickTileSub>함께 응원해요</QuickTileSub>
          </QuickTileText>
        </QuickTile>
        <QuickTile href="/gallery">
          <QuickTileIcon>
            <IconImage />
          </QuickTileIcon>
          <QuickTileText>
            <QuickTileTitle>포토갤러리</QuickTileTitle>
            <QuickTileSub>사진 모아보기</QuickTileSub>
          </QuickTileText>
        </QuickTile>
      </QuickNavBar>
    </HomeHeroQuickRoot>
  );
}
