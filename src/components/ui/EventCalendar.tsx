"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";
import styled from "styled-components";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";

const CalendarWrapper = styled.div`
  width: 100%;
`;

const EventCalendar = () => {
  // react-calendar는 new Date()(오늘) 기준으로 렌더돼 SSR/클라 시각 차이로
  // 하이드레이션 불일치가 발생 → 마운트 후 클라이언트에서만 렌더
  const [mounted, setMounted] = useState(false);
  const { data } = useUpcomingEvents();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const events = data ?? [];

  return (
    <CalendarWrapper>
      {mounted && (
        <Calendar
          tileClassName={({ date }) =>
            events.some(
              (e) => new Date(e.date).toDateString() === date.toDateString(),
            )
              ? "highlight has-event"
              : "no-event"
          }
          onClickDay={(value) => {
            const event = events.find(
              (e) => new Date(e.date).toDateString() === value.toDateString(),
            );
            if (event) router.push(`/schedule/${event._id}`);
          }}
        />
      )}
    </CalendarWrapper>
  );
};

export default EventCalendar;
