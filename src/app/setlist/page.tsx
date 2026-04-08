'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
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
  ConcertBody,
  TabWrapper,
  TabButton,
  SetlistCard,
  SetListItem,
  SongOrder,
  AlbumThumb,
  EmptyMessage,
  NoSetlistMessage,
} from './Setlist.styles';
import { useConcerts } from '@/hooks/queries/useConcerts';

function SetlistContent() {
  const prefersReducedMotion = useReducedMotion();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const searchParams = useSearchParams();
  const targetConcertId = searchParams.get('concertId');
  const { data: concerts = [], isLoading: loading } = useConcerts();
  const [activeTabs, setActiveTabs] = useState<{ [key: string]: number }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setShouldReduceMotion(prefersReducedMotion ?? false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!targetConcertId || loading) return;
    const el = cardRefs.current[targetConcertId];
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [targetConcertId, loading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleTabChange = (concertId: string, tabIndex: number) => {
    setActiveTabs(prev => ({
      ...prev,
      [concertId]: tabIndex,
    }));
  };

  return (
    <Container>
      <PageTitle>셋리스트</PageTitle>
      <PageSubtitle>한로로의 공연 셋리스트를 확인하세요</PageSubtitle>

      {loading ? (
        <EmptyMessage>로딩 중...</EmptyMessage>
      ) : concerts.length > 0 ? (
        <ConcertGrid>
          {concerts.map((concert, index) => (
            <ConcertCard
              key={concert._id}
              ref={(el: HTMLDivElement | null) => { cardRefs.current[concert._id] = el; }}
              $highlighted={concert._id === targetConcertId}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ConcertHeader $posterUrl={concert.posterUrl}>
                {concert.isActive && <ActiveBadge>현재 공연</ActiveBadge>}
                <ConcertTitle>{concert.title}</ConcertTitle>
                <ConcertInfo>
                  <span>{concert.venue}</span>
                  <span>
                    {formatDate(concert.startDate)} ~ {formatDate(concert.endDate)}
                  </span>
                </ConcertInfo>
              </ConcertHeader>

              <ConcertBody>
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
                            Day {setlist.day}
                          </TabButton>
                        ))}
                      </TabWrapper>
                    )}

                    <SetlistCard>
                      {(concert.setlists ?? [])[activeTabs[concert._id] ?? 0]?.songs
                        .sort((a, b) => a.order - b.order)
                        .map((song, idx) => (
                          <SetListItem key={idx}>
                            <SongOrder>{String(song.order).padStart(2, '0')}</SongOrder>
                            {song.albumImageUrl && (
                              <AlbumThumb src={song.albumImageUrl} alt={song.title} />
                            )}
                            <span>{song.title}</span>
                          </SetListItem>
                        ))}
                    </SetlistCard>
                  </>
                ) : (
                  <NoSetlistMessage>등록된 셋리스트가 없습니다</NoSetlistMessage>
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
};

export default function SetlistPage() {
  return (
    <Suspense>
      <SetlistContent />
    </Suspense>
  );
}
