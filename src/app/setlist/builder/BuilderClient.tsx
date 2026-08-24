'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDragControls } from 'framer-motion';
import { getAllSongs } from '@/lib/utils/songs';
import { useCreateFavoriteSetlist } from '@/hooks/queries/useFavoriteSetlist';
import {
  Container,
  PageTitle,
  PageSubtitle,
  BuilderFrame,
  BuilderTopbar,
  CountPill,
  Panes,
  Pane,
  PaneLabel,
  SearchInput,
  SongList,
  SongRow,
  SongSwatch,
  SongTitle,
  RoundButton,
  PickList,
  PickRow,
  PickNum,
  PickTitle,
  DragHandle,
  ReorderGroup,
  TinyButton,
  RemoveButton,
  EmptyPick,
  FinishButton,
} from './Builder.styles';

const MAX_SONGS = 20;
const DRAFT_KEY = 'hanroro-setlist-draft';

const IconGrip = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
    <circle cx="9" cy="6" r="1.5" />
    <circle cx="15" cy="6" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="18" r="1.5" />
    <circle cx="15" cy="18" r="1.5" />
  </svg>
);

function PickListItem({
  title,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  title: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <PickRow value={title} dragListener={false} dragControls={dragControls}>
      <DragHandle onPointerDown={(e) => dragControls.start(e)} aria-hidden>
        <IconGrip />
      </DragHandle>
      <ReorderGroup>
        <TinyButton
          type="button"
          $disabled={index === 0}
          disabled={index === 0}
          onClick={onMoveUp}
          aria-label="위로 이동"
        >
          ▲
        </TinyButton>
        <TinyButton
          type="button"
          $disabled={index === total - 1}
          disabled={index === total - 1}
          onClick={onMoveDown}
          aria-label="아래로 이동"
        >
          ▼
        </TinyButton>
      </ReorderGroup>
      <PickNum>{String(index + 1).padStart(2, '0')}</PickNum>
      <PickTitle>{title}</PickTitle>
      <RemoveButton type="button" onClick={onRemove} aria-label="빼기">
        ×
      </RemoveButton>
    </PickRow>
  );
}

export default function BuilderClient() {
  const router = useRouter();
  const allSongs = useMemo(() => getAllSongs(), []);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const createMutation = useCreateFavoriteSetlist();

  // 임시 목록을 브라우저에 저장해, 새로고침해도 고른 곡이 안 날아가게 함
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (saved) setPicked(JSON.parse(saved));
    } catch {
      // 손상된 값이면 무시하고 빈 목록으로 시작
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(picked));
    } catch {
      // localStorage 사용 불가 환경(프라이빗 모드 등)이면 그냥 세션 내에서만 유지
    }
  }, [picked, hydrated]);

  const filteredSongs = useMemo(() => {
    const q = query.trim();
    if (!q) return allSongs;
    return allSongs.filter((song) => song.title.includes(q));
  }, [allSongs, query]);

  const isFull = picked.length >= MAX_SONGS;

  const addSong = (title: string) => {
    if (isFull || picked.includes(title)) return;
    setPicked((prev) => [...prev, title]);
  };

  const removeSong = (title: string) => {
    setPicked((prev) => prev.filter((t) => t !== title));
  };

  const moveSong = (index: number, direction: -1 | 1) => {
    setPicked((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleFinish = () => {
    if (picked.length === 0) return;
    createMutation.mutate(picked, {
      onSuccess: (setlist) => {
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
          // 무시
        }
        router.push(`/setlist/builder/${setlist._id}`);
      },
      onError: (error) => {
        alert(error instanceof Error ? error.message : '세트리스트를 저장할 수 없습니다');
      },
    });
  };

  return (
    <Container>
      <PageTitle>내 최애 세트리스트 만들기</PageTitle>
      <PageSubtitle>좋아하는 곡을 골라 나만의 세트리스트를 완성해보세요 (최대 {MAX_SONGS}곡)</PageSubtitle>

      <BuilderFrame>
        <BuilderTopbar>
          <strong>곡 고르기</strong>
          <CountPill $full={isFull}>
            {picked.length} / {MAX_SONGS}
          </CountPill>
        </BuilderTopbar>

        <Panes>
          <Pane>
            <PaneLabel>전체 곡</PaneLabel>
            <SearchInput
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="곡 제목 검색"
            />
            <SongList>
              {filteredSongs.map((song) => {
                const already = picked.includes(song.title);
                return (
                  <SongRow key={`${song.albumId}-${song.title}`}>
                    <SongSwatch $cover={song.coverUrl} />
                    <SongTitle>{song.title}</SongTitle>
                    <RoundButton
                      type="button"
                      $disabled={already || isFull}
                      onClick={() => addSong(song.title)}
                      title={already ? '이미 담았어요' : '담기'}
                    >
                      {already ? '✓' : '+'}
                    </RoundButton>
                  </SongRow>
                );
              })}
            </SongList>
          </Pane>

          <Pane $alt>
            <PaneLabel>내 세트리스트</PaneLabel>
            {picked.length === 0 ? (
              <EmptyPick>왼쪽에서 곡을 골라 담아보세요</EmptyPick>
            ) : (
              <PickList axis="y" values={picked} onReorder={setPicked}>
                {picked.map((title, index) => (
                  <PickListItem
                    key={title}
                    title={title}
                    index={index}
                    total={picked.length}
                    onMoveUp={() => moveSong(index, -1)}
                    onMoveDown={() => moveSong(index, 1)}
                    onRemove={() => removeSong(title)}
                  />
                ))}
              </PickList>
            )}
            <FinishButton
              type="button"
              disabled={picked.length === 0 || createMutation.isPending}
              onClick={handleFinish}
            >
              {createMutation.isPending ? '완성하는 중...' : '세트리스트 완성하기 →'}
            </FinishButton>
          </Pane>
        </Panes>
      </BuilderFrame>
    </Container>
  );
}
