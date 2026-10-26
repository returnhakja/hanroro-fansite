'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  useAdminRhythmChart,
  useUpdateRhythmChart,
} from '@/hooks/queries/useAdminRhythmGame';
import { useAdminRhythmPlayer } from '@/lib/game/useAdminRhythmPlayer';
import {
  RHYTHM_LANE_COUNT,
  RHYTHM_LANE_COLORS,
  RHYTHM_LANE_KEYS,
  RHYTHM_DIFFICULTY_LABEL,
  type RhythmDifficultyValue,
} from '@/lib/game/rhythm';
import type { RhythmNote } from '@/types/api/rhythm';

const PIXELS_PER_SEC = 100;
const YT_STATE_PLAYING = 1;

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function RhythmChartEditorClient({ id }: { id: string }) {
  const { data: chart, isLoading } = useAdminRhythmChart(id);
  const updateChart = useUpdateRhythmChart();

  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [startSeconds, setStartSeconds] = useState(0);
  const [bpm, setBpm] = useState(100);
  const [offsetMs, setOffsetMs] = useState(0);
  const [difficulty, setDifficulty] = useState<RhythmDifficultyValue>('normal');
  const [isActive, setIsActive] = useState(false);
  const [notes, setNotes] = useState<RhythmNote[]>([]);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [rate, setRate] = useState(1);
  const [snapDivision, setSnapDivision] = useState(2);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  const timelineScrollRef = useRef<HTMLDivElement | null>(null);

  const handleStateChange = useCallback((state: number) => {
    setIsPlaying(state === YT_STATE_PLAYING);
  }, []);

  const player = useAdminRhythmPlayer(handleStateChange);

  // 서버에서 받아온 값으로 폼 초기화(한 번만)
  useEffect(() => {
    if (chart && !loadedOnce) {
      setTitle(chart.title);
      setYoutubeId(chart.youtubeId);
      setStartSeconds(chart.startSeconds);
      setBpm(chart.bpm);
      setOffsetMs(chart.offsetMs);
      setDifficulty(chart.difficulty);
      setIsActive(chart.isActive);
      setNotes(chart.notes);
      setLoadedOnce(true);
    }
  }, [chart, loadedOnce]);

  useEffect(() => {
    if (loadedOnce && youtubeId) {
      player.loadVideo(youtubeId, startSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedOnce]);

  // 재생 위치/길이 폴링 (재생 중이든 아니든 계속 — 네이티브 컨트롤로 탐색해도 반영되게)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSec(player.getCurrentTime());
      const d = player.getDuration();
      if (d > 0) setDurationSec(d);
    }, 150);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beatIntervalSec = 60 / bpm;
  const snapIntervalSec = beatIntervalSec / snapDivision;
  const playableDurationSec = Math.max(durationSec - startSeconds, 60);
  const timelineWidthPx = playableDurationSec * PIXELS_PER_SEC;

  const gridLinesMs = useMemo(() => {
    const stepMs = snapIntervalSec * 1000;
    if (!Number.isFinite(stepMs) || stepMs <= 0) return [] as number[];
    const lines: number[] = [];
    let t = offsetMs;
    const maxMs = playableDurationSec * 1000;
    let guard = 0;
    while (t <= maxMs && guard < 8000) {
      lines.push(Math.round(t));
      t += stepMs;
      guard += 1;
    }
    return lines;
  }, [snapIntervalSec, offsetMs, playableDurationSec]);

  const toggleNote = useCallback((lane: number, timeMs: number) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.lane === lane && Math.abs(n.timeMs - timeMs) < 1);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [...prev, { lane, timeMs }].sort((a, b) => a.timeMs - b.timeMs);
    });
    setSaved(false);
  }, []);

  const snapToGrid = useCallback(
    (timeMs: number): number => {
      const stepMs = snapIntervalSec * 1000;
      if (!Number.isFinite(stepMs) || stepMs <= 0) return Math.max(0, Math.round(timeMs));
      const index = Math.round((timeMs - offsetMs) / stepMs);
      return Math.max(0, Math.round(offsetMs + index * stepMs));
    },
    [snapIntervalSec, offsetMs]
  );

  const handleLaneClick = (lane: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const timeMs = (xPx / PIXELS_PER_SEC) * 1000;
    toggleNote(lane, snapToGrid(timeMs));
  };

  // 재생 중 d/f/j/k로 실시간 탭 입력 → 현재 재생 위치를 그리드에 스냅해서 노트로 찍음
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const lane = RHYTHM_LANE_KEYS.indexOf(e.key.toLowerCase());
      if (lane === -1 || !isPlaying) return;
      const liveSec = player.getCurrentTime();
      const timeMs = (liveSec - startSeconds) * 1000;
      if (timeMs < 0) return;
      toggleNote(lane, snapToGrid(timeMs));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, startSeconds, snapToGrid, toggleNote, player]);

  // 재생 중엔 재생 위치가 보이도록 타임라인을 자동 스크롤
  useEffect(() => {
    if (!isPlaying || !timelineScrollRef.current) return;
    const playheadPx = Math.max(0, currentSec - startSeconds) * PIXELS_PER_SEC;
    const container = timelineScrollRef.current;
    const target = playheadPx - container.clientWidth / 2;
    container.scrollLeft = Math.max(0, target);
  }, [currentSec, isPlaying, startSeconds]);

  // 외부에서 자동으로 뽑아낸 비트맵 JSON({ bpm?, offsetMs?, startSeconds?, notes: [{lane,timeMs}] })을
  // 붙여넣어서 한 번에 반영한다. 직접 클릭/실시간 탭으로 일일이 찍는 대신 쓸 수 있는 가져오기 기능.
  const handleApplyImport = () => {
    setImportError('');
    let parsed: any;
    try {
      parsed = JSON.parse(importText);
    } catch {
      setImportError('올바른 JSON이 아니에요');
      return;
    }
    if (!Array.isArray(parsed?.notes)) {
      setImportError('notes 배열이 없어요');
      return;
    }
    const parsedNotes: RhythmNote[] = [];
    for (const n of parsed.notes) {
      const lane = Number(n?.lane);
      const timeMs = Number(n?.timeMs);
      if (!Number.isInteger(lane) || lane < 0 || lane >= RHYTHM_LANE_COUNT) {
        setImportError(`레인 값이 잘못됐어요: ${JSON.stringify(n)}`);
        return;
      }
      if (!Number.isFinite(timeMs) || timeMs < 0) {
        setImportError(`timeMs 값이 잘못됐어요: ${JSON.stringify(n)}`);
        return;
      }
      parsedNotes.push({ lane, timeMs: Math.round(timeMs) });
    }
    parsedNotes.sort((a, b) => a.timeMs - b.timeMs);

    if (Number.isFinite(Number(parsed.bpm))) setBpm(Number(parsed.bpm));
    if (Number.isFinite(Number(parsed.offsetMs))) setOffsetMs(Math.round(Number(parsed.offsetMs)));
    if (Number.isFinite(Number(parsed.startSeconds))) setStartSeconds(Number(parsed.startSeconds));
    setNotes(parsedNotes);
    setSaved(false);
    setShowImport(false);
    setImportText('');
  };

  const handleSave = async () => {
    setSaveError('');
    if (isActive && notes.length === 0) {
      setSaveError('박자맵이 없는 곡은 활성화할 수 없어요. 노트를 먼저 찍어주세요.');
      return;
    }
    try {
      await updateChart.mutateAsync({
        id,
        values: { title, youtubeId, startSeconds, bpm, offsetMs, difficulty, isActive, notes },
      });
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '저장에 실패했습니다');
    }
  };

  if (isLoading || !loadedOnce) {
    return <LoadingWrap>불러오는 중...</LoadingWrap>;
  }

  return (
    <Page>
      <TopBar>
        <TopLeft>
          <BackLink href="/admin/game/rhythm">‹ 목록으로</BackLink>
          <PageTitle>{title || '(제목 없음)'} — 차트 편집</PageTitle>
          <DifficultyPill>{RHYTHM_DIFFICULTY_LABEL[difficulty]} · BPM {bpm}</DifficultyPill>
        </TopLeft>
        <TopRight>
          {saveError && <ErrorText>{saveError}</ErrorText>}
          {saved && !saveError && <SavedText>저장됨</SavedText>}
          <ImportButton type="button" onClick={() => setShowImport((v) => !v)}>
            JSON 가져오기
          </ImportButton>
          <SaveButton type="button" onClick={handleSave} disabled={updateChart.isPending}>
            {updateChart.isPending ? '저장 중...' : '저장'}
          </SaveButton>
        </TopRight>
      </TopBar>

      {showImport && (
        <ImportPanel>
          <ImportHint>
            자동 채보 결과(JSON)를 붙여넣으면 bpm/오프셋/시작 초/노트가 한 번에 반영돼요. 적용 후에도 "저장"을 눌러야 실제로 저장됩니다.
          </ImportHint>
          <ImportTextarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{"bpm": 117.5, "offsetMs": 1347, "startSeconds": 0.28, "notes": [{"lane": 0, "timeMs": 1277}, ...]}'
          />
          {importError && <ErrorText>{importError}</ErrorText>}
          <ImportActions>
            <SecondaryButton type="button" onClick={() => { setShowImport(false); setImportText(''); setImportError(''); }}>
              취소
            </SecondaryButton>
            <SaveButton type="button" onClick={handleApplyImport}>적용</SaveButton>
          </ImportActions>
        </ImportPanel>
      )}

      <MetaPanel>
        <FieldBlock>
          <FieldLabel>곡 제목</FieldLabel>
          <TextInput value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false); }} />
        </FieldBlock>
        <FieldBlock>
          <FieldLabel>유튜브 링크/ID</FieldLabel>
          <TextInput value={youtubeId} onChange={(e) => { setYoutubeId(e.target.value); setSaved(false); }} />
        </FieldBlock>
        <FieldBlock style={{ flex: '0 0 90px' }}>
          <FieldLabel>시작 초</FieldLabel>
          <NumberInput type="number" min={0} value={startSeconds} onChange={(e) => { setStartSeconds(Number(e.target.value)); setSaved(false); }} />
        </FieldBlock>
        <FieldBlock style={{ flex: '0 0 90px' }}>
          <FieldLabel>BPM</FieldLabel>
          <NumberInput type="number" min={20} max={300} value={bpm} onChange={(e) => { setBpm(Number(e.target.value)); setSaved(false); }} />
        </FieldBlock>
        <FieldBlock style={{ flex: '0 0 100px' }}>
          <FieldLabel>오프셋(ms)</FieldLabel>
          <NumberInput type="number" value={offsetMs} onChange={(e) => { setOffsetMs(Number(e.target.value)); setSaved(false); }} />
        </FieldBlock>
        <FieldBlock style={{ flex: '0 0 90px' }}>
          <FieldLabel>난이도</FieldLabel>
          <SelectInput value={difficulty} onChange={(e) => { setDifficulty(e.target.value as RhythmDifficultyValue); setSaved(false); }}>
            {(['easy', 'normal', 'hard'] as const).map((d) => (
              <option key={d} value={d}>{RHYTHM_DIFFICULTY_LABEL[d]}</option>
            ))}
          </SelectInput>
        </FieldBlock>
        <FieldBlock style={{ flex: '0 0 auto' }}>
          <FieldLabel>&nbsp;</FieldLabel>
          <ActiveToggle>
            <input type="checkbox" checked={isActive} onChange={(e) => { setIsActive(e.target.checked); setSaved(false); }} />
            활성화(플레이 목록에 노출)
          </ActiveToggle>
        </FieldBlock>
      </MetaPanel>

      <TransportBar>
        <div ref={player.containerRef} />
        <PlayPauseButton type="button" onClick={() => (isPlaying ? player.pause() : player.play())}>
          {isPlaying ? '일시정지' : '재생'}
        </PlayPauseButton>
        <TimeText>{formatTime(currentSec)} / {formatTime(durationSec)}</TimeText>

        <SpeedRow>
          {[0.5, 1, 1.5, 2].map((r) => (
            <SpeedPill
              key={r}
              type="button"
              $active={rate === r}
              onClick={() => { player.setRate(r); setRate(r); }}
            >
              {r}x
            </SpeedPill>
          ))}
        </SpeedRow>

        <Divider />

        <SnapRow>
          <span>스냅</span>
          <SelectInput
            style={{ width: 90 }}
            value={snapDivision}
            onChange={(e) => setSnapDivision(Number(e.target.value))}
          >
            <option value={1}>1비트</option>
            <option value={2}>1/2비트</option>
            <option value={4}>1/4비트</option>
          </SelectInput>
        </SnapRow>

        <HintText>빈칸 클릭 = 노트 추가 · 노트 클릭 = 삭제 · 재생 중 D F J K = 실시간 탭 입력</HintText>
      </TransportBar>

      <TimelinePanel>
        <TimelineScroll ref={timelineScrollRef}>
          <TimelineInner style={{ width: timelineWidthPx }}>
            <Playhead style={{ left: Math.max(0, currentSec - startSeconds) * PIXELS_PER_SEC }} />

            {Array.from({ length: RHYTHM_LANE_COUNT }).map((_, lane) => {
              const color = RHYTHM_LANE_COLORS[lane];
              return (
                <LaneRow key={lane} onClick={(e) => handleLaneClick(lane, e)}>
                  <LaneLabel style={{ color: color.to }}>레인 {lane + 1} ({RHYTHM_LANE_KEYS[lane].toUpperCase()})</LaneLabel>
                  {gridLinesMs.map((ms) => (
                    <GridTick key={ms} style={{ left: (ms / 1000) * PIXELS_PER_SEC }} />
                  ))}
                  {notes
                    .filter((n) => n.lane === lane)
                    .map((n) => (
                      <NoteBlock
                        key={n.timeMs}
                        style={{
                          left: (n.timeMs / 1000) * PIXELS_PER_SEC,
                          background: `linear-gradient(180deg, ${color.from} 0%, ${color.to} 100%)`,
                          boxShadow: `0 0 8px ${color.glow}`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNote(lane, n.timeMs);
                        }}
                      />
                    ))}
                </LaneRow>
              );
            })}
          </TimelineInner>
        </TimelineScroll>
      </TimelinePanel>

      <NoteCountText>총 {notes.length}개 노트</NoteCountText>
    </Page>
  );
}

