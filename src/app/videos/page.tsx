'use client';

import { useRef, useState } from 'react';
import styled from 'styled-components';
import { CloseButton } from '@/components/ui/CloseButton';
import Spinner from '@/components/ui/Spinner';
import { theme } from '@/styles/theme';
import {
  useYoutubePlaylists,
  useYoutubePlaylistItems,
  useYoutubeKeywordVideos,
  type YoutubePlaylist,
  type YoutubePlaylistItem,
} from '@/hooks/queries/useYoutube';
import { useScrollLock } from '@/hooks/useScrollLock';

interface SelectedVideo {
  id: string;
  title: string;
}

/**
 * 카테고리(재생목록) 표시 순서 — 여기 적은 순서대로 위에서부터 노출된다.
 * 재생목록 "제목"을 그대로 적으면 되고, 여기에 없는 재생목록은 아래에 유튜브 기본 순서로 붙는다.
 * 예) ['뮤직비디오', 'LIVE CLIP', 'Vlog']
 */
const PLAYLIST_ORDER: string[] = ['로로의 생존법', 'LIVE CLIP', 'ROROLOG', 'MV'];

/**
 * 키워드 카테고리 — 재생목록이 아니라 "제목에 키워드가 포함된 영상"을 모아 보여준다.
 * title: 화면에 표시할 카테고리 이름
 * keyword: 제목 매칭 키워드 (대소문자 무시)
 * after: 이 제목의 재생목록 "바로 아래"에 삽입 (없으면 맨 아래)
 */
const KEYWORD_CATEGORIES: { title: string; keyword: string; after?: string }[] = [
  { title: 'BEHIND', keyword: '[BEHIND]', after: '로로의 생존법' },
];

