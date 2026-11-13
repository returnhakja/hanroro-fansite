"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { artistData } from "@/data/artistData";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";
import { useBoardList } from "@/hooks/queries/useBoard";
import { useImages } from "@/hooks/queries/useGallery";
import { getBoardCategoryLabel } from "@/lib/board/categories";
import { formatDateLong } from "@/lib/utils/time";
import { theme } from "@/styles/theme";
import {
  Inner,
  SectionHead,
  SectionTitle,
  SectionMore,
  Row,
  Col,
  ListTop,
  ink,
  muted,
  line,
  lineSoft,
  accent,
  display,
} from "./Home.styles";

const SHORTCUTS = [
  { href: "/schedule", label: "SCHEDULE", title: "일정", desc: "다가오는 공연과 방송" },
  { href: "/setlist", label: "SETLIST", title: "셋리스트", desc: "공연별 곡 순서 기록" },
  { href: "/gallery", label: "GALLERY", title: "갤러리", desc: "팬들이 올린 사진" },
  { href: "/game", label: "GAME", title: "게임", desc: "음악 맞추기, 로로비트" },
];

export function HomeShortcuts() {
  return (
    <Inner style={{ paddingTop: 0 }}>
      <ShortcutRow>
        {SHORTCUTS.map((s) => (
          <Shortcut key={s.href} href={s.href}>
            <span>{s.label}</span>
            <strong>{s.title}</strong>
            <small>{s.desc}</small>
          </Shortcut>
        ))}
      </ShortcutRow>
    </Inner>
  );
}

export function HomeDiscography() {
  const albums = useMemo(
    () => [...artistData.albums].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 5),
    [],
  );

  return (
    <DarkBand>
      <Inner>
        <SectionHead>
          <SectionTitle>DISCOGRAPHY</SectionTitle>
          <SectionMore href="/profile#discography" $onDark>
            전체 보기
          </SectionMore>
        </SectionHead>
        <AlbumRow>
          {albums.map((album) => (
            <AlbumItem key={album.id} href="/profile#discography">
              <img src={album.coverUrl} alt={`${album.title} 커버`} />
              <strong>{album.title}</strong>
              <span>{album.releaseDate.replace(/-/g, ".")}</span>
            </AlbumItem>
          ))}
        </AlbumRow>
      </Inner>
    </DarkBand>
  );
}

export function HomeUpcoming() {
  const [mounted, setMounted] = useState(false);
  const { data } = useUpcomingEvents();

  useEffect(() => setMounted(true), []);

  const events = useMemo(() => {
    if (!mounted) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (data ?? [])
      .filter((e) => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [data, mounted]);

  return (
    <Inner>
      <SectionHead>
        <SectionTitle>UPCOMING</SectionTitle>
        <SectionMore href="/schedule">일정 전체 보기</SectionMore>
      </SectionHead>
      <ListTop>
        {events.length === 0 ? (
          <EmptyRow>{mounted ? "등록된 일정이 없어요" : ""}</EmptyRow>
        ) : (
          events.map((event) => (
            <EventRow key={event._id} href={`/schedule/${event._id}`}>
              <EventDate>{event.date.slice(0, 10).replace(/-/g, ".")}</EventDate>
              <EventName>{event.title}</EventName>
              {event.place && <EventPlace>{event.place}</EventPlace>}
            </EventRow>
          ))
        )}
      </ListTop>
    </Inner>
  );
}

export function HomeCommunity() {
  const { data: posts } = useBoardList();
  const { data: images } = useImages("image");
  const latestPosts = posts?.slice(0, 5) ?? [];
  const latestImages = images?.slice(0, 6) ?? [];

  return (
    <WhiteBand>
      <Inner>
        <Row style={{ gap: 56 }}>
          <Col $basis="440px">
            <SectionHead style={{ marginBottom: 0 }}>
              <SectionTitle>COMMUNITY</SectionTitle>
              <SectionMore href="/board">게시판 전체 보기</SectionMore>
            </SectionHead>
            <ListTop>
              {latestPosts.length === 0 && <EmptyRow>아직 게시글이 없어요</EmptyRow>}
              {latestPosts.map((post) => (
                <PostRow key={post._id} href={`/board/${post._id}`}>
                  <PostCategory>{getBoardCategoryLabel(post.category)}</PostCategory>
                  <PostTitle>{post.title}</PostTitle>
                  {!!post.commentCount && <PostComments>{post.commentCount}</PostComments>}
                  <PostDate>{formatDateLong(post.createdAt)}</PostDate>
                </PostRow>
              ))}
            </ListTop>
          </Col>
          <Col $basis="440px">
            <SectionHead style={{ marginBottom: 0 }}>
              <SectionTitle>GALLERY</SectionTitle>
              <SectionMore href="/gallery">갤러리 전체 보기</SectionMore>
            </SectionHead>
            <PhotoGrid>
              {latestImages.length === 0 && <EmptyRow>아직 사진이 없어요</EmptyRow>}
              {latestImages.map((image) => (
                <Photo key={image._id} href="/gallery">
                  <img src={image.imageUrl} alt={image.title} loading="lazy" />
                </Photo>
              ))}
            </PhotoGrid>
          </Col>
        </Row>
      </Inner>
    </WhiteBand>
  );
}

const ShortcutRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Shortcut = styled(Link)`
  flex: 1 1 220px;
  min-width: 0;
  background: #ffffff;
  border: 1px solid ${line};
  border-radius: 8px;
  padding: 24px;
  color: ${ink};
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color ${theme.transitions.fast};

  &:hover {
    border-color: ${ink};
  }

  span {
    font-family: ${display};
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: ${accent};
  }

  strong {
    font-size: 20px;
    font-weight: 700;
  }

  small {
    font-size: 14px;
    color: ${muted};
    line-height: 1.6;
  }
`;

const DarkBand = styled.section`
  background: ${ink};
  color: #f4f3f0;
`;

const WhiteBand = styled.section`
  background: #ffffff;
  border-top: 1px solid ${line};
`;

const AlbumRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const AlbumItem = styled(Link)`
  flex: 1 1 180px;
  min-width: 0;
  color: #f4f3f0;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 10px;

  img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 6px;
    display: block;
  }

  strong {
    font-size: 17px;
    font-weight: 700;
  }

  span {
    font-family: ${display};
    font-size: 13px;
    color: #b5b3ad;
  }
`;

const EmptyRow = styled.div`
  padding: 22px 0;
  font-size: 15px;
  color: ${muted};
`;

const EventRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 22px 0;
  border-bottom: 1px solid ${line};
  color: ${ink};
  text-decoration: none;
`;

const EventDate = styled.span`
  font-family: ${display};
  font-size: 20px;
  font-weight: 700;
  width: 130px;
`;

const EventName = styled.span`
  flex: 1 1 240px;
  min-width: 0;
  font-size: 18px;
  font-weight: 700;
`;

const EventPlace = styled.span`
  font-size: 15px;
  color: ${muted};
`;

const PostRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid ${line};
  color: ${ink};
  text-decoration: none;
`;

const PostCategory = styled.span`
  flex: none;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  background: ${lineSoft};
  color: #4a4a4a;
`;

const PostTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostComments = styled.span`
  flex: none;
  font-size: 13px;
  font-weight: 700;
  color: ${accent};
`;

const PostDate = styled.span`
  flex: none;
  font-size: 13px;
  color: ${muted};

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const Photo = styled(Link)`
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  overflow: hidden;
  background: ${lineSoft};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
