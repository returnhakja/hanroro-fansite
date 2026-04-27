"use client";

import { useState, useEffect, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import EventCalendar from "@/components/ui/EventCalendar";
import {
  Container,
  SectionHeader,
  SectionTitle,
  SectionMore,
  UpcomingSection,
  UpcomingGrid,
  EventCard,
  EventPoster,
  DdayBadge,
  EventContent,
  EventType,
  EventTitle,
  EventDetails,
  EventDetail,
  CalendarRow,
  CalendarSection,
  CalendarHeader,
  CalendarTitle,
  ScheduleSidebar,
  SidebarCard,
  SidebarTitle,
  DdayCountdown,
  DdayLabel,
  DdayHeadline,
  DdayEventTitle,
  DdayEventMeta,
  MiniEventList,
  MiniEventItem,
  MiniEventInfo,
  MiniEventTitle,
  MiniEventDate,
  MiniDday,
  EmptyMessage,
  PastSection,
  PastGrid,
  PastConcertCard,
  PastPoster,
  SetlistBadge,
  PastConcertContent,
  PastConcertTitle,
  PastConcertDate,
  RelatedSection,
  RelatedIntro,
  RelatedLinkGrid,
  RelatedDeepLink,
  RelatedDeepTitle,
  RelatedDeepDesc,
} from "./Schedule.styles";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";
import { useConcerts } from "@/hooks/queries/useConcerts";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// ─── 인라인 아이콘 (의존성 추가 없이 lucide 스타일) ─────────────────
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
const IconClock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
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

const SchedulePageClient = () => {
  const prefersReducedMotion = useReducedMotion();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data, isLoading: loading } = useUpcomingEvents();
  const { data: concerts = [] } = useConcerts();

  useEffect(() => {
    setShouldReduceMotion(prefersReducedMotion ?? false);
    setMounted(true);
  }, [prefersReducedMotion]);

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

  const upcomingEvents = allUpcoming.slice(0, 3);
  const featured = allUpcoming[0];
  const sidebarList = allUpcoming.slice(0, 6);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pastConcerts = concerts
    .filter((c) => new Date(c.endDate) < today && !c.isActive)
    .sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
    )
    .slice(0, 6);

  const calcDaysUntil = (dateString: string): number => {
    const baseToday = new Date();
    const eventDate = new Date(dateString);
    baseToday.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - baseToday.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "concert":
        return "콘서트";
      case "fanmeeting":
        return "팬미팅";
      case "broadcast":
        return "방송";
      case "festival":
        return "페스티벌";
      case "award":
        return "시상식";
      default:
        return "기타";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = WEEKDAYS[date.getDay()];
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} (${weekday})`;
  };

  const openEventDetail = (id: string) => {
    router.push(`/schedule?event=${id}`, { scroll: false });
  };

  const featuredDday =
    featured && mounted ? calcDaysUntil(featured.date) : null;

  return (
    <Container>

      {/* ────── Upcoming ────── */}
      <UpcomingSection id="upcoming">
        <SectionHeader>
          <SectionTitle>다가오는 공연</SectionTitle>
        </SectionHeader>
        {loading ? (
          <EmptyMessage>로딩 중...</EmptyMessage>
        ) : upcomingEvents.length > 0 ? (
          <UpcomingGrid>
            {upcomingEvents.map((event, index) => {
              const daysUntil = mounted ? calcDaysUntil(event.date) : null;
              return (
                <EventCard
                  key={event._id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => openEventDetail(event._id)}
                  style={{ cursor: "pointer" }}
                >
                  <EventPoster $posterUrl={event.posterUrl}>
                    {daysUntil !== null && (
                      <DdayBadge $isToday={daysUntil === 0}>
                        {daysUntil === 0 ? "D-DAY" : `D-${daysUntil}`}
                      </DdayBadge>
                    )}
                  </EventPoster>
                  <EventContent>
                    <EventType type={event.type}>
                      {getEventTypeLabel(event.type)}
                    </EventType>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDetails>
                      {event.place && (
                        <EventDetail>
                          <IconPin />
                          <span>{event.place}</span>
                        </EventDetail>
                      )}
                      <EventDetail>
                        <IconCalendar />
                        <span>
                          {formatDate(event.date)}
                          {event.time ? ` ${event.time}` : ""}
                        </span>
                      </EventDetail>
                    </EventDetails>
                  </EventContent>
                </EventCard>
              );
            })}
          </UpcomingGrid>
        ) : (
          <EmptyMessage>다가오는 공연이 없습니다</EmptyMessage>
        )}
      </UpcomingSection>

      {/* ────── Calendar + Sidebar ────── */}
      <CalendarRow id="calendar">
        <CalendarSection>
          <CalendarHeader>
            <CalendarTitle>전체 일정</CalendarTitle>
          </CalendarHeader>
          <EventCalendar />
        </CalendarSection>

        <ScheduleSidebar>
          <SidebarCard>
            <SidebarTitle>D-day 카운트다운</SidebarTitle>
            {featured && featuredDday !== null ? (
              <DdayCountdown>
                <DdayLabel>다음 공연까지</DdayLabel>
                <DdayHeadline>
                  {featuredDday === 0 ? "D-DAY" : `D-${featuredDday}`}
                </DdayHeadline>
                <DdayEventTitle>{featured.title}</DdayEventTitle>
                <DdayEventMeta>{formatDate(featured.date)}</DdayEventMeta>
              </DdayCountdown>
            ) : (
              <DdayCountdown>
                <DdayLabel>예정된 공연 없음</DdayLabel>
                <DdayEventMeta>새로운 일정을 기다려 주세요</DdayEventMeta>
              </DdayCountdown>
            )}
          </SidebarCard>

          <SidebarCard>
            <SidebarTitle>다가오는 일정</SidebarTitle>
            {sidebarList.length > 0 ? (
              <MiniEventList>
                {sidebarList.map((event) => {
                  const d = mounted ? calcDaysUntil(event.date) : null;
                  return (
                    <MiniEventItem
                      key={event._id}
                      onClick={() => openEventDetail(event._id)}
                    >
                      <MiniEventInfo>
                        <MiniEventTitle>{event.title}</MiniEventTitle>
                        <MiniEventDate>{formatDate(event.date)}</MiniEventDate>
                      </MiniEventInfo>
                      {d !== null && (
                        <MiniDday $isToday={d === 0}>
                          {d === 0 ? "D-DAY" : `D-${d}`}
                        </MiniDday>
                      )}
                    </MiniEventItem>
                  );
                })}
              </MiniEventList>
            ) : (
              <DdayEventMeta>등록된 일정이 없습니다</DdayEventMeta>
            )}
          </SidebarCard>
        </ScheduleSidebar>
      </CalendarRow>

      {/* ────── Past ────── */}
      {pastConcerts.length > 0 && (
        <PastSection id="past">
          <SectionHeader>
            <SectionTitle>지난 공연</SectionTitle>
            <SectionMore href="/setlist">
              더보기 <IconArrow />
            </SectionMore>
          </SectionHeader>
          <PastGrid>
            {pastConcerts.map((concert, index) => {
              const hasSetlist = (concert.setlists?.length ?? 0) > 0;
              return (
                <PastConcertCard
                  key={concert._id}
                  $hasSetlist={hasSetlist}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => {
                    if (hasSetlist) {
                      router.push(`/setlist?concertId=${concert._id}`);
                    }
                  }}
                >
                  <PastPoster $posterUrl={concert.posterUrl}>
                    {hasSetlist && <SetlistBadge>셋리스트 보기 →</SetlistBadge>}
                  </PastPoster>
                  <PastConcertContent>
                    <PastConcertTitle>{concert.title}</PastConcertTitle>
                    <PastConcertDate>
                      <IconCalendar />
                      {formatDate(concert.endDate)}
                    </PastConcertDate>
                  </PastConcertContent>
                </PastConcertCard>
              );
            })}
          </PastGrid>
        </PastSection>
      )}

      <RelatedSection aria-labelledby="related-heading">
        <SectionHeader>
          <SectionTitle id="related-heading">이어서 보기</SectionTitle>
        </SectionHeader>
        <RelatedIntro>
          공연 날짜를 확인했다면, 셋리스트와 팬들이 올린 현장 사진도 함께 둘러보세요.
        </RelatedIntro>
        <RelatedLinkGrid>
          <RelatedDeepLink href="/setlist">
            <RelatedDeepTitle>셋리스트</RelatedDeepTitle>
            <RelatedDeepDesc>지난 공연의 곡 목록을 공연별로 모아 보세요.</RelatedDeepDesc>
          </RelatedDeepLink>
          <RelatedDeepLink href="/chronicle">
            <RelatedDeepTitle>연대기</RelatedDeepTitle>
            <RelatedDeepDesc>한로로의 활동을 연도별 타임라인으로 돌아보세요.</RelatedDeepDesc>
          </RelatedDeepLink>
          <RelatedDeepLink href="/gallery">
            <RelatedDeepTitle>포토 갤러리</RelatedDeepTitle>
            <RelatedDeepDesc>현장 분위기를 사진으로 다시 느껴 보세요.</RelatedDeepDesc>
          </RelatedDeepLink>
        </RelatedLinkGrid>

      </RelatedSection>
    </Container>
  );
};

export default SchedulePageClient;
