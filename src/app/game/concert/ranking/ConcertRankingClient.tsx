'use client';

import { useConcertGameRanking } from '@/hooks/queries/useConcertGame';
import { PageWrapper, Card } from '../ConcertGame.styles';
import {
  RankList,
  RankRow,
  RankNo,
  RankName,
  RankScore,
  RankEmpty,
} from './ConcertRanking.styles';

export default function ConcertRankingClient() {
  const { data: ranking = [], isLoading } = useConcertGameRanking();

  return (
    <PageWrapper>
      <Card>
        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>공연 맞추기 게임 랭킹</h1>
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
                <RankScore>{row.score}<span>/10 정답</span></RankScore>
              </RankRow>
            ))
          )}
        </RankList>
      </Card>
    </PageWrapper>
  );
}
