'use client';

import { useEffect, useState } from 'react';
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

interface Song {
  title: string;
  albumImageUrl?: string;
  order: number;
}

interface SetList {
  _id: string;
  day: number;
  date: string;
  songs: Song[];
}

interface Concert {
  _id: string;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  posterUrl?: string;
  isActive: boolean;
  setlists: SetList[];
}

const SetlistPage = () => {
  const shouldReduceMotion = useReducedMotion();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTabs, setActiveTabs] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const loadConcerts = async () => {
      try {
        const res = await fetch('/api/concerts');
        const data = await res.json();
        setConcerts(data.concerts || []);

        const tabs: { [key: string]: number } = {};
        (data.concerts || []).forEach((concert: Concert) => {
          tabs[concert._id] = 0;
        });
        setActiveTabs(tabs);
      } catch (err) {
        console.error('공연 목록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    loadConcerts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
                {concert.setlists.length > 0 ? (
                  <>
                    {concert.setlists.length > 1 && (
                      <TabWrapper>
                        {concert.setlists.map((setlist, idx) => (
                          <TabButton
                            key={setlist._id}
                            $active={activeTabs[concert._id] === idx}
                            onClick={() => handleTabChange(concert._id, idx)}
                          >
                            Day {setlist.day}
                          </TabButton>
                        ))}
                      </TabWrapper>
                    )}

                    <SetlistCard>
                      {concert.setlists[activeTabs[concert._id]]?.songs
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

export default SetlistPage;
