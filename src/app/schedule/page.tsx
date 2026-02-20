'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import EventCalendar from '@/components/EventCalendar';
import {
  Container,
  PageTitle,
  PageSubtitle,
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
} from './Schedule.styles';

interface Event {
  _id: string;
  title: string;
  date: string;
  time?: string;
  place?: string;
  posterUrl?: string;
  type: string;
  isPinned: boolean;
}

const SchedulePage = () => {
  const shouldReduceMotion = useReducedMotion();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysUntil, setDaysUntil] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events/upcoming');
        const data = await res.json();

        const futureEvents = (data.events || [])
          .filter((event: Event) => new Date(event.date) >= new Date())
          .slice(0, 3);

        setUpcomingEvents(futureEvents);

        // D-day 계산
        const daysMap: { [key: string]: number } = {};
        futureEvents.forEach((event: Event) => {
          const today = new Date();
          const eventDate = new Date(event.date);
          today.setHours(0, 0, 0, 0);
          eventDate.setHours(0, 0, 0, 0);
          const diffTime = eventDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          daysMap[event._id] = diffDays;
        });
        setDaysUntil(daysMap);
      } catch (err) {
        console.error('일정 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'concert': return '콘서트';
      case 'fanmeeting': return '팬미팅';
      case 'broadcast': return '방송';
      case 'festival': return '페스티벌';
      default: return '기타';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <Container>
      <PageTitle>일정</PageTitle>
      <PageSubtitle>한로로의 다가오는 일정을 확인하세요</PageSubtitle>

      <UpcomingSection>
        <SectionTitle>다가오는 공연</SectionTitle>
        {loading ? (
          <EmptyMessage>로딩 중...</EmptyMessage>
        ) : upcomingEvents.length > 0 ? (
          <UpcomingGrid>
            {upcomingEvents.map((event, index) => (
              <EventCard
                key={event._id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <EventPoster $posterUrl={event.posterUrl}>
                  {daysUntil[event._id] !== undefined && (
                    <DdayBadge $isToday={daysUntil[event._id] === 0}>
                      {daysUntil[event._id] === 0
                        ? 'D-DAY'
                        : `D-${daysUntil[event._id]}`}
                    </DdayBadge>
                  )}
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
            ))}
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

export default SchedulePage;