function sortPlaylists(playlists: YoutubePlaylist[]): YoutubePlaylist[] {
  if (PLAYLIST_ORDER.length === 0) return playlists;
  const rank = (title: string) => {
    const i = PLAYLIST_ORDER.indexOf(title);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  // 배열에 있는 것 우선(지정 순서), 나머지는 원래(유튜브 기본) 순서 유지
  return [...playlists].sort((a, b) => rank(a.title) - rank(b.title));
}

export default function VideosPage() {
  const { data: playlists, isLoading } = useYoutubePlaylists();
  const [selected, setSelected] = useState<SelectedVideo | null>(null);

  useScrollLock(!!selected);

  if (isLoading) return <Spinner />;

  return (
    <Container>
      <Header>
        <Overline>VIDEOS</Overline>
        <Title>영상</Title>
        <Subtitle>재생목록별로 한로로의 영상을 감상하세요</Subtitle>
      </Header>

      {!playlists || playlists.length === 0 ? (
        <EmptyState>표시할 재생목록이 없습니다</EmptyState>
      ) : (
        <Rows>
          {sortPlaylists(playlists).map((playlist) => (
            <div key={playlist.id}>
              <PlaylistRow playlist={playlist} onSelect={setSelected} />
              {KEYWORD_CATEGORIES.filter((c) => c.after === playlist.title).map((c) => (
                <KeywordRow key={c.title} category={c} onSelect={setSelected} />
              ))}
            </div>
          ))}
          {/* after 앵커가 없거나 매칭되는 재생목록이 없는 키워드 카테고리는 맨 아래에 */}
          {KEYWORD_CATEGORIES.filter(
            (c) => !c.after || !playlists.some((p) => p.title === c.after),
          ).map((c) => (
            <KeywordRow key={c.title} category={c} onSelect={setSelected} />
          ))}
        </Rows>
      )}

      {selected && (
        <PlayerOverlay onClick={() => setSelected(null)}>
          <PlayerContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelected(null)} />
            <PlayerFrame>
              <iframe
                src={`https://www.youtube.com/embed/${selected.id}?autoplay=1`}
                title={selected.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </PlayerFrame>
            <PlayerTitle>{selected.title}</PlayerTitle>
          </PlayerContent>
        </PlayerOverlay>
      )}
    </Container>
  );
}

// 재생목록 기반 행
function PlaylistRow({
  playlist,
  onSelect,
}: {
  playlist: YoutubePlaylist;
  onSelect: (video: SelectedVideo) => void;
}) {
  const { data: items, isLoading } = useYoutubePlaylistItems(playlist.id);
  return (
    <VideoRow
      title={playlist.title}
      count={playlist.itemCount}
      items={items}
      isLoading={isLoading}
      onSelect={onSelect}
    />
  );
}

// 키워드 기반 행 (제목에 키워드가 포함된 영상 모음)
function KeywordRow({
  category,
  onSelect,
}: {
  category: { title: string; keyword: string };
  onSelect: (video: SelectedVideo) => void;
}) {
  const { data: items, isLoading } = useYoutubeKeywordVideos(category.keyword);
  return (
    <VideoRow
      title={category.title}
      count={items?.length ?? 0}
      items={items}
      isLoading={isLoading}
      onSelect={onSelect}
    />
  );
}

// 가로 스크롤 행 (프레젠테이션 전용)
function VideoRow({
  title,
  count,
  items,
  isLoading,
  onSelect,
}: {
  title: string;
  count: number;
  items: YoutubePlaylistItem[] | undefined;
  isLoading: boolean;
  onSelect: (video: SelectedVideo) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  // 로딩 중이 아니고 재생 가능한 영상이 없으면 행 자체를 숨긴다.
  if (!isLoading && (!items || items.length === 0)) return null;

  return (
    <RowWrapper>
      <RowHeader>
        <RowTitle>{title}</RowTitle>
        <RowCount>{count}개</RowCount>
      </RowHeader>

      {isLoading ? (
        <RowSpinner>
          <Spinner />
        </RowSpinner>
      ) : (
        <TrackArea>
          <ArrowButton $side="left" onClick={() => scrollBy(-1)} aria-label="이전">
            ‹
          </ArrowButton>
          <Track ref={trackRef}>
            {items!.map((video: YoutubePlaylistItem) => (
              <Card
                key={video.id}
                onClick={() => onSelect({ id: video.id, title: video.title })}
              >
                <ThumbWrapper>
                  <Thumb src={video.thumbnail} alt={video.title} loading="lazy" />
                  <PlayIcon>▶</PlayIcon>
                </ThumbWrapper>
                <CardTitle>{video.title}</CardTitle>
              </Card>
            ))}
          </Track>
          <ArrowButton $side="right" onClick={() => scrollBy(1)} aria-label="다음">
            ›
          </ArrowButton>
        </TrackArea>
      )}
    </RowWrapper>
  );
}

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
`;

const Overline = styled.span`
  display: block;
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accent};
  margin-bottom: 0.5rem;
  font-family: ${theme.typography.fontBody};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.textSecondary};
  font-family: ${theme.typography.fontBody};
  margin-bottom: 0;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const RowWrapper = styled.section``;

const RowHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const RowTitle = styled.h2`
  font-size: 1.4rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const RowCount = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.textTertiary};
  font-family: ${theme.typography.fontBody};
`;

const RowSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`;

const TrackArea = styled.div`
  position: relative;
`;

const Track = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.5rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.div`
  flex: 0 0 280px;
  scroll-snap-align: start;
  cursor: pointer;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-basis: 220px;
  }
`;

const ThumbWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: ${theme.colors.surfaceWarm};
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform ${theme.transitions.normal};

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const PlayIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity ${theme.transitions.fast};

  ${Card}:hover & {
    opacity: 1;
  }
`;

const CardTitle = styled.div`
  padding: 0.75rem 0.9rem;
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontBody};
  border-top: 1px solid ${theme.colors.borderLight};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArrowButton = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  ${({ $side }) => ($side === 'left' ? 'left: -0.5rem;' : 'right: -0.5rem;')}
  bottom: 0;
  z-index: 2;
  width: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 1.75rem;
  color: ${theme.colors.textPrimary};
  background: linear-gradient(
    ${({ $side }) => ($side === 'left' ? 'to right' : 'to left')},
    ${theme.colors.background},
    transparent
  );
  opacity: 0;
  transition: opacity ${theme.transitions.fast};

  ${TrackArea}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${theme.colors.accent};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.textTertiary};
  font-size: 1.1rem;
  font-family: ${theme.typography.fontBody};
`;

const PlayerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(44, 36, 24, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const PlayerContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlayerFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const PlayerTitle = styled.h3`
  color: ${theme.colors.textLight};
  margin-top: 1rem;
  font-size: 1.2rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
  text-align: center;
`;
