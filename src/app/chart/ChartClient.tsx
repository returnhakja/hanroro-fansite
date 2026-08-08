'use client';

import { useState } from 'react';
import { useSongChart, useSetlistStats } from '@/hooks/queries/useSongChart';
import { useMyVote, useVoteSong } from '@/hooks/queries/useSongVote';
import {
  PageWrapper,
  Inner,
  PageHeader,
  Overline,
  TitleRow,
  PageTitle,
  LiveBadge,
  LiveDot,
  Subtitle,
  IntroCard,
  List,
  Row,
  Rank,
  Cover,
  Meta,
  SongTitle,
  AlbumName,
  BarRow,
  Bar,
  BarFill,
  VoteCount,
  VoteButton,
  StageValue,
  Tag,
  FootNote,
  StateBox,
  Toggle,
  ToggleButton,
} from './Chart.styles';

type View = 'fan' | 'stage';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7.5-4.9-10-9.2C.4 8.8 1.9 5 5.4 5 7.6 5 9 6.5 12 9c3-2.5 4.4-4 6.6-4 3.5 0 5 3.8 3.4 6.8C19.5 16.1 12 21 12 21z" />
    </svg>
  );
}

/* ── 실시간 팬 최애곡 (투표) ───────────────────────────── */
function FanChart() {
  const { data, isLoading, isError } = useSongChart();
  const { data: myVote } = useMyVote();
  const vote = useVoteSong();

  const songs = data?.songs ?? [];
  const totalVotes = data?.totalVotes ?? 0;
  const maxCount = songs.reduce((m, s) => Math.max(m, s.count), 0);
  const myPick = myVote?.songTitle ?? null;

  return (
    <>
      <PageHeader>
        <Overline>Fan Chart</Overline>
        <TitleRow>
          <PageTitle>실시간 팬 최애곡</PageTitle>
          <LiveBadge>
            <LiveDot />
            LIVE
          </LiveBadge>
        </TitleRow>
        <Subtitle>
          지금 팬들이 뽑은 한로로 최애곡 · 총 {totalVotes.toLocaleString('ko-KR')}표
        </Subtitle>
        <IntroCard>
          <strong>로그인 없이 참여할 수 있어요.</strong> 하트를 눌러 최애곡을
          응원하세요. 한 곡만 선택되고, 언제든 바꾸거나 취소할 수 있어요.
        </IntroCard>
      </PageHeader>

      {isLoading ? (
        <StateBox>차트를 불러오는 중…</StateBox>
      ) : isError ? (
        <StateBox>차트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</StateBox>
      ) : songs.length === 0 ? (
        <StateBox>표시할 곡이 없어요.</StateBox>
      ) : (
        <List>
          {songs.map((song, i) => {
            const rank = i + 1;
            const pct = maxCount > 0 ? (song.count / maxCount) * 100 : 0;
            const mine = myPick === song.songTitle;
            return (
              <Row key={song.songTitle} $top={rank <= 3} $mine={mine}>
                <Rank $tier={rank}>{rank}</Rank>
                <Cover
                  src={song.albumImageUrl}
                  alt={`${song.album} 앨범 커버`}
                  loading="lazy"
                />
                <Meta>
                  <SongTitle>{song.songTitle}</SongTitle>
                  <AlbumName>{song.album}</AlbumName>
                  <BarRow>
                    <Bar>
                      <BarFill $pct={pct} />
                    </Bar>
                    <VoteCount>{song.count.toLocaleString('ko-KR')}표</VoteCount>
                  </BarRow>
                </Meta>
                <VoteButton
                  $mine={mine}
                  onClick={() => vote.mutate(song.songTitle)}
                  aria-pressed={mine}
                  aria-label={
                    mine
                      ? `${song.songTitle} 최애곡 취소`
                      : `${song.songTitle}을(를) 최애곡으로 선택`
                  }
                >
                  <HeartIcon filled={mine} />
                </VoteButton>
              </Row>
            );
          })}
        </List>
      )}

      <FootNote>
        하트를 눌러 최애곡을 응원하세요 · 로그인 없이 참여 · 언제든 변경 가능
      </FootNote>
    </>
  );
}

/* ── 무대에서 가장 많이 부른 곡 (셋리스트 집계) ─────────── */
function StageChart() {
  const { data, isLoading, isError } = useSetlistStats();

  const songs = data?.songs ?? [];
  const totalShows = data?.totalShows ?? 0;
  const maxCount = songs.reduce((m, s) => Math.max(m, s.count), 0);

  return (
    <>
      <PageHeader>
        <Overline>On Stage</Overline>
        <TitleRow>
          <PageTitle>무대에서 가장 많이 부른 곡</PageTitle>
        </TitleRow>
        <Subtitle>
          역대 공연 {totalShows.toLocaleString('ko-KR')}회 셋리스트 집계
        </Subtitle>
        <IntroCard>
          <strong>팬 투표가 아니라 실제 공연 기록이에요.</strong> 셋리스트가
          쌓일수록 자동으로 갱신됩니다. 관리자 조작 없이 데이터로만 만들어져요.
        </IntroCard>
      </PageHeader>

      {isLoading ? (
        <StateBox>집계를 불러오는 중…</StateBox>
      ) : isError ? (
        <StateBox>집계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</StateBox>
      ) : songs.length === 0 ? (
        <StateBox>아직 집계할 셋리스트가 없어요.</StateBox>
      ) : (
        <List>
          {songs.map((song, i) => {
            const rank = i + 1;
            const pct = maxCount > 0 ? (song.count / maxCount) * 100 : 0;
            return (
              <Row key={song.songTitle} $top={rank <= 3} $mine={false}>
                <Rank $tier={rank}>{rank}</Rank>
                <Cover
                  src={song.albumImageUrl ?? ''}
                  alt={`${song.album || song.songTitle} 앨범 커버`}
                  loading="lazy"
                />
                <Meta>
                  <SongTitle>{song.songTitle}</SongTitle>
                  {song.album && <AlbumName>{song.album}</AlbumName>}
                  <BarRow>
                    <Bar>
                      <BarFill $pct={pct} $stage />
                    </Bar>
                    <StageValue>
                      {song.count}회 · {song.pct}%
                    </StageValue>
                  </BarRow>
                  {song.tag && <Tag>{song.tag}</Tag>}
                </Meta>
              </Row>
            );
          })}
        </List>
      )}

      <FootNote>셋리스트 데이터를 기반으로 자동 집계됩니다.</FootNote>
    </>
  );
}

export default function ChartClient() {
  const [view, setView] = useState<View>('fan');

  return (
    <PageWrapper>
      <Inner>
        <Toggle role="tablist" aria-label="차트 종류">
          <ToggleButton
            $view="fan"
            $active={view === 'fan'}
            role="tab"
            aria-selected={view === 'fan'}
            onClick={() => setView('fan')}
          >
            ❤️ 실시간 팬 차트
          </ToggleButton>
          <ToggleButton
            $view="stage"
            $active={view === 'stage'}
            role="tab"
            aria-selected={view === 'stage'}
            onClick={() => setView('stage')}
          >
            📊 무대 최다
          </ToggleButton>
        </Toggle>

        {view === 'fan' ? <FanChart /> : <StageChart />}
      </Inner>
    </PageWrapper>
  );
}
