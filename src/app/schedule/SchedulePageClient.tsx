"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import EventCalendar from "@/components/EventCalendar";
import {
  Container,
  UpcomingSection,
  SectionTitle,
  UpcomingGrid,
  EventCard,
  EventPoster,
  DdayBadge,
  EventContent,
  EventType,
  EventTitle,
  EventDetails,
  EventDetail,
  CalendarSection,
  EmptyMessage,
  PastSection,
  PastGrid,
  PastConcertCard,
  PastPoster,
  SetlistBadge,
  PastConcertContent,
  PastConcertTitle,
  PastConcertDate,
} from "./Schedule.styles";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";
import { useConcerts } from "@/hooks/queries/useConcerts";

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const SchedulePageClient = () => {
  const prefersReducedMotion = useReducedMotion();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const router = useRouter();
  const { data, isLoading: loading } = useUpcomingEvents();
  const { data: concerts = [] } = useConcerts();

  useEffect(() => {
    setShouldReduceMotion(prefersReducedMotion ?? false);
  }, [prefersReducedMotion]);

  const upcomingEvents = (data || [])
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 3);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pastConcerts = concerts
    .filter((c) => new Date(c.endDate) < today && !c.isActive)
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

  const calcDaysUntil = (dateString: string): number => {
    const today = new Date();
    const eventDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
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
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  return (
    <Container>
      {/* <PageTitle>일정</PageTitle>
      <PageSubtitle>한로로의 다가오는 일정을 확인하세요</PageSubtitle> */}

      <UpcomingSection>
        <SectionTitle>다가오는 공연</SectionTitle>
        {loading ? (
          <EmptyMessage>로딩 중...</EmptyMessage>
        ) : upcomingEvents.length > 0 ? (
          <UpcomingGrid>
            {upcomingEvents.map((event, index) => {
              const daysUntil = calcDaysUntil(event.date);
              return (
                <EventCard
                  key={event._id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventPoster $posterUrl={event.posterUrl}>
                    <DdayBadge $isToday={daysUntil === 0}>
                      {daysUntil === 0 ? "D-DAY" : `D-${daysUntil}`}
                    </DdayBadge>
                  </EventPoster>
                  <EventContent>
                    <EventType type={event.type}>
                      {getEventTypeLabel(event.type)}
                    </EventType>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDetails>
                      <EventDetail>
                        <strong>날짜</strong>
                        <span>{formatDate(event.date)}</span>
                      </EventDetail>
                      {event.time && (
                        <EventDetail>
                          <strong>시간</strong>
                          <span>{event.time}</span>
                        </EventDetail>
                      )}
                      {event.place && (
                        <EventDetail>
                          <strong>장소</strong>
                          <span>{event.place}</span>
                        </EventDetail>
                      )}
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

      <CalendarSection>
        <SectionTitle>전체 일정</SectionTitle>
        <EventCalendar />
      </CalendarSection>

      {pastConcerts.length > 0 && (
        <PastSection>
          <SectionTitle>지난 공연</SectionTitle>
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
                    <PastConcertDate>{formatDate(concert.endDate)}</PastConcertDate>
                  </PastConcertContent>
                </PastConcertCard>
              );
            })}
          </PastGrid>
        </PastSection>
      )}
    </Container>
  );
};

export default SchedulePageClient;
