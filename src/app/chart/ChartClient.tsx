'use client';

import { useSongChart } from '@/hooks/queries/useSongChart';
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
  FootNote,
  StateBox,
} from './Chart.styles';

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

export default function ChartClient() {
  const { data, isLoading, isError } = useSongChart();
  const { data: myVote } = useMyVote();
  const vote = useVoteSong();

  const songs = data?.songs ?? [];
  const totalVotes = data?.totalVotes ?? 0;
  const maxCount = songs.reduce((m, s) => Math.max(m, s.count), 0);
  const myPick = myVote?.songTitle ?? null;

  return (
    <PageWrapper>
      <Inner>
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
            응원하세요. 한 곡만 선택되고, 언제든 바꾸거나 취소할 수 있어요. 30초마다
            자동 갱신됩니다.
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
      </Inner>
    </PageWrapper>
  );
}
