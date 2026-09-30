'use client';

import { useRorosiRanking } from '@/hooks/queries/useRorosi';
import { PageWrapper, Card } from '../Rorosi.styles';
import {
  RankList,
  RankRow,
  RankNo,
  RankName,
  RankDiff,
  RankEmpty,
} from './RorosiRanking.styles';

function formatMs(ms: number): string {
  return (ms / 1000).toFixed(2);
}

export default function RorosiRankingClient() {
  const { data: ranking = [], isLoading } = useRorosiRanking();

  return (
    <PageWrapper>
      <Card>
        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>로로시 게임 랭킹</h1>
        <RankList>
          {isLoading ? (
            <RankEmpty>불러오는 중...</RankEmpty>
          ) : ranking.length === 0 ? (
            <RankEmpty>아직 등록된 기록이 없어요</RankEmpty>
          ) : (
            ranking.map((row) => (
              <RankRow key={row.resultId} $isMe={row.isMe}>
                <RankNo $top1={row.rank === 1}>{row.rank}</RankNo>
                <RankName>{row.nickname}{row.isMe ? ' (나)' : ''}</RankName>
                <RankDiff>{formatMs(row.diffMs)}<span>초 차이</span></RankDiff>
              </RankRow>
            ))
          )}
        </RankList>
      </Card>
    </PageWrapper>
  );
}
