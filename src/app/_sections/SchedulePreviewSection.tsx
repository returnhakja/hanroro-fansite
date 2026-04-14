"use client";

import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";
import { formatDateLong } from "@/lib/utils/time";
import {
  SectionOverline,
  SectionTitle,
  SectionLink,
  SectionHeader,
  SectionHeaderLeft,
} from "./common.styles";
import {
  PreviewSection,
  PreviewList,
  PreviewItem,
  PreviewItemTitle,
  PreviewItemMeta,
} from "./PreviewList.styles";

export default function SchedulePreviewSection() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { data: eventData } = useUpcomingEvents();
  const upcomingEvents = (eventData || [])
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 2);

  return (
    <PreviewSection>
      <SectionHeader>
        <SectionHeaderLeft>
          <SectionOverline>SCHEDULE</SectionOverline>
          <SectionTitle>다가오는 일정</SectionTitle>
        </SectionHeaderLeft>
        <SectionLink onClick={() => router.push("/schedule")}>
          전체 보기
        </SectionLink>
      </SectionHeader>
      {upcomingEvents.length > 0 ? (
        <PreviewList>
          {upcomingEvents.map((event, index) => (
            <PreviewItem
              key={event._id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => router.push("/schedule")}
            >
              <PreviewItemTitle>{event.title}</PreviewItemTitle>
              <PreviewItemMeta>
                <span>{formatDateLong(event.date)}</span>
                {event.place && <span>{event.place}</span>}
                {event.time && <span>{event.time}</span>}
              </PreviewItemMeta>
            </PreviewItem>
          ))}
        </PreviewList>
      ) : (
        <PreviewList>
          <PreviewItem
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <PreviewItemTitle>등록된 일정이 없습니다</PreviewItemTitle>
          </PreviewItem>
        </PreviewList>
      )}
    </PreviewSection>
  );
}
