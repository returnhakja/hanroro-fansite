'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useRhythmCharts,
  useFetchRhythmChart,
  useSubmitRhythmResult,
  useUpdateRhythmNickname,
  useRhythmRanking,
} from '@/hooks/queries/useRhythmGame';
import { useRhythmYoutubePlayer } from '@/lib/game/useRhythmYoutubePlayer';
import {
  RHYTHM_LANE_COUNT,
  RHYTHM_LANE_COLORS,
  RHYTHM_LANE_KEYS,
  RHYTHM_NOTE_TRAVEL_MS,
  RHYTHM_PERFECT_WINDOW_MS,
  RHYTHM_GREAT_WINDOW_MS,
  RHYTHM_MISS_WINDOW_MS,
  RHYTHM_SCORE_PER_HIT,
  RHYTHM_DIFFICULTY_LABEL,
  type RhythmJudgement,
} from '@/lib/game/rhythm';
import type { RhythmChartDetail } from '@/types/api/rhythm';
import {
  PageWrapper,
  IntroCard,
  IntroWrap,
  Eyebrow,
  IntroTitle,
  IntroDesc,
  SongList,
  SongCard,
  SongArt,
  SongInfo,
  SongTitle,
  SongMeta,
  DifficultyPill,
  PrimaryButton,
  ErrorText,
  PlayWrap,
  GlowBlob,
  PlayTopBar,
  ScoreText,
  ProgressTrack,
  ProgressFill,
  ComboWrap,
  ComboNumber,
  ComboLabel,
  JudgementFlash,
  LaneArea,
  Lane,
  Note,
  HitBurst,
  TapButton,
  CountdownOverlay,
  ResultWrap,
  ScoreCircle,
  GradeBadge,
  BreakdownBox,
  BreakdownRow,
  BreakdownLabel,
  BreakdownTrack,
  BreakdownFill,
  BreakdownValue,
  NicknameRow,
  NicknameInput,
  RegisterButton,
  RegisteredNote,
  RankList,
  RankRow,
  ResultActions,
  SecondaryButton,
} from './RhythmGame.styles';

type Phase = 'select' | 'playing' | 'result';

interface VisibleNote {
  index: number;
  lane: number;
  top: number;
}

function gradeLabel(accuracy: number): string {
  if (accuracy >= 0.95) return 'SSS';
  if (accuracy >= 0.85) return 'SS';
  if (accuracy >= 0.7) return 'S';
  if (accuracy >= 0.5) return 'A';
  return 'B';
}

// RhythmGame.styles.ts의 TapButton height / Note height와 반드시 일치해야 한다.
// 판정 기준점을 화면 중간의 가상 판정선이 아니라, 실제로 사용자가 누르는
// D/F/J/K 네모(TapButton)로 바꿨다. 노트가 떨어지다 이 버튼 칸 안에
// (정확히는 버튼의 세로 중앙에) 겹치는 순간이 diff=0이 되도록, 버튼이
// Lane 바닥에 붙어있는 실제 높이를 기준으로 도착 지점을 계산한다.
const TAP_BUTTON_HEIGHT = 56;
const NOTE_HEIGHT = 34;

