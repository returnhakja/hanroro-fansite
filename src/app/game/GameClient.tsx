'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  useStartGameRound,
  useCheckGameAnswer,
  useSubmitGame,
  useUpdateResultNickname,
} from '@/hooks/queries/useGame';
import { useYoutubeSnippetPlayer } from '@/lib/game/useYoutubeSnippetPlayer';
import { DIFFICULTY_LABEL, QUESTIONS_PER_ROUND } from '@/lib/game/difficulty';
import type { GameDifficulty } from '@/types/api/game';
import KakaoShareButton from '@/components/ui/KakaoShareButton';
import {
  GamePageWrapper,
  Card,
  DiffIntro,
  DiffTitle,
  DiffSub,
  DiffList,
  DiffCard,
  DiffInfo,
  DiffName,
  DiffDesc,
  DiffSeconds,
  PrimaryButton,
  TopBar,
  TopBarLabel,
  QuitLink,
  ProgressTrack,
  ProgressSeg,
  PlayCard,
  PlayOrb,
  PlayStatus,
  GuessForm,
  GuessRow,
  GuessInput,
  SubmitButton,
  HintText,
  FeedbackCard,
  ResultBadge,
  FeedbackTitle,
  FeedbackAnswer,
  ResultHeader,
  ResultEyebrow,
  ResultScore,
  ResultTime,
  ResultCard,
  NicknameLabel,
  NicknameRow,
  NicknameInput,
  RegisterButton,
  RegisteredNote,
  ResultActions,
  RankLink,
  ErrorText,
  SecondaryLink,
} from './Game.styles';

const DIFFICULTIES: GameDifficulty[] = ['easy', 'normal', 'hard'];
const KakaoFlex = styled(KakaoShareButton)`
  flex: 1;
`;
const DIFFICULTY_DESC: Record<GameDifficulty, string> = {
  easy: '누구나 편하게',
  normal: '적당히 아는 정도',
  hard: '찐팬만 가능',
};
const DIFFICULTY_SECONDS_LABEL: Record<GameDifficulty, string> = {
  easy: '10초 재생',
  normal: '5초 재생',
  hard: '3초 재생',
};

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

type Phase = 'difficulty' | 'playing' | 'feedback' | 'result';

