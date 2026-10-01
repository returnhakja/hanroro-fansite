'use client';

import styled from 'styled-components';
import { useConcertGameResult } from '@/hooks/queries/useConcertGame';
import type { ConcertGameResultDetail } from '@/types/api/concertGame';
import KakaoShareButton from '@/components/ui/KakaoShareButton';
import Spinner from '@/components/ui/Spinner';
import {
  PageWrapper,
  Card,
  ResultWrap,
  ResultEyebrow,
  ScoreCircle,
  BreakdownText,
  ResultActions,
  RankLink,
} from '../../ConcertGame.styles';

const KakaoFlex = styled(KakaoShareButton)`
  flex: 1;
`;

export default function ResultClient({
  id,
  initialData,
}: {
  id: string;
  initialData?: ConcertGameResultDetail;
}) {
  const { data: result, isLoading } = useConcertGameResult(id, initialData);

  if (isLoading) return <Spinner />;
  if (!result) {
    return (
      <PageWrapper>
        <Card>
          <p>결과를 찾을 수 없어요.</p>
        </Card>
      </PageWrapper>
    );
  }

  const shareText = `공연 맞추기 게임에서 10문제 중 ${result.score}개를 맞혔어요!`;

  return (
    <PageWrapper>
      <Card>
        <ResultWrap>
          <ResultEyebrow>{result.nickname}님의 기록</ResultEyebrow>
          <ScoreCircle>
            <strong>{result.score}/10</strong>
            <span>정답</span>
          </ScoreCircle>
          <BreakdownText>
            날짜 정답 {result.dateCorrectCount}/10 · 장소 정답 {result.venueCorrectCount}/10
          </BreakdownText>
        </ResultWrap>

        <ResultActions>
          <KakaoFlex
            title="공연 맞추기 게임"
            description={shareText}
            imageUrl={`/game/concert/result/${result._id}/opengraph-image?n=${encodeURIComponent(result.nickname)}`}
            path={`/game/concert/result/${result._id}`}
            buttonTitle="나도 도전하기"
            label="카카오톡 공유"
          />
          <RankLink href="/game/concert">나도 하기</RankLink>
        </ResultActions>
      </Card>
    </PageWrapper>
  );
}
