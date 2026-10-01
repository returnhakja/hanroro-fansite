'use client';

import { useMemo, useState } from 'react';
import { useConcertGameRound, useSubmitConcertGame, useUpdateConcertGameNickname } from '@/hooks/queries/useConcertGame';
import type { ConcertGameQuestionView, ConcertGameAnswerResult } from '@/types/api/concertGame';
import KakaoShareButton from '@/components/ui/KakaoShareButton';
import styled from 'styled-components';
import {
  PageWrapper,
  Card,
  IntroWrap,
  IntroTitle,
  IntroDesc,
  TeaserBox,
  TargetBadge,
  PrimaryButton,
  SecondaryLink,
  ProgressRow,
  ProgressTrack,
  ProgressFill,
  QuestionImage,
  Credit,
  QuestionCard,
  QuestionLabel,
  ChoiceGrid,
  ChoiceButton,
  NextButton,
  ResultWrap,
  ResultEyebrow,
  ScoreCircle,
  GradeBadge,
  BreakdownText,
  ReviewList,
  ReviewItem,
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
} from './ConcertGame.styles';

const KakaoFlex = styled(KakaoShareButton)`
  flex: 1;
`;

type Phase = 'intro' | 'playing' | 'result';

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}.${m}.${d}`;
}

function gradeLabel(score: number): string {
  if (score >= 9) return 'SSS (찐팬 인증)';
  if (score >= 7) return 'SS';
  if (score >= 5) return 'S';
  if (score >= 3) return 'A';
  return 'B';
}

export default function ConcertGameClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [roundToken, setRoundToken] = useState('');
  const [questions, setQuestions] = useState<ConcertGameQuestionView[]>([]);
  const [index, setIndex] = useState(0);
  const [pickedDate, setPickedDate] = useState('');
  const [pickedVenue, setPickedVenue] = useState('');
  const [pickedConcertName, setPickedConcertName] = useState('');
  const [answers, setAnswers] = useState<{ questionId: string; pickedDate: string; pickedVenue: string; pickedConcertName: string }[]>([]);

  const [resultId, setResultId] = useState('');
  const [score, setScore] = useState(0);
  const [dateCorrectCount, setDateCorrectCount] = useState(0);
  const [venueCorrectCount, setVenueCorrectCount] = useState(0);
  const [concertNameCorrectCount, setConcertNameCorrectCount] = useState(0);
  const [reviewResults, setReviewResults] = useState<ConcertGameAnswerResult[]>([]);

  const [nickname, setNickname] = useState('');
  const [registered, setRegistered] = useState(false);
  const [sharedNickname, setSharedNickname] = useState('익명');
  const [errorText, setErrorText] = useState('');

  const getRound = useConcertGameRound();
  const submitGame = useSubmitConcertGame();
  const updateNickname = useUpdateConcertGameNickname();

  const wrongReview = useMemo(
    () => reviewResults.filter((r) => !(r.dateCorrect && r.venueCorrect && r.concertNameCorrect)),
    [reviewResults]
  );

  const handleStart = async () => {
    setErrorText('');
    try {
      const round = await getRound.mutateAsync();
      setRoundToken(round.roundToken);
      setQuestions(round.questions);
      setIndex(0);
      setAnswers([]);
      setPickedDate('');
      setPickedVenue('');
      setPickedConcertName('');
      setPhase('playing');
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '문제를 불러올 수 없습니다');
    }
  };

  const handleNext = async () => {
    const current = questions[index];
    const nextAnswers = [...answers, { questionId: current.questionId, pickedDate, pickedVenue, pickedConcertName }];

    if (index + 1 < questions.length) {
      setAnswers(nextAnswers);
      setIndex(index + 1);
      setPickedDate('');
      setPickedVenue('');
      setPickedConcertName('');
      return;
    }

    try {
      const submitted = await submitGame.mutateAsync({ roundToken, answers: nextAnswers });
      setResultId(submitted.resultId);
      setScore(submitted.score);
      setDateCorrectCount(submitted.dateCorrectCount);
      setVenueCorrectCount(submitted.venueCorrectCount);
      setConcertNameCorrectCount(submitted.concertNameCorrectCount);
      setReviewResults(submitted.results);
      setNickname('');
      setRegistered(false);
      setSharedNickname('익명');
      setPhase('result');
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '채점에 실패했습니다');
      setPhase('intro');
    }
  };

  const handleRegister = async () => {
    if (!nickname.trim() || !resultId) return;
    try {
      await updateNickname.mutateAsync({ id: resultId, nickname: nickname.trim() });
      setRegistered(true);
      setSharedNickname(nickname.trim());
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '등록에 실패했습니다');
    }
  };

  const current = questions[index];
  const shareText = `공연 날짜 맞추기 게임에서 10문제 중 ${score}개를 맞혔어요!`;

  return (
    <PageWrapper>
      <Card>
        {phase === 'intro' && (
          <IntroWrap>
            <IntroTitle>이 공연, 언제였을까?</IntroTitle>
            <IntroDesc>무대 사진 한 장으로 공연 날짜와 장소를 맞혀보세요. 찐팬만 아는 디테일이에요.</IntroDesc>
            <TeaserBox>
              <strong>무대 사진 미리보기</strong>
              <span>문제를 풀면 선명하게 보여요</span>
            </TeaserBox>
            <TargetBadge>총 10문제 · 정답률로 찐팬 등급 측정</TargetBadge>
            {errorText && <ErrorText>{errorText}</ErrorText>}
            <PrimaryButton type="button" onClick={handleStart} disabled={getRound.isPending}>
              {getRound.isPending ? '불러오는 중...' : '시작하기'}
            </PrimaryButton>
            <SecondaryLink href="/game/concert/ranking">랭킹만 보기 →</SecondaryLink>
          </IntroWrap>
        )}

        {phase === 'playing' && current && (
          <>
            <ProgressRow>
              <span>{index + 1} / {questions.length}</span>
            </ProgressRow>
            <ProgressTrack>
              <ProgressFill $percent={((index + 1) / questions.length) * 100} />
            </ProgressTrack>

            <div>
              <QuestionImage $src={current.imageUrl} />
              {current.credit && <Credit>ⓒ 제공: {current.credit}</Credit>}
            </div>

            <QuestionCard>
              <QuestionLabel>Q1. 이 공연은 언제 열렸을까요?</QuestionLabel>
              <ChoiceGrid>
                {current.dateOptions.map((d) => (
                  <ChoiceButton
                    key={d}
                    type="button"
                    $selected={pickedDate === d}
                    onClick={() => setPickedDate(d)}
                  >
                    {formatDateLabel(d)}
                  </ChoiceButton>
                ))}
              </ChoiceGrid>
            </QuestionCard>

            <QuestionCard>
              <QuestionLabel>Q2. 공연 장소는 어디였을까요?</QuestionLabel>
              <ChoiceGrid>
                {current.venueOptions.map((v) => (
                  <ChoiceButton
                    key={v}
                    type="button"
                    $selected={pickedVenue === v}
                    onClick={() => setPickedVenue(v)}
                  >
                    {v}
                  </ChoiceButton>
                ))}
              </ChoiceGrid>
            </QuestionCard>

            <QuestionCard>
              <QuestionLabel>Q3. 이 공연의 이름은 무엇일까요?</QuestionLabel>
              <ChoiceGrid>
                {current.concertNameOptions.map((c) => (
                  <ChoiceButton
                    key={c}
                    type="button"
                    $selected={pickedConcertName === c}
                    onClick={() => setPickedConcertName(c)}
                  >
                    {c}
                  </ChoiceButton>
                ))}
              </ChoiceGrid>
            </QuestionCard>

            <NextButton
              type="button"
              onClick={handleNext}
              disabled={!pickedDate || !pickedVenue || !pickedConcertName || submitGame.isPending}
            >
              {index + 1 < questions.length ? '다음 문제' : submitGame.isPending ? '채점 중...' : '결과 보기'}
            </NextButton>
            {errorText && <ErrorText>{errorText}</ErrorText>}
          </>
        )}

        {phase === 'result' && (
          <>
            <ResultWrap>
              <ResultEyebrow>내 결과</ResultEyebrow>
              <ScoreCircle>
                <strong>{score}/{questions.length}</strong>
                <span>정답</span>
              </ScoreCircle>
              <GradeBadge>찐팬 등급 : {gradeLabel(score)}</GradeBadge>
              <BreakdownText>
                날짜 정답 {dateCorrectCount}/{questions.length} · 장소 정답 {venueCorrectCount}/{questions.length} · 공연명 정답 {concertNameCorrectCount}/{questions.length}
              </BreakdownText>
            </ResultWrap>

            {wrongReview.length > 0 && (
              <ReviewList>
                {wrongReview.map((r) => (
                  <ReviewItem key={r.questionId}>
                    {!r.dateCorrect && <>날짜 정답은 <b>{formatDateLabel(r.correctDate)}</b>였어요. </>}
                    {!r.venueCorrect && <>장소 정답은 <b>{r.correctVenue}</b>였어요. </>}
                    {!r.concertNameCorrect && <>공연명 정답은 <b>{r.correctConcertName}</b>였어요.</>}
                  </ReviewItem>
                ))}
              </ReviewList>
            )}

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
                title="공연 맞추기 게임"
                description={shareText}
                imageUrl={`/game/concert/result/${resultId}/opengraph-image?n=${encodeURIComponent(sharedNickname)}`}
                path={`/game/concert/result/${resultId}`}
                buttonTitle="나도 도전하기"
                label="카카오톡 공유"
              />
              <RankLink href="/game/concert/ranking">전체 랭킹</RankLink>
            </ResultActions>
            <RetryButton type="button" onClick={handleStart}>다시 하기</RetryButton>
            {errorText && <ErrorText>{errorText}</ErrorText>}
          </>
        )}
      </Card>
    </PageWrapper>
  );
}