export default function GameClient() {
  const router = useRouter();
  const { containerRef, play, stop } = useYoutubeSnippetPlayer();

  const [phase, setPhase] = useState<Phase>('difficulty');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');
  const [roundToken, setRoundToken] = useState('');
  const [clips, setClips] = useState<{ youtubeId: string; startSeconds: number }[]>([]);
  const [seconds, setSeconds] = useState(5);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
  const [isPlayingClip, setIsPlayingClip] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [nickname, setNickname] = useState('');
  const [registered, setRegistered] = useState(false);
  const [finalScore, setFinalScore] = useState<{ resultId: string; score: number; elapsedMs: number } | null>(null);
  const [errorText, setErrorText] = useState('');

  const startRound = useStartGameRound();
  const checkAnswer = useCheckGameAnswer();
  const submitGame = useSubmitGame();
  const updateNickname = useUpdateResultNickname();

  const playedIndexRef = useRef(-1);

  const handleStart = async () => {
    setErrorText('');
    try {
      const data = await startRound.mutateAsync(difficulty);
      setRoundToken(data.roundToken);
      setClips(data.clips);
      setSeconds(data.seconds);
      setIndex(0);
      setGuesses([]);
      setGuess('');
      playedIndexRef.current = -1;
      setStartedAt(Date.now());
      setPhase('playing');
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '라운드를 시작할 수 없습니다');
    }
  };

  useEffect(() => {
    if (phase !== 'playing' || clips.length === 0) return;
    if (playedIndexRef.current === index) return;
    playedIndexRef.current = index;

    const clip = clips[index];
    setIsPlayingClip(true);
    play(clip.youtubeId, clip.startSeconds, seconds).finally(() => {
      setIsPlayingClip(false);
    });
  }, [phase, index, clips, seconds, play]);

  const handleSubmitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || checkAnswer.isPending) return;

    stop();
    setIsPlayingClip(false);
    try {
      const result = await checkAnswer.mutateAsync({ roundToken, index, guess });
      setGuesses((prev) => [...prev, guess]);
      setLastFeedback(result);
      setPhase('feedback');
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '정답 확인에 실패했습니다');
    }
  };

  const handleNext = async () => {
    setGuess('');
    setErrorText('');
    if (index + 1 < QUESTIONS_PER_ROUND) {
      setIndex((i) => i + 1);
      setPhase('playing');
      return;
    }

    // 마지막 문제였으면 서버에 최종 채점 요청
    const elapsedMs = Date.now() - startedAt;
    try {
      const submitted = await submitGame.mutateAsync({ roundToken, nickname: '익명', guesses, elapsedMs });
      setFinalScore({ resultId: submitted.resultId, score: submitted.score, elapsedMs });
      setPhase('result');
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '채점에 실패했습니다');
    }
  };

  const handleRegister = async () => {
    if (!nickname.trim() || !finalScore) return;
    try {
      await updateNickname.mutateAsync({ id: finalScore.resultId, nickname: nickname.trim() });
      setRegistered(true);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '등록에 실패했습니다');
    }
  };

  const shareText = useMemo(() => {
    if (!finalScore) return '';
    return `한로로 음악 맞추기 ${DIFFICULTY_LABEL[difficulty]} 난이도에서 ${finalScore.score}/${QUESTIONS_PER_ROUND}점 받았어요!`;
  }, [finalScore, difficulty]);

  return (
    <GamePageWrapper>
      {/* 화면에 보이지 않는 유튜브 플레이어. 소리만 재생된다 */}
      <div ref={containerRef} style={{ position: 'fixed', left: -9999, top: -9999, width: 1, height: 1 }} />

      <Card>
        {phase === 'difficulty' && (
          <>
            <DiffIntro>
              <DiffTitle>음악 맞추기</DiffTitle>
              <DiffSub>난이도마다 랭킹이 따로 집계돼요</DiffSub>
            </DiffIntro>
            <DiffList>
              {DIFFICULTIES.map((d) => (
                <DiffCard
                  key={d}
                  type="button"
                  $selected={difficulty === d}
                  onClick={() => setDifficulty(d)}
                >
                  <DiffInfo>
                    <DiffName>{DIFFICULTY_LABEL[d]}</DiffName>
                    <DiffDesc>{DIFFICULTY_DESC[d]}</DiffDesc>
                  </DiffInfo>
                  <DiffSeconds>{DIFFICULTY_SECONDS_LABEL[d]}</DiffSeconds>
                </DiffCard>
              ))}
            </DiffList>
            {errorText && <ErrorText>{errorText}</ErrorText>}
            <PrimaryButton type="button" onClick={handleStart} disabled={startRound.isPending}>
              {startRound.isPending ? '준비 중...' : `${DIFFICULTY_LABEL[difficulty]} 난이도로 시작`}
            </PrimaryButton>
            <SecondaryLink href="/game/ranking">랭킹만 보기 →</SecondaryLink>
          </>
        )}

        {phase === 'playing' && (
          <>
            <TopBar>
              <TopBarLabel>문제 {index + 1} / {QUESTIONS_PER_ROUND} · {DIFFICULTY_LABEL[difficulty]}</TopBarLabel>
              <QuitLink type="button" onClick={() => router.push('/game')}>그만두기</QuitLink>
            </TopBar>
            <ProgressTrack>
              {Array.from({ length: QUESTIONS_PER_ROUND }).map((_, i) => (
                <ProgressSeg key={i} $state={i < index ? 'done' : i === index ? 'current' : 'upcoming'} />
              ))}
            </ProgressTrack>
            <PlayCard>
              <PlayOrb $playing={isPlayingClip}>
                <IconPlay />
              </PlayOrb>
              <PlayStatus>
                {isPlayingClip ? `재생 중 · ${DIFFICULTY_LABEL[difficulty]} 난이도 ${seconds}초` : '재생이 끝났어요'}
              </PlayStatus>
            </PlayCard>
            <GuessForm onSubmit={handleSubmitGuess}>
              <GuessRow>
                <GuessInput
                  type="text"
                  placeholder="곡 제목을 입력하세요"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  autoFocus
                />
                <SubmitButton type="submit" disabled={checkAnswer.isPending || !guess.trim()}>
                  제출
                </SubmitButton>
              </GuessRow>
              <HintText>오타 한두 글자는 정답으로 인정돼요</HintText>
            </GuessForm>
            {errorText && <ErrorText>{errorText}</ErrorText>}
          </>
        )}

        {phase === 'feedback' && lastFeedback && (
          <>
            <TopBar>
              <TopBarLabel>문제 {index + 1} / {QUESTIONS_PER_ROUND} · {DIFFICULTY_LABEL[difficulty]}</TopBarLabel>
              <QuitLink type="button" onClick={() => router.push('/game')}>그만두기</QuitLink>
            </TopBar>
            <ProgressTrack>
              {Array.from({ length: QUESTIONS_PER_ROUND }).map((_, i) => (
                <ProgressSeg key={i} $state={i <= index ? 'done' : 'upcoming'} />
              ))}
            </ProgressTrack>
            <FeedbackCard>
              <ResultBadge $correct={lastFeedback.correct}>
                {lastFeedback.correct ? <IconCheck /> : <IconX />}
              </ResultBadge>
              <FeedbackTitle>{lastFeedback.correct ? '정답이에요' : '아쉬워요'}</FeedbackTitle>
              <FeedbackAnswer>정답: <b>{lastFeedback.answer}</b></FeedbackAnswer>
            </FeedbackCard>
            <PrimaryButton type="button" onClick={handleNext} disabled={submitGame.isPending}>
              {index + 1 < QUESTIONS_PER_ROUND ? '다음 문제 →' : submitGame.isPending ? '채점 중...' : '결과 보기'}
            </PrimaryButton>
            {errorText && <ErrorText>{errorText}</ErrorText>}
          </>
        )}

        {phase === 'result' && finalScore && (
          <>
            <ResultHeader>
              <ResultEyebrow>게임 종료 · {DIFFICULTY_LABEL[difficulty]} 난이도</ResultEyebrow>
              <ResultScore>{finalScore.score}<span> / {QUESTIONS_PER_ROUND}</span></ResultScore>
              <ResultTime>총 소요 시간 {Math.round(finalScore.elapsedMs / 1000)}초 · 1문제 1점</ResultTime>
            </ResultHeader>

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
                title="한로로 음악 맞추기"
                description={shareText}
                path={`/game/result/${finalScore.resultId}`}
                buttonTitle="나도 도전하기"
                label="카카오톡 공유"
              />
              <RankLink href="/game/ranking">전체 랭킹</RankLink>
            </ResultActions>
            {errorText && <ErrorText>{errorText}</ErrorText>}
          </>
        )}
      </Card>
    </GamePageWrapper>
  );
}
