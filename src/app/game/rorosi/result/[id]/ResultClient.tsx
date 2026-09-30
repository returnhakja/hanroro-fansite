'use client';

import styled from 'styled-components';
import { useRorosiResult } from '@/hooks/queries/useRorosi';
import type { RorosiResultDetail } from '@/types/api/rorosi';
import KakaoShareButton from '@/components/ui/KakaoShareButton';
import Spinner from '@/components/ui/Spinner';
import {
  PageWrapper,
  Card,
  ResultWrap,
  ResultEyebrow,
  ResultStopwatch,
  ResultDiff,
  ResultActions,
  RankLink,
} from '../../Rorosi.styles';

const KakaoFlex = styled(KakaoShareButton)`
  flex: 1;
`;

function formatMs(ms: number): string {
  return (ms / 1000).toFixed(2);
}

export default function ResultClient({
  id,
  initialData,
}: {
  id: string;
  initialData?: RorosiResultDetail;
}) {
  const { data: result, isLoading } = useRorosiResult(id, initialData);

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

  const shareText = `로로시 게임에서 11.11초에 ${formatMs(result.diffMs)}초 차이로 멈췄어요!`;

  return (
    <PageWrapper>
      <Card>
        <ResultWrap>
          <ResultEyebrow>{result.nickname}님의 기록</ResultEyebrow>
          <ResultStopwatch>{formatMs(result.elapsedMs)}</ResultStopwatch>
          <ResultDiff>목표 11.11초와 <b>{formatMs(result.diffMs)}초</b> 차이</ResultDiff>
        </ResultWrap>

        <ResultActions>
          <KakaoFlex
            title="로로시 게임"
            description={shareText}
            imageUrl={`/game/rorosi/result/${result._id}/opengraph-image?n=${encodeURIComponent(result.nickname)}`}
            path={`/game/rorosi/result/${result._id}`}
            buttonTitle="나도 도전하기"
            label="카카오톡 공유"
          />
          <RankLink href="/game/rorosi">나도 하기</RankLink>
        </ResultActions>
      </Card>
    </PageWrapper>
  );
}
