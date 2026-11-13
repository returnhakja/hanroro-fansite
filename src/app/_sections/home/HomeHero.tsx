"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";
import { getLatestAlbum } from "@/data/artistData";
import { formatDateWithWeekday } from "@/lib/utils/time";
import { formatEventTime } from "@/lib/utils/eventSchema";
import type { Event } from "@/types/api/event";
import { theme } from "@/styles/theme";
import {
  Inner,
  Eyebrow,
  Tag,
  ButtonRow,
  PrimaryButton,
  GhostButton,
  BigNumber,
  Row,
  Col,
  Card,
  ink,
  inkSoft,
  muted,
  lineSoft,
  accent,
  display,
} from "./Home.styles";

// 발매 후 이 기간 동안은 일정보다 새 앨범을 첫 화면에 크게 보여준다.
const RELEASE_SPOTLIGHT_DAYS = 21;
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysFromToday(dateString: string) {
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - startOfToday().getTime()) / DAY_MS);
}

function daysSinceRelease(releaseDate: string) {
  const [y, m, d] = releaseDate.split("-").map(Number);
  return Math.round((startOfToday().getTime() - new Date(y, m - 1, d).getTime()) / DAY_MS);
}

function eventMeta(event: Event) {
  return [
    event.place,
    event.time ? formatEventTime(event.time, event.endTime) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

type HeroMode = "today" | "release" | "upcoming";

export default function HomeHero() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useUpcomingEvents();
  const latest = getLatestAlbum();

  useEffect(() => setMounted(true), []);

  // 날짜 계산은 브라우저 시간 기준이어야 해서 마운트 이후에만 한다(하이드레이션 불일치 방지).
  const upcoming = useMemo(() => {
    if (!mounted) return [];
    return (data ?? [])
      .filter((e) => daysFromToday(e.date) >= 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, mounted]);

  if (!mounted || isLoading) return <Placeholder aria-hidden />;

  const todayEvent = upcoming.find((e) => daysFromToday(e.date) === 0);
  const sinceRelease = daysSinceRelease(latest.releaseDate);
  const isFreshRelease = sinceRelease >= 0 && sinceRelease <= RELEASE_SPOTLIGHT_DAYS;

  const mode: HeroMode = todayEvent
    ? "today"
    : isFreshRelease || upcoming.length === 0
      ? "release"
      : "upcoming";

  if (mode === "today" && todayEvent) {
    return (
      <DarkBand>
        <Inner>
          <Stack>
            <Eyebrow>
              <Tag>TODAY</Tag>
              <span style={{ color: "#B5B3AD" }}>{formatDateWithWeekday(todayEvent.date)}</span>
            </Eyebrow>
            <BigNumber>D-DAY</BigNumber>
            <EventTitle>오늘 {todayEvent.title}</EventTitle>
            {eventMeta(todayEvent) && <Meta $onDark>{eventMeta(todayEvent)}</Meta>}
            <ButtonRow>
              <PrimaryButton href="/setlist" $onDark>
                셋리스트 보기
              </PrimaryButton>
              <GhostButton href={`/schedule/${todayEvent._id}`} $onDark>
                일정 자세히 보기
              </GhostButton>
            </ButtonRow>
          </Stack>
        </Inner>
      </DarkBand>
    );
  }

  if (mode === "release") {
    const isAlbum = latest.tracks.length > 0;
    return (
      <Inner>
        <Row style={{ alignItems: "center", gap: 56 }}>
          <Col>
            <Eyebrow>
              <Tag>{isFreshRelease ? (isAlbum ? "NEW ALBUM" : "NEW SINGLE") : "LATEST RELEASE"}</Tag>
              <span style={{ color: muted }}>{latest.releaseDate.replace(/-/g, ".")}</span>
            </Eyebrow>
            <ReleaseTitle>{latest.title}</ReleaseTitle>
            <Lead>
              {latest.description ?? "한로로의 새 음악이 나왔어요. 발매 소식과 무대 기록을 여기에서 모아 봅니다."}
            </Lead>
            <ButtonRow>
              <PrimaryButton href="/profile#discography">디스코그래피 보기</PrimaryButton>
              <GhostButton href="/schedule">다가오는 일정</GhostButton>
            </ButtonRow>
          </Col>
          <Col>
            <CoverWrap>
              <Cover src={latest.coverUrl} alt={`${latest.title} 커버`} />
              {isFreshRelease && <OutNow>OUT NOW</OutNow>}
            </CoverWrap>
          </Col>
        </Row>
      </Inner>
    );
  }

  const [next, ...rest] = upcoming;
  const then = rest.slice(0, 2);
  const dday = daysFromToday(next.date);

  return (
    <Inner>
      <Row style={{ alignItems: "stretch" }}>
        <Col $grow={1.3} $basis="460px" style={{ justifyContent: "center" }}>
          <Eyebrow>
            <Tag>NEXT</Tag>
            <span style={{ color: muted }}>{formatDateWithWeekday(next.date)}</span>
          </Eyebrow>
          <BigNumber>D-{dday}</BigNumber>
          <EventTitle>{next.title}</EventTitle>
          {eventMeta(next) && <Meta>{eventMeta(next)}</Meta>}
          <ButtonRow>
            <PrimaryButton href={`/schedule/${next._id}`}>일정 자세히 보기</PrimaryButton>
            <GhostButton href="/setlist">지난 셋리스트로 예습</GhostButton>
          </ButtonRow>
        </Col>
        <Col $basis="360px" style={{ gap: 16 }}>
          {then.length > 0 && (
            <Card style={{ padding: 24 }}>
              <SmallLabel>THEN</SmallLabel>
              {then.map((event, i) => (
                <ThenRow key={event._id} href={`/schedule/${event._id}`} $last={i === then.length - 1}>
                  <ThenDate>{event.date.slice(5, 10).replace("-", ".")}</ThenDate>
                  <ThenTitle>{event.title}</ThenTitle>
                </ThenRow>
              ))}
            </Card>
          )}
          <ReleaseMini href="/profile#discography">
            <img src={latest.coverUrl} alt={`${latest.title} 커버`} />
            <div>
              <SmallLabel style={{ color: accent, marginBottom: 4 }}>LATEST RELEASE</SmallLabel>
              <strong>{latest.title}</strong>
              <span>{latest.releaseDate.replace(/-/g, ".")}</span>
            </div>
          </ReleaseMini>
        </Col>
      </Row>
    </Inner>
  );
}

const Placeholder = styled.div`
  min-height: 560px;
`;

const DarkBand = styled.section`
  background: ${ink};
  color: #f4f3f0;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
`;

const EventTitle = styled.h1`
  margin: 0;
  font-size: 40px;
  font-weight: 900;
  line-height: 1.25;
  word-break: keep-all;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 28px;
  }
`;

const Meta = styled.p<{ $onDark?: boolean }>`
  margin: 0;
  font-size: 18px;
  color: ${({ $onDark }) => ($onDark ? "#B5B3AD" : inkSoft)};
`;

const ReleaseTitle = styled.h1`
  margin: 0;
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  word-break: keep-all;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 64px;
  }
`;

const Lead = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.7;
  color: ${inkSoft};
  max-width: 32ch;
`;

const CoverWrap = styled.div`
  position: relative;
`;

const Cover = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
`;

const OutNow = styled.div`
  position: absolute;
  left: -14px;
  bottom: 28px;
  background: ${accent};
  color: #ffffff;
  font-family: ${display};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 10px 16px;
  border-radius: 4px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    left: 12px;
  }
`;

const SmallLabel = styled.span`
  display: block;
  font-family: ${display};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${muted};
  margin-bottom: 8px;
`;

const ThenRow = styled(Link)<{ $last: boolean }>`
  display: flex;
  gap: 16px;
  align-items: baseline;
  padding: 12px 0;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${lineSoft}`)};
  color: ${ink};
  text-decoration: none;
`;

const ThenDate = styled.span`
  flex: none;
  width: 56px;
  font-family: ${display};
  font-size: 16px;
  font-weight: 700;
`;

const ThenTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 16px;
  font-weight: 700;
`;

const ReleaseMini = styled(Link)`
  background: #ffffff;
  border: 1px solid #dad8d2;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  color: ${ink};
  text-decoration: none;

  img {
    width: 88px;
    height: 88px;
    object-fit: cover;
    border-radius: 6px;
    flex: none;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  strong {
    font-size: 20px;
    font-weight: 900;
  }

  span:last-child {
    font-size: 14px;
    color: ${muted};
  }
`;
