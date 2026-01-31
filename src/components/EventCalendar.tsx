'use client';

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";
import Modal from "react-modal";
import { CloseButton } from "./CloseButton";

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

const EventCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // react-modal 접근성 설정
    Modal.setAppElement('body');

    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events/upcoming');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("일정 불러오기 실패:", err);
      }
    };
    loadEvents();
  }, []);

  return (
    <div>
      <Calendar
        tileClassName={({ date }) =>
          events.some(
            (e) =>
              new Date(e.date).toDateString() === date.toDateString()
          )
            ? "highlight has-event"
            : "no-event"
        }
        onClickDay={(value) => {
          const event = events.find(
            (e) =>
              new Date(e.date).toDateString() === value.toDateString()
          );
          if (event) setSelectedEvent(event);
        }}
      />

      <Modal
        isOpen={!!selectedEvent}
        onRequestClose={() => setSelectedEvent(null)}
        contentLabel="Event Details"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          },
        }}
      >
        <CloseButton onClick={() => setSelectedEvent(null)} />

        {selectedEvent && (
          <div>
            <h2>{selectedEvent.title}</h2>
            {selectedEvent.time && <p>{selectedEvent.time}</p>}
            {selectedEvent.place && <p>{selectedEvent.place}</p>}
            {selectedEvent.posterUrl && (
              <img
                src={selectedEvent.posterUrl}
                alt={selectedEvent.title}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventCalendar;
