'use client';

import styled from 'styled-components';
import { useGameResult } from '@/hooks/queries/useGame';
import { DIFFICULTY_LABEL, QUESTIONS_PER_ROUND } from '@/lib/game/difficulty';
import type { GameResultDetail } from '@/types/api/game';
import KakaoShareButton from '@/components/ui/KakaoShareButton';
import Spinner from '@/components/ui/Spinner';
import {
  GamePageWrapper,
  Card,
  ResultHeader,
  ResultEyebrow,
  ResultScore,
  ResultTime,
  ResultActions,
  RankLink,
} from '../../Game.styles';

const KakaoFlex = styled(KakaoShareButton)`
  flex: 1;
`;

export default function ResultClient({
  id,
  initialData,
}: {
  id: string;
  initialData?: GameResultDetail;
}) {
  const { data: result, isLoading } = useGameResult(id, initialData);

  if (isLoading) return <Spinner />;
  if (!result) {
    return (
      <GamePageWrapper>
        <Card>
          <p>결과를 찾을 수 없어요.</p>
        </Card>
      </GamePageWrapper>
    );
  }

  const shareText = `한로로 음악 맞추기 ${DIFFICULTY_LABEL[result.difficulty]} 난이도에서 ${result.score}/${QUESTIONS_PER_ROUND}점 받았어요!`;

  return (
    <GamePageWrapper>
      <Card>
        <ResultHeader>
          <ResultEyebrow>{result.nickname}님의 기록 · {DIFFICULTY_LABEL[result.difficulty]} 난이도</ResultEyebrow>
          <ResultScore>{result.score}<span> / {QUESTIONS_PER_ROUND}</span></ResultScore>
          <ResultTime>소요 시간 {Math.round(result.elapsedMs / 1000)}초</ResultTime>
        </ResultHeader>

        <ResultActions>
          <KakaoFlex
            title="한로로 음악 맞추기"
            description={shareText}
            imageUrl={`/game/result/${result._id}/opengraph-image`}
            path={`/game/result/${result._id}`}
            buttonTitle="나도 도전하기"
            label="카카오톡 공유"
          />
          <RankLink href="/game">나도 하기</RankLink>
        </ResultActions>
      </Card>
    </GamePageWrapper>
  );
}
