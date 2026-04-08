'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useFanchants } from '@/hooks/queries/useFanchants';
import type { FontSize } from './Fanchant.styles';
import {
  PageWrapper,
  ContentArea,
  PageHeader,
  PageTitle,
  PageSubtitle,
  ToolBar,
  SearchInput,
  ToolGroup,
  ToolButton,
  SongList,
  SongCard,
  SongCardHeader,
  AlbumThumb,
  AlbumPlaceholder,
  SongInfo,
  SongTitle,
  AlbumName,
  ExpandIcon,
  SongCardBody,
  LegendRow,
  LegendItem,
  LyricsBlock,
  LyricLine,
  LyricSpan,
  EmptyMessage,
  FloatingBar,
  FloatingLabel,
  Toggle,
} from './Fanchant.styles';

const FONT_SIZES: FontSize[] = ['sm', 'md', 'lg'];
const FONT_LABELS = { sm: 'A−', md: 'A', lg: 'A+' };

export default function FanchantPageClient() {
  const { data: fanchants = [], isLoading } = useFanchants();

  const [nightMode, setNightMode] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [wakeLock, setWakeLock] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel | null>(null);

  // 야간 모드 localStorage 복원
  useEffect(() => {
    const saved = localStorage.getItem('fanchant-night');
    if (saved === 'true') setNightMode(true);
    const savedFont = localStorage.getItem('fanchant-font') as FontSize | null;
    if (savedFont && FONT_SIZES.includes(savedFont)) setFontSize(savedFont);
    setWakeLockSupported('wakeLock' in navigator);
  }, []);

  const toggleNight = () => {
    setNightMode(v => {
      localStorage.setItem('fanchant-night', String(!v));
      return !v;
    });
  };

  const cycleFontSize = (dir: 'up' | 'down') => {
    setFontSize(prev => {
      const idx = FONT_SIZES.indexOf(prev);
      const next =
        dir === 'up'
          ? FONT_SIZES[Math.min(idx + 1, FONT_SIZES.length - 1)]
          : FONT_SIZES[Math.max(idx - 1, 0)];
      localStorage.setItem('fanchant-font', next);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleWakeLock = useCallback(async () => {
    if (!wakeLockSupported) return;
    if (wakeLock && wakeLockSentinel) {
      await wakeLockSentinel.release();
      setWakeLockSentinel(null);
      setWakeLock(false);
    } else {
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        setWakeLockSentinel(sentinel);
        setWakeLock(true);
        sentinel.addEventListener('release', () => {
          setWakeLock(false);
          setWakeLockSentinel(null);
        });
      } catch {
        // 권한 거부 등 — 조용히 실패
      }
    }
  }, [wakeLock, wakeLockSentinel, wakeLockSupported]);

  const filtered = fanchants.filter(f =>
    f.songTitle.toLowerCase().includes(search.toLowerCase()) ||
    f.album.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper $night={nightMode}>
      <PageHeader>
        <PageTitle $night={nightMode}>응원법</PageTitle>
        <PageSubtitle $night={nightMode}>
          한로로와 함께 소리쳐요 —{' '}
          <strong style={{ color: nightMode ? '#DEC596' : '#C9A96E' }}>골드 굵은 글씨</strong>
          가 팬들의 응원 타이밍이에요
        </PageSubtitle>
      </PageHeader>

      <ToolBar $night={nightMode}>
        <SearchInput
          $night={nightMode}
          type="text"
          placeholder="곡명 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <ToolGroup>
          <ToolButton
            $night={nightMode}
            $active={fontSize === 'sm'}
            onClick={() => cycleFontSize('down')}
            aria-label="글씨 작게"
            disabled={fontSize === 'sm'}
          >
            A−
          </ToolButton>
          <ToolButton
            $night={nightMode}
            $active={fontSize === 'lg'}
            onClick={() => cycleFontSize('up')}
            aria-label="글씨 크게"
            disabled={fontSize === 'lg'}
          >
            A+
          </ToolButton>
        </ToolGroup>

        <ToolButton
          $night={nightMode}
          $active={nightMode}
          onClick={toggleNight}
          aria-label={nightMode ? '야간 모드 끄기' : '야간 모드 켜기'}
        >
          {nightMode ? '☀ 일반' : '🌙 야간'}
        </ToolButton>
      </ToolBar>

      <ContentArea>
        {isLoading ? (
          <EmptyMessage $night={nightMode}>불러오는 중...</EmptyMessage>
        ) : filtered.length === 0 ? (
          <EmptyMessage $night={nightMode}>
            {search ? `"${search}" 검색 결과가 없습니다` : '등록된 응원법이 없습니다'}
          </EmptyMessage>
        ) : (
          <SongList>
            {filtered.map((fanchant, index) => {
              const expanded = expandedIds.has(fanchant._id);
              return (
                <SongCard
                  key={fanchant._id}
                  $night={nightMode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SongCardHeader
                    $night={nightMode}
                    onClick={() => toggleExpand(fanchant._id)}
                    aria-expanded={expanded}
                  >
                    {fanchant.albumImageUrl ? (
                      <AlbumThumb src={fanchant.albumImageUrl} alt={fanchant.album} />
                    ) : (
                      <AlbumPlaceholder>🎵</AlbumPlaceholder>
                    )}

                    <SongInfo>
                      <SongTitle $night={nightMode}>{fanchant.songTitle}</SongTitle>
                      <AlbumName $night={nightMode}>{fanchant.album}</AlbumName>
                    </SongInfo>

                    <ExpandIcon $expanded={expanded} $night={nightMode}>
                      ▾
                    </ExpandIcon>
                  </SongCardHeader>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <SongCardBody
                        $night={nightMode}
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <LegendRow>
                          <LegendItem $type="artist" $night={nightMode}>
                            ● 한로로 파트
                          </LegendItem>
                          <LegendItem $type="fan" $night={nightMode}>
                            ● 응원 구호
                          </LegendItem>
                          <LegendItem $type="clap" $night={nightMode}>
                            ● 박수 타이밍
                          </LegendItem>
                          <LegendItem $type="rest" $night={nightMode}>
                            ● 간주/쉬는 구간
                          </LegendItem>
                        </LegendRow>

                        <LyricsBlock $fontSize={fontSize}>
                          {fanchant.lyrics.map((line, idx) => {
                            // 구 포맷({ text, type }) 호환
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const raw = line as any;
                            const segments =
                              Array.isArray(line.segments) && line.segments.length > 0
                                ? line.segments
                                : [{ text: raw.text ?? '', type: raw.type ?? 'artist' }];
                            const isRest =
                              segments.length === 1 && segments[0].type === 'rest';
                            return (
                              <LyricLine key={idx} $isRest={isRest} $night={nightMode}>
                                {segments.map((seg, segIdx) => (
                                  <LyricSpan key={segIdx} $type={seg.type} $night={nightMode}>
                                    {seg.text}
                                  </LyricSpan>
                                ))}
                              </LyricLine>
                            );
                          })}
                        </LyricsBlock>
                      </SongCardBody>
                    )}
                  </AnimatePresence>
                </SongCard>
              );
            })}
          </SongList>
        )}
      </ContentArea>

      {/* 화면 켜짐 유지 — 모바일 전용 */}
      <FloatingBar $night={nightMode}>
        <FloatingLabel $night={nightMode}>화면 켜짐 유지</FloatingLabel>
        <Toggle
          $on={wakeLock}
          $night={nightMode}
          onClick={handleWakeLock}
          disabled={!wakeLockSupported}
          aria-label={wakeLock ? '화면 켜짐 유지 끄기' : '화면 켜짐 유지 켜기'}
          title={wakeLockSupported ? undefined : '지원하지 않는 환경입니다'}
        />
      </FloatingBar>
    </PageWrapper>
  );
}
