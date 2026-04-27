"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";
import Modal from "react-modal";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";
import type { Event } from "@/types/api/event";
import { EventTicketOutlets } from "@/components/ui/EventTicketOutlets";

const CalendarWrapper = styled.div`
  width: 100%;
`;

const ModalContent = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.gap.xl};
  border-radius: ${theme.borderRadius.xl};
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.gap.lg};
    max-width: 90vw;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.gap.md};
  right: ${theme.spacing.gap.md};
  background: ${theme.colors.surfaceAlt};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-size: 1.25rem;
  color: ${theme.colors.textSecondary};

  &:hover {
    background: ${theme.colors.primary};
    color: ${theme.colors.textLight};
    transform: rotate(90deg);
  }
`;

const EventTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.gap.lg} 0;
  padding-right: ${theme.spacing.gap.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.gap.md};
  margin-bottom: ${theme.spacing.gap.lg};
`;

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.gap.sm};
  font-size: ${theme.typography.body.fontSize};
  color: ${theme.colors.textSecondary};

  strong {
    color: ${theme.colors.textPrimary};
    min-width: 60px;
  }
`;

const EventPoster = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.gap.md};
  box-shadow: ${theme.shadows.lg};
`;

const EventType = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 600;
  background: ${(props) => {
    switch (props.type) {
      case "concert":
        return `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`;
      case "fanmeeting":
        return `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%)`;
      case "broadcast":
        return `linear-gradient(135deg, ${theme.colors.info} 0%, #5D7186 100%)`;
      case "festival":
        return `linear-gradient(135deg, ${theme.colors.success} 0%, #4E6E4E 100%)`;
      default:
        return `linear-gradient(135deg, ${theme.colors.secondaryLight} 0%, ${theme.colors.secondary} 100%)`;
    }
  }};
  color: white;
  margin-bottom: ${theme.spacing.gap.md};
`;

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(44, 36, 24, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  content: {
    position: "relative" as const,
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    border: "none",
    background: "transparent",
    padding: 0,
    overflow: "visible",
  },
};

const EventCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { data } = useUpcomingEvents();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Modal 접근성 설정
  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  const events = data ?? [];

  useEffect(() => {
    const eventId = searchParams.get("event");

    setSelectedEvent((prev) => {
      if (!eventId) return prev ? null : prev;
      if (prev?._id === eventId) return prev;
      const found = events.find((e) => e._id === eventId);
      return found ?? null;
    });
  }, [searchParams, events]);

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

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    router.push(`/schedule?event=${event._id}`, { scroll: false });
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
    router.push("/schedule", { scroll: false });
  };

  return (
    <CalendarWrapper>
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
          if (event) handleEventSelect(event);
        }}
      />

      <Modal
        isOpen={!!selectedEvent}
        onRequestClose={handleModalClose}
        contentLabel="Event Details"
        style={modalStyles}
      >
        <ModalContent>
          <CloseButton onClick={handleModalClose}>✕</CloseButton>

          {selectedEvent && (
            <>
              <EventType type={selectedEvent.type}>
                {getEventTypeLabel(selectedEvent.type)}
              </EventType>

              <EventTitle>{selectedEvent.title}</EventTitle>

              <EventDetails>
                {selectedEvent.time && (
                  <EventDetail>
                    <strong>시간</strong>
                    <span>{selectedEvent.time}</span>
                  </EventDetail>
                )}
                {selectedEvent.place && (
                  <EventDetail>
                    <strong>장소</strong>
                    <span>{selectedEvent.place}</span>
                  </EventDetail>
                )}
                <EventDetail>
                  <strong>날짜</strong>
                  <span>
                    {new Date(selectedEvent.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </span>
                </EventDetail>
              </EventDetails>

              <EventTicketOutlets
                outlets={selectedEvent.ticketOutlets}
                idPrefix={selectedEvent._id}
              />

              {selectedEvent.posterUrl && (
                <EventPoster
                  src={selectedEvent.posterUrl}
                  alt={selectedEvent.title}
                />
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </CalendarWrapper>
  );
};

export default EventCalendar;
