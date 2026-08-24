"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Spinner from "@/components/ui/Spinner";
import {
  Container,
  PageTitle,
  PageSubtitle,
  ConcertGrid,
  ConcertCard,
  ConcertHeader,
  ConcertTitle,
  ConcertInfo,
  ActiveBadge,
  HeaderShareSlot,
  ConcertBody,
  ConcertActions,
  AttendButton,
  TabWrapper,
  TabButton,
  SetlistCard,
  SetlistDateLabel,
  SetListItem,
  SongOrder,
  AlbumThumb,
  EmptyMessage,
  NoSetlistMessage,
} from "./Setlist.styles";
import { useConcerts } from "@/hooks/queries/useConcerts";
import {
  useAttendedConcerts,
  useToggleAttendedConcert,
} from "@/hooks/queries/useAttendedConcerts";
import { formatDateLong } from "@/lib/utils/time";
import {
  formatSetlistDays,
  formatSetlistDateRange,
} from "@/lib/utils/setlistLabel";
import KakaoShareButton from "@/components/ui/KakaoShareButton";

const IconHeart = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);

function SetlistContent() {
  const prefersReducedMotion = useReducedMotion();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const searchParams = useSearchParams();
  const targetConcertId = searchParams.get("concertId");
  const { data: concerts = [], isLoading: loading } = useConcerts();
  const [activeTabs, setActiveTabs] = useState<{ [key: string]: number }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { data: session } = useSession();
  const { data: attended = [] } = useAttendedConcerts();
  const { check, uncheck } = useToggleAttendedConcert();

  const attendedConcertIds = new Set(
    attended.filter((a) => a.sourceType === "concert").map((a) => a.sourceId),
  );

  const handleToggleAttend = (concert: {
    _id: string;
    title: string;
    venue: string;
    endDate: string;
  }) => {
    if (!session?.user) {
      signIn("google");
      return;
    }
    if (attendedConcertIds.has(concert._id)) {
      uncheck.mutate({ sourceType: "concert", sourceId: concert._id });
    } else {
      check.mutate({
        sourceType: "concert",
        sourceId: concert._id,
        title: concert.title,
        venue: concert.venue,
        date: concert.endDate,
      });
    }
  };

  useEffect(() => {
    setShouldReduceMotion(prefersReducedMotion ?? false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!targetConcertId || loading) return;
    const el = cardRefs.current[targetConcertId];
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [targetConcertId, loading]);

  const handleTabChange = (concertId: string, tabIndex: number) => {
    setActiveTabs((prev) => ({
      ...prev,
      [concertId]: tabIndex,
    }));
  };

  return (
    <Container>
      <PageTitle>셋리스트</PageTitle>
      <PageSubtitle>한로로의 공연 셋리스트를 확인하세요</PageSubtitle>

      {loading ? (
        <Spinner />
      ) : concerts.length > 0 ? (
        <ConcertGrid>
          {concerts.map((concert, index) => (
            <ConcertCard
              key={concert._id}
              ref={(el: HTMLDivElement | null) => {
                cardRefs.current[concert._id] = el;
              }}
              $highlighted={concert._id === targetConcertId}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ConcertHeader $posterUrl={concert.posterUrl}>
                <HeaderShareSlot>
                  <KakaoShareButton
                    title={`[한로로] ${concert.title} 셋리스트`}
                    description={[
                      concert.endDate && concert.endDate !== concert.startDate
                        ? `${formatDateLong(concert.startDate)} ~ ${formatDateLong(concert.endDate)}`
                        : formatDateLong(concert.startDate),
                      concert.venue,
                    ]
                      .filter(Boolean)
                      .join("\n")}
                    imageUrl={
                      concert.posterUrl
                        ? `/api/concerts/${concert._id}/poster`
                        : undefined
                    }
                    path={`/setlist?concertId=${concert._id}`}
                    buttonTitle="셋리스트 보기"
                  />
                </HeaderShareSlot>
                {concert.isActive && <ActiveBadge>현재 공연</ActiveBadge>}
                <ConcertTitle>{concert.title}</ConcertTitle>
                <ConcertInfo>
                  <span>{concert.venue}</span>
                  <span>
                    {formatDateLong(concert.startDate)} ~{" "}
                    {formatDateLong(concert.endDate)}
                  </span>
                </ConcertInfo>
              </ConcertHeader>

              <ConcertBody>
                <ConcertActions>
                  <AttendButton
                    type="button"
                    $checked={attendedConcertIds.has(concert._id)}
                    onClick={() => handleToggleAttend(concert)}
                    aria-label="다녀온 공연으로 체크"
                    title="다녀온 공연으로 체크"
                  >
                    <IconHeart />
                    {attendedConcertIds.has(concert._id) ? "다녀왔어요" : "다녀왔어요 체크"}
                  </AttendButton>
                </ConcertActions>

                {(concert.setlists ?? []).length > 0 ? (
                  <>
                    {(concert.setlists ?? []).length > 1 && (
                      <TabWrapper>
                        {(concert.setlists ?? []).map((setlist, idx) => (
                          <TabButton
                            key={setlist._id}
                            $active={(activeTabs[concert._id] ?? 0) === idx}
                            onClick={() => handleTabChange(concert._id, idx)}
                          >
                            {formatSetlistDays(setlist)}
                          </TabButton>
                        ))}
                      </TabWrapper>
                    )}

                    {(() => {
                      const active = (concert.setlists ?? [])[
                        activeTabs[concert._id] ?? 0
                      ];
                      return active ? (
                        <SetlistDateLabel>
                          {formatSetlistDateRange(active)}
                        </SetlistDateLabel>
                      ) : null;
                    })()}

                    <SetlistCard>
                      {(concert.setlists ?? [])[
                        activeTabs[concert._id] ?? 0
                      ]?.songs
                        .sort((a, b) => a.order - b.order)
                        .map((song, idx) => (
                          <SetListItem key={idx}>
                            <SongOrder>
                              {String(song.order).padStart(2, "0")}
                            </SongOrder>
                            {song.albumImageUrl && (
                              <AlbumThumb
                                src={song.albumImageUrl}
                                alt={song.title}
                              />
                            )}
                            <span>{song.title}</span>
                          </SetListItem>
                        ))}
                    </SetlistCard>
                  </>
                ) : (
                  <NoSetlistMessage>
                    등록된 셋리스트가 없습니다
                  </NoSetlistMessage>
                )}
              </ConcertBody>
            </ConcertCard>
          ))}
        </ConcertGrid>
      ) : (
        <EmptyMessage>등록된 공연이 없습니다</EmptyMessage>
      )}
    </Container>
  );
}

export default function SetlistPage() {
  return (
    <Suspense>
      <SetlistContent />
    </Suspense>
  );
}
