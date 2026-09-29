'use client';

import { useState } from 'react';
import { useGameRanking } from '@/hooks/queries/useGame';
import { DIFFICULTY_LABEL, QUESTIONS_PER_ROUND } from '@/lib/game/difficulty';
import type { GameDifficulty } from '@/types/api/game';
import {
  GamePageWrapper,
  Card,
  TopBar,
  TopBarLabel,
} from '../Game.styles';
import {
  RankTabs,
  RankTab,
  RankList,
  RankRow,
  RankNo,
  RankName,
  RankScore,
  RankTime,
  RankEmpty,
} from './Ranking.styles';

const DIFFICULTIES: GameDifficulty[] = ['easy', 'normal', 'hard'];

export default function RankingClient() {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');
  const { data: ranking = [], isLoading } = useGameRanking(difficulty);

  return (
    <GamePageWrapper>
      <Card>
        <TopBar>
          <TopBarLabel>랭킹</TopBarLabel>
        </TopBar>
        <RankTabs>
          {DIFFICULTIES.map((d) => (
            <RankTab key={d} type="button" $active={difficulty === d} onClick={() => setDifficulty(d)}>
              {DIFFICULTY_LABEL[d]}
            </RankTab>
          ))}
        </RankTabs>
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
                <RankScore>{row.score}<span>/{QUESTIONS_PER_ROUND}</span></RankScore>
                <RankTime>{Math.round(row.elapsedMs / 1000)}초</RankTime>
              </RankRow>
            ))
          )}
        </RankList>
      </Card>
    </GamePageWrapper>
  );
}