export default function RhythmGameClient() {
  const [phase, setPhase] = useState<Phase>('select');
  const { data: charts = [], isLoading: chartsLoading } = useRhythmCharts();
  const fetchChart = useFetchRhythmChart();
  const submitResult = useSubmitRhythmResult();
  const updateNickname = useUpdateRhythmNickname();

  const [selectedId, setSelectedId] = useState('');
  const [chart, setChart] = useState<RhythmChartDetail | null>(null);
  const [errorText, setErrorText] = useState('');
  const [countdown, setCountdown] = useState(3);

  const [visibleNotes, setVisibleNotes] = useState<VisibleNote[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const [greatCount, setGreatCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [judgementFlash, setJudgementFlash] = useState<{ key: number; judgement: RhythmJudgement } | null>(null);
  const [burst, setBurst] = useState<{ key: number; lane: number } | null>(null);
  const [pressedLane, setPressedLane] = useState<number | null>(null);

  const [resultId, setResultId] = useState('');
  const [nickname, setNickname] = useState('');
  const [registered, setRegistered] = useState(false);

  const judgedRef = useRef<Set<number>>(new Set());
  const laneAreaRef = useRef<HTMLDivElement | null>(null);
  const laneHeightRef = useRef(440);
  // 카운트다운(3,2,1,GO)이 끝나는 바로 그 순간의 player.getElapsedMs() 값.
  // 소리는 클릭 즉시(제스처 보존을 위해) 재생을 시작하지만, 실제 노트 판정의
  // 기준 시각(0ms)은 "GO"가 사라지는 시점이어야 하므로 그 차이를 여기 저장해뒀다가
  // 매번 빼서 쓴다.
  const gameStartOffsetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const flashKeyRef = useRef(0);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const scoreRef = useRef(0);
  const perfectRef = useRef(0);
  const greatRef = useRef(0);
  const missRef = useRef(0);
  const endedRef = useRef(false);

  const handleEnded = useCallback(() => {
    endedRef.current = true;
  }, []);

  // 테스트 단계라 콘솔 대신 화면에 바로 보여줘서, 디버깅 없이도 어떤 유튜브 오류인지
  // (임베드 차단/삭제된 영상 등) 바로 알 수 있게 한다.
  const handlePlayerError = useCallback((message: string) => {
    setErrorText(`영상 재생 오류: ${message}`);
  }, []);

  const player = useRhythmYoutubePlayer(handleEnded, handlePlayerError);

  const { data: ranking = [] } = useRhythmRanking(phase === 'result' ? chart?._id ?? '' : '');

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => stopLoop, [stopLoop]);

  // 레인 영역의 실제 렌더링 높이를 측정해 "노트가 TapButton 칸에 도착하는 지점"을
  // 하드코딩된 픽셀이 아니라 실제 레이아웃 기준으로 계산한다.
  useEffect(() => {
    const el = laneAreaRef.current;
    if (!el) return;
    const update = () => { laneHeightRef.current = el.clientHeight; };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phase]);

  const finishGame = useCallback(async () => {
    stopLoop();
    player.stop();
    if (!chart) return;
    try {
      const submitted = await submitResult.mutateAsync({
        chartId: chart._id,
        score: scoreRef.current,
        maxCombo: maxComboRef.current,
        perfectCount: perfectRef.current,
        greatCount: greatRef.current,
        missCount: missRef.current,
      });
      setResultId(submitted.resultId);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '결과 저장에 실패했습니다');
    }
    setNickname('');
    setRegistered(false);
    setPhase('result');
  }, [chart, player, stopLoop, submitResult]);

  const triggerJudgement = useCallback((judgement: RhythmJudgement, lane?: number) => {
    flashKeyRef.current += 1;
    setJudgementFlash({ key: flashKeyRef.current, judgement });
    if (judgement !== 'miss' && lane !== undefined) {
      setBurst({ key: flashKeyRef.current, lane });
    }
    setTimeout(() => {
      setJudgementFlash((cur) => (cur?.key === flashKeyRef.current ? null : cur));
      setBurst((cur) => (cur?.key === flashKeyRef.current ? null : cur));
    }, 450);
  }, []);

  const applyJudgement = useCallback((judgement: RhythmJudgement, lane?: number) => {
    if (judgement === 'miss') {
      comboRef.current = 0;
      missRef.current += 1;
      setMissCount(missRef.current);
    } else {
      comboRef.current += 1;
      maxComboRef.current = Math.max(maxComboRef.current, comboRef.current);
      scoreRef.current += RHYTHM_SCORE_PER_HIT[judgement] * (1 + Math.min(comboRef.current, 50) * 0.02);
      setMaxCombo(maxComboRef.current);
      setScore(Math.round(scoreRef.current));
      if (judgement === 'perfect') { perfectRef.current += 1; setPerfectCount(perfectRef.current); }
      else { greatRef.current += 1; setGreatCount(greatRef.current); }
    }
    setCombo(comboRef.current);
    triggerJudgement(judgement, lane);
  }, [triggerJudgement]);

  const handleLaneInput = useCallback((lane: number) => {
    // 카운트다운이 끝나기 전(GO 전)에는 아직 게임이 시작된 게 아니므로 입력을 무시한다.
    if (!chart || gameStartOffsetRef.current === null) return;
    setPressedLane(lane);
    setTimeout(() => setPressedLane((cur) => (cur === lane ? null : cur)), 120);

    const elapsedMs = player.getElapsedMs() - gameStartOffsetRef.current;
    let bestIndex = -1;
    let bestDiff = Infinity;
    chart.notes.forEach((note, index) => {
      if (note.lane !== lane || judgedRef.current.has(index)) return;
      const diff = Math.abs(note.timeMs - elapsedMs);
      if (diff <= RHYTHM_MISS_WINDOW_MS && diff < bestDiff) {
        bestDiff = diff;
        bestIndex = index;
      }
    });
    if (bestIndex === -1) return;
    judgedRef.current.add(bestIndex);
    const judgement: RhythmJudgement =
      bestDiff <= RHYTHM_PERFECT_WINDOW_MS ? 'perfect' : bestDiff <= RHYTHM_GREAT_WINDOW_MS ? 'great' : 'miss';
    applyJudgement(judgement, lane);
  }, [applyJudgement, chart, player]);

  // 키보드 입력 (D F J K)
  useEffect(() => {
    if (phase !== 'playing') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const lane = RHYTHM_LANE_KEYS.indexOf(e.key.toLowerCase());
      if (lane !== -1) handleLaneInput(lane);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, handleLaneInput]);

  // 메인 루프: 노트 위치 갱신 + 자동 미스 판정 + 종료 체크
  // 카운트다운이 끝나기(GO) 전까지는 돌지 않는다 — 노트는 "GO"와 동시에 떨어지기 시작해야 한다.
  useEffect(() => {
    if (phase !== 'playing' || !chart || countdown >= 0) return;

    if (gameStartOffsetRef.current === null) {
      gameStartOffsetRef.current = player.getElapsedMs();
    }

    const tick = () => {
      const elapsedMs = player.getElapsedMs() - (gameStartOffsetRef.current ?? 0);
      const next: VisibleNote[] = [];
      let allJudged = true;
      let lastNoteMs = 0;

      chart.notes.forEach((note, index) => {
        lastNoteMs = Math.max(lastNoteMs, note.timeMs);
        if (judgedRef.current.has(index)) return;
        allJudged = false;

        if (elapsedMs - note.timeMs > RHYTHM_MISS_WINDOW_MS) {
          judgedRef.current.add(index);
          applyJudgement('miss');
          return;
        }

        const remainingMs = note.timeMs - elapsedMs;
        if (remainingMs <= RHYTHM_NOTE_TRAVEL_MS && remainingMs >= -300) {
          const progress = 1 - remainingMs / RHYTHM_NOTE_TRAVEL_MS;
          // progress===1(diff=0)일 때 노트의 중심이 TapButton의 중심과 겹치도록.
          const targetTop = laneHeightRef.current - TAP_BUTTON_HEIGHT / 2 - NOTE_HEIGHT / 2;
          next.push({ index, lane: note.lane, top: progress * targetTop });
        }
      });

      setVisibleNotes(next);
      setProgressPercent((elapsedMs / (lastNoteMs + RHYTHM_MISS_WINDOW_MS)) * 100);

      if ((allJudged && elapsedMs > lastNoteMs + 500) || endedRef.current) {
        finishGame();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stopLoop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, chart, countdown]);

  const handleSelectStart = async (chartId: string) => {
    setErrorText('');
    const summary = charts.find((c) => c._id === chartId);
    if (!summary) {
      setErrorText('곡을 찾을 수 없습니다');
      return;
    }

    // 노래 맞추기(useYoutubeSnippetPlayer)와 같은 방식으로 재생을 트리거한다.
    player.start(summary.youtubeId, summary.startSeconds);

    try {
      const detail = await fetchChart.mutateAsync(chartId);
      if (detail.notes.length === 0) {
        player.stop();
        setErrorText('아직 박자맵이 준비되지 않은 곡이에요');
        return;
      }
      setChart(detail);
      setSelectedId(chartId);

      judgedRef.current = new Set();
      gameStartOffsetRef.current = null;
      comboRef.current = 0;
      maxComboRef.current = 0;
      scoreRef.current = 0;
      perfectRef.current = 0;
      greatRef.current = 0;
      missRef.current = 0;
      endedRef.current = false;
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setPerfectCount(0);
      setGreatCount(0);
      setMissCount(0);
      setVisibleNotes([]);
      setProgressPercent(0);

      setPhase('playing');
      setCountdown(3);
    } catch (err) {
      player.stop();
      setErrorText(err instanceof Error ? err.message : '곡을 불러올 수 없습니다');
    }
  };

  // 소리는 클릭 즉시 재생되지만(제스처 보존), 노트 판정 루프는 이 카운트다운이
  // 0 밑으로 내려가(= "GO"가 사라지는 순간) 비로소 시작된다. 3,2,1,GO를 보여주고 사라진다.
  useEffect(() => {
    if (phase !== 'playing' || countdown < 0) return;
    const delay = countdown === 0 ? 500 : 700;
    const t = setTimeout(() => setCountdown((c) => c - 1), delay);
    return () => clearTimeout(t);
  }, [phase, countdown]);


  const handleRegister = async () => {
    if (!nickname.trim() || !resultId) return;
    try {
      await updateNickname.mutateAsync({ id: resultId, nickname: nickname.trim() });
      setRegistered(true);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : '등록에 실패했습니다');
    }
  };

  const handleBackToSelect = () => {
    setPhase('select');
    setChart(null);
    setSelectedId('');
    setErrorText('');
  };

  const totalJudged = perfectCount + greatCount + missCount;
  const accuracy = totalJudged > 0 ? (perfectCount + greatCount * 0.6) / totalJudged : 0;

  const breakdown = useMemo(() => {
    const max = Math.max(perfectCount, greatCount, missCount, 1);
    return [
      { label: 'PERFECT', value: perfectCount, color: '#C9A96E' },
      { label: 'GREAT', value: greatCount, color: '#B09A7E' },
      { label: 'MISS', value: missCount, color: '#C75B5B' },
    ].map((row) => ({ ...row, percent: (row.value / max) * 100 }));
  }, [perfectCount, greatCount, missCount]);

  return (
    <PageWrapper>
      {phase === 'select' && (
        <IntroCard>
          <IntroWrap>
            <Eyebrow>NEW GAME</Eyebrow>
            <IntroTitle>로로비트</IntroTitle>
            <IntroDesc>노래에 맞춰 떨어지는 노트를 정확한 타이밍에 눌러보세요</IntroDesc>
          </IntroWrap>

          {errorText && <ErrorText>{errorText}</ErrorText>}

          <SongList>
            {chartsLoading ? (
              <ErrorText>불러오는 중...</ErrorText>
            ) : charts.length === 0 ? (
              <ErrorText>아직 플레이할 수 있는 곡이 없어요</ErrorText>
            ) : (
              charts.map((c) => (
                <SongCard
                  key={c._id}
                  type="button"
                  $selected={selectedId === c._id}
                  onClick={() => setSelectedId(c._id)}
                >
                  <SongArt />
                  <SongInfo>
                    <SongTitle>{c.title}</SongTitle>
                    <SongMeta>4레인 · BPM {c.bpm}</SongMeta>
                  </SongInfo>
                  <DifficultyPill $difficulty={c.difficulty}>{RHYTHM_DIFFICULTY_LABEL[c.difficulty]}</DifficultyPill>
                </SongCard>
              ))
            )}
          </SongList>

          <PrimaryButton
            type="button"
            disabled={!selectedId || fetchChart.isPending}
            onClick={() => handleSelectStart(selectedId)}
          >
            {fetchChart.isPending ? '불러오는 중...' : '시작하기'}
          </PrimaryButton>
        </IntroCard>
      )}

      {phase === 'playing' && chart && (
        <PlayWrap>
          <div ref={player.containerRef} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />

          {countdown >= 0 && <CountdownOverlay>{countdown > 0 ? countdown : 'GO'}</CountdownOverlay>}

          <GlowBlob $color="rgba(94,234,212,0.28)" $top={-140} $left={-100} />
          <GlowBlob $color="rgba(255,111,176,0.26)" $top={-80} $right={-120} />
          <GlowBlob $color="rgba(255,213,74,0.22)" $bottom={-100} $left={120} />

          <PlayTopBar>
            <span>{chart.title} · {RHYTHM_DIFFICULTY_LABEL[chart.difficulty]}</span>
            <ScoreText>{score.toLocaleString('ko-KR')}</ScoreText>
          </PlayTopBar>
          {errorText && (
            <div style={{ position: 'relative', zIndex: 2, padding: '4px 18px 0' }}>
              <ErrorText>{errorText}</ErrorText>
            </div>
          )}
          <ProgressTrack><ProgressFill $percent={progressPercent} /></ProgressTrack>

          <ComboWrap>
            <ComboNumber>{combo}</ComboNumber>
            <ComboLabel>COMBO</ComboLabel>
          </ComboWrap>

          {judgementFlash && (
            <JudgementFlash key={judgementFlash.key} $judgement={judgementFlash.judgement}>
              {judgementFlash.judgement.toUpperCase()}{judgementFlash.judgement !== 'miss' ? '!' : ''}
            </JudgementFlash>
          )}

          <LaneArea ref={laneAreaRef}>
            {Array.from({ length: RHYTHM_LANE_COUNT }).map((_, lane) => {
              const color = RHYTHM_LANE_COLORS[lane];
              return (
                <Lane key={lane}>
                  {visibleNotes
                    .filter((n) => n.lane === lane)
                    .map((n) => (
                      <Note key={n.index} $top={n.top} $from={color.from} $to={color.to} $glow={color.glow} />
                    ))}
                  {burst?.lane === lane && <HitBurst key={burst.key} />}
                  <TapButton
                    type="button"
                    aria-label={`레인 ${lane + 1}`}
                    $from={color.from}
                    $to={color.to}
                    $glow={color.glow}
                    $pressed={pressedLane === lane}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleLaneInput(lane);
                    }}
                  />
                </Lane>
              );
            })}
          </LaneArea>
        </PlayWrap>
      )}

      {phase === 'result' && chart && (
        <IntroCard>
          <ResultWrap>
            <Eyebrow>RESULT</Eyebrow>
            <div style={{ fontSize: '0.85rem', color: '#7A6E5D' }}>{chart.title} · {RHYTHM_DIFFICULTY_LABEL[chart.difficulty]}</div>
            <ScoreCircle>
              <strong>{score.toLocaleString('ko-KR')}</strong>
              <span>점수</span>
            </ScoreCircle>
            <GradeBadge>최고 콤보 {maxCombo} · {gradeLabel(accuracy)}랭크</GradeBadge>
          </ResultWrap>

          <BreakdownBox>
            {breakdown.map((row) => (
              <BreakdownRow key={row.label}>
                <BreakdownLabel $color={row.color}>{row.label}</BreakdownLabel>
                <BreakdownTrack><BreakdownFill $percent={row.percent} $color={row.color} /></BreakdownTrack>
                <BreakdownValue>{row.value}</BreakdownValue>
              </BreakdownRow>
            ))}
          </BreakdownBox>

          <BreakdownBox>
            {registered ? (
              <RegisteredNote>랭킹에 등록됐어요!</RegisteredNote>
            ) : (
              <>
                <div style={{ fontSize: '0.78rem', color: '#7A6E5D' }}>랭킹에 등록할 닉네임</div>
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
          </BreakdownBox>

          {ranking.length > 0 && (
            <BreakdownBox>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7A6E5D' }}>이 곡 랭킹 TOP 5</div>
              <RankList>
                {ranking.slice(0, 5).map((row) => (
                  <RankRow key={row.resultId} $isMe={row.isMe}>
                    <span style={{ width: 20, fontWeight: 700 }}>{row.rank}</span>
                    <span style={{ flex: 1 }}>{row.nickname}{row.isMe ? ' (나)' : ''}</span>
                    <span style={{ fontWeight: 700 }}>{row.score.toLocaleString('ko-KR')}</span>
                  </RankRow>
                ))}
              </RankList>
            </BreakdownBox>
          )}

          <ResultActions>
            <SecondaryButton type="button" onClick={() => handleSelectStart(chart._id)}>다시 하기</SecondaryButton>
            <SecondaryButton type="button" onClick={handleBackToSelect}>곡 선택</SecondaryButton>
          </ResultActions>
          {errorText && <ErrorText>{errorText}</ErrorText>}
        </IntroCard>
      )}
    </PageWrapper>
  );
}
