'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSubmitRorosi, useUpdateRorosiNickname } from '@/hooks/queries/useRorosi';
import { ROROSI_TARGET_MS, ROROSI_TIMEOUT_MS } from '@/lib/game/rorosi';
import KakaoShareButton from '@/components/ui/KakaoShareButton';
import styled from 'styled-components';
import {
  PageWrapper,
  Card,
  IntroWrap,
  IntroTitle,
  IntroDesc,
  TargetBadge,
  PrimaryButton,
  SecondaryLink,
  PlayWrap,
  StopwatchDisplay,
  StopButton,
  ResultWrap,
  ResultEyebrow,
  ResultStopwatch,
  ResultDiff,
  TimeoutBadge,
  ResultCard,
  NicknameLabel,
  NicknameRow,
  NicknameInput,
  RegisterButton,
  RegisteredNote,
  ResultActions,
  RankLink,
  RetryButton,
  ErrorText,
} from './Rorosi.styles';

const KakaoFlex = styled(KakaoShareButton)`
  flex: 1;
`;

type Phase = 'intro' | 'playing' | 'timeout' | 'result';

function formatMs(ms: number): string {
  return (ms / 1000).toFixed(2);
}

export default function RorosiClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [displayMs, setDisplayMs] = useState(0);
  const [finalResult, setFinalResult] = useState<{ resultId: string; elapsedMs: number; diffMs: number } | null>(null);
  const [nickname, setNickname] = useState('');
  const [registered, setRegistered] = useState(false);
  const [sharedNickname, setSharedNickname] = useState('익명');
  const [errorText, setErrorText] = useState('');

  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const submitRorosi = useSubmitRorosi();
  const updateNickname = useUpdateRorosiNickname();

  const stopLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => stopLoop, []);

  const tick = () => {
    const elapsed = performance.now() - startTimeRef.current;
    if (elapsed >= ROROSI_TIMEOUT_MS) {
      setDisplayMs(ROROSI_TIMEOUT_MS);
      stopLoop();
      setPhase('timeout');
      return;
    }
    setDisplayMs(elapsed);
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleStart = () => {
    setErrorText('');
    setDisplayMs(0);
    startTimeRef.current = performance.now();
    setPhase('playing');
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleStop = async () => {
    const elapsedMs = performance.now() - startTimeRef.current;
    stopLoop();

    try {
      const submitted = await submitRorosi.mutateAsync(elapsedMs);
      setFinalResult(submitted);
      setNickname('');
      setRegistered(false);
      setSharedNickname('익명');
      setPhase('result');
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '기록에 실패했습니다');
      setPhase('intro');
    }
  };

  const handleRegister = async () => {
    if (!nickname.trim() || !finalResult) return;
    try {
      await updateNickname.mutateAsync({ id: finalResult.resultId, nickname: nickname.trim() });
      setRegistered(true);
      setSharedNickname(nickname.trim());
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '등록에 실패했습니다');
    }
  };

  const shareText = useMemo(() => {
    if (!finalResult) return '';
    return `로로시 게임에서 11.11초에 ${formatMs(finalResult.diffMs)}초 차이로 멈췄어요!`;
  }, [finalResult]);

  return (
    <PageWrapper>
      <Card>
        {phase === 'intro' && (
          <IntroWrap>
            <IntroTitle>로로시 게임</IntroTitle>
            <IntroDesc>시작을 누르면 스톱워치가 바로 올라가요. 11.11초에 최대한 가깝게 정지를 눌러보세요.</IntroDesc>
            <TargetBadge>목표 11.11초 · 15.00초 초과 시 실패</TargetBadge>
            {errorText && <ErrorText>{errorText}</ErrorText>}
            <PrimaryButton type="button" onClick={handleStart}>시작</PrimaryButton>
            <SecondaryLink href="/game/rorosi/ranking">랭킹만 보기 →</SecondaryLink>
          </IntroWrap>
        )}

        {phase === 'playing' && (
          <PlayWrap>
            <StopwatchDisplay>{formatMs(displayMs)}</StopwatchDisplay>
            <StopButton type="button" onClick={handleStop} disabled={submitRorosi.isPending}>
              정지
            </StopButton>
          </PlayWrap>
        )}

        {phase === 'timeout' && (
          <IntroWrap>
            <TimeoutBadge>시간 초과!</TimeoutBadge>
            <IntroDesc>15.00초 안에 멈추지 못했어요. 다시 도전해보세요.</IntroDesc>
            <RetryButton type="button" onClick={handleStart}>다시 시작</RetryButton>
          </IntroWrap>
        )}

        {phase === 'result' && finalResult && (
          <>
            <ResultWrap>
              <ResultEyebrow>내 기록</ResultEyebrow>
              <ResultStopwatch>{formatMs(finalResult.elapsedMs)}</ResultStopwatch>
              <ResultDiff>목표 11.11초와 <b>{formatMs(finalResult.diffMs)}초</b> 차이</ResultDiff>
            </ResultWrap>

            <ResultCard>
              {registered ? (
                <RegisteredNote>랭킹에 등록됐어요!</RegisteredNote>
              ) : (
                <>
                  <NicknameLabel>랭킹에 등록할 닉네임</NicknameLabel>
                  <NicknameRow>
                    <NicknameInput
                      type="text"
                      maxLength={8}
                      placeholder="닉네임 (최대 8자)"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                    <RegisterButton type="button" onClick={handleRegister} disabled={!nickname.trim() || updateNickname.isPending}>
                      등록
                    </RegisterButton>
                  </NicknameRow>
                </>
              )}
            </ResultCard>

            <ResultActions>
              <KakaoFlex
                title="로로시 게임"
                description={shareText}
                imageUrl={`/game/rorosi/result/${finalResult.resultId}/opengraph-image?n=${encodeURIComponent(sharedNickname)}`}
                path={`/game/rorosi/result/${finalResult.resultId}`}
                buttonTitle="나도 도전하기"
                label="카카오톡 공유"
              />
              <RankLink href="/game/rorosi/ranking">전체 랭킹</RankLink>
            </ResultActions>
            <RetryButton type="button" onClick={handleStart}>다시 하기</RetryButton>
            {errorText && <ErrorText>{errorText}</ErrorText>}
          </>
        )}
      </Card>
    </PageWrapper>
  );
}
