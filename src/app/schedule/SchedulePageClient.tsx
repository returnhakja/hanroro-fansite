"use client";

import { useReducedMotion } from "framer-motion";
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
} from "./Schedule.styles";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";

const SchedulePageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const { data, isLoading: loading } = useUpcomingEvents();

  const upcomingEvents = (data || [])
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 3);

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
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
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
    </Container>
  );
};

export default SchedulePageClient;