const LoadingWrap = styled.div`
  padding: 4rem;
  text-align: center;
  color: #a99e8f;
`;

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const BackLink = styled(Link)`
  font-size: 0.8rem;
  color: #7a6e5d;
  text-decoration: underline;
`;

const PageTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: #2c3e50;
`;

const DifficultyPill = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  background: #f5f0e8;
  color: #7a6e5d;
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ErrorText = styled.span`
  font-size: 0.78rem;
  color: #c0392b;
`;

const SavedText = styled.span`
  font-size: 0.78rem;
  color: #6b8e6b;
  font-weight: 700;
`;

const SaveButton = styled.button`
  padding: 0.5rem 1.1rem;
  border: none;
  border-radius: 8px;
  background: #8b7355;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;

  &:hover { background: #6b5740; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ImportButton = styled.button`
  padding: 0.5rem 1.1rem;
  border: 1px solid #8b7355;
  border-radius: 8px;
  background: #fff;
  color: #8b7355;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;

  &:hover { background: #f5f0e8; }
`;

const ImportPanel = styled.div`
  background: #fff;
  border: 1px solid #e5ddd0;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 4px rgba(44,36,24,0.06);
`;

const ImportHint = styled.p`
  margin: 0;
  font-size: 0.74rem;
  color: #a99e8f;
`;

const ImportTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.76rem;
  font-family: 'JetBrains Mono', Consolas, monospace;
  box-sizing: border-box;
  resize: vertical;

  &:focus { outline: none; border-color: #8b7355; }
`;

const ImportActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const SecondaryButton = styled.button`
  padding: 0.5rem 1.1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  color: #7a6e5d;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;

  &:hover { background: #f5f0e8; }
`;

const MetaPanel = styled.div`
  background: #fff;
  border: 1px solid #e5ddd0;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  box-shadow: 0 1px 4px rgba(44,36,24,0.06);
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 120px;
`;

const FieldLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: #7a6e5d;
`;

const TextInput = styled.input`
  padding: 7px 9px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.8rem;
  width: 100%;
  box-sizing: border-box;

  &:focus { outline: none; border-color: #8b7355; }
`;

const NumberInput = styled(TextInput)``;

const SelectInput = styled.select`
  padding: 7px 9px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.8rem;
  width: 100%;
  box-sizing: border-box;
  background: #fff;

  &:focus { outline: none; border-color: #8b7355; }
`;

const ActiveToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #2c3e50;
  white-space: nowrap;
  padding-top: 7px;
`;

const TransportBar = styled.div`
  background: #fff;
  border: 1px solid #e5ddd0;
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  box-shadow: 0 1px 4px rgba(44,36,24,0.06);
`;

const PlayPauseButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #2c3e50;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
`;

const TimeText = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #2c3e50;
  font-variant-numeric: tabular-nums;
`;

const SpeedRow = styled.div`
  display: flex;
  gap: 6px;
`;

const SpeedPill = styled.button<{ $active: boolean }>`
  border: none;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  background: ${(p) => (p.$active ? '#8b7355' : '#f5f0e8')};
  color: ${(p) => (p.$active ? '#fff' : '#7a6e5d')};
`;

const Divider = styled.div`
  width: 1px;
  height: 22px;
  background: #e5ddd0;
`;

const SnapRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #7a6e5d;
  font-weight: 700;
`;

const HintText = styled.span`
  margin-left: auto;
  font-size: 0.72rem;
  color: #a99e8f;
`;

const TimelinePanel = styled.div`
  background: #fff;
  border: 1px solid #e5ddd0;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(44,36,24,0.06);
  overflow: hidden;
`;

const TimelineScroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
`;

const TimelineInner = styled.div`
  position: relative;
`;

const Playhead = styled.div`
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: #c75b5b;
  z-index: 3;
`;

const LaneRow = styled.div`
  position: relative;
  height: 54px;
  border-bottom: 1px solid #f0ebe2;
  cursor: pointer;
`;

const LaneLabel = styled.span`
  position: absolute;
  left: 8px;
  top: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  z-index: 2;
  pointer-events: none;
`;

const GridTick = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(44,36,24,0.08);
  pointer-events: none;
`;

const NoteBlock = styled.div`
  position: absolute;
  top: 10px;
  width: 30px;
  height: 34px;
  margin-left: -15px;
  border-radius: 6px;
  cursor: pointer;
`;

const NoteCountText = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #a99e8f;
`;
