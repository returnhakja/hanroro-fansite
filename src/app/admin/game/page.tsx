'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  useAdminGameSongs,
  useSaveAdminGameSongs,
  useAdminGameResults,
  useDeleteAdminGameResult,
  type AdminGameSongRow,
} from '@/hooks/queries/useAdminGame';
import { DIFFICULTY_LABEL } from '@/lib/game/difficulty';

export default function AdminGamePage() {
  const { data: songs, isLoading: songsLoading } = useAdminGameSongs();
  const saveSongs = useSaveAdminGameSongs();
  const { data: results = [], isLoading: resultsLoading } = useAdminGameResults();
  const deleteResult = useDeleteAdminGameResult();

  const [rows, setRows] = useState<AdminGameSongRow[]>([]);

  useEffect(() => {
    if (songs) setRows(songs);
  }, [songs]);

  const updateRow = (songTitle: string, patch: Partial<AdminGameSongRow>) => {
    setRows((prev) => prev.map((r) => (r.songTitle === songTitle ? { ...r, ...patch } : r)));
  };

  const handleSave = async () => {
    try {
      await saveSongs.mutateAsync(rows);
      alert('저장됐어요');
    } catch (err) {
      alert(err instanceof Error ? err.message : '저장에 실패했습니다');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 기록을 삭제할까요?')) return;
    try {
      await deleteResult.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  };

  const setCount = rows.filter((r) => r.youtubeId && r.startSeconds !== null).length;

  return (
    <Page>
      <PageHead>
        <Eyebrow>Admin · 음악 맞추기</Eyebrow>
        <h1>음악 맞추기 게임 관리</h1>
        <Lede>곡별 재생 구간(유튜브 영상ID + 시작 초)을 지정하고, 랭킹에 올라온 닉네임을 관리해요.</Lede>
      </PageHead>

      <Panel>
        <PanelHead>
          <div>
            <PanelTitle>곡별 재생 구간</PanelTitle>
            <PanelSub>스니펫은 이 시간부터 난이도별 길이(3/5/10초)만큼 재생돼요.</PanelSub>
          </div>
          <StatPill>{setCount} / {rows.length}곡 설정됨</StatPill>
        </PanelHead>
        <TableWrap>
          {songsLoading ? (
            <Empty>불러오는 중...</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>곡</th>
                  <th>유튜브 영상 ID</th>
                  <th>시작 초</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isSet = !!row.youtubeId && row.startSeconds !== null;
                  return (
                    <tr key={row.songTitle}>
                      <td>
                        <SongCell>
                          <SongTitle>{row.songTitle}</SongTitle>
                        </SongCell>
                      </td>
                      <td>
                        <TextInput
                          type="text"
                          placeholder="예: dQw4w9WgXcQ"
                          value={row.youtubeId}
                          onChange={(e) => updateRow(row.songTitle, { youtubeId: e.target.value })}
                        />
                      </td>
                      <td>
                        <TimeInput
                          type="number"
                          min={0}
                          placeholder="초"
                          value={row.startSeconds ?? ''}
                          onChange={(e) =>
                            updateRow(row.songTitle, {
                              startSeconds: e.target.value === '' ? null : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td>
                        <StatusTag $set={isSet}>{isSet ? '설정됨' : '미설정'}</StatusTag>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </TableWrap>
        <SaveBar>
          <SaveNote>미설정 곡은 게임 출제에서 자동 제외돼요</SaveNote>
          <SaveButton type="button" onClick={handleSave} disabled={saveSongs.isPending}>
            {saveSongs.isPending ? '저장 중...' : '변경사항 저장'}
          </SaveButton>
        </SaveBar>
      </Panel>

      <Panel>
        <PanelHead>
          <div>
            <PanelTitle>랭킹 관리</PanelTitle>
            <PanelSub>부적절한 닉네임이나 어뷰징으로 의심되는 기록을 삭제할 수 있어요.</PanelSub>
          </div>
          <StatPill>전체 {results.length}건</StatPill>
        </PanelHead>
        <TableWrap>
          {resultsLoading ? (
            <Empty>불러오는 중...</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>닉네임</th>
                  <th>난이도</th>
                  <th>점수</th>
                  <th>소요 시간</th>
                  <th>등록일</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r._id}>
                    <td>{r.nickname}</td>
                    <td>{DIFFICULTY_LABEL[r.difficulty]}</td>
                    <td>{r.score}/10</td>
                    <td>{Math.round(r.elapsedMs / 1000)}초</td>
                    <td>{new Date(r.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <DelButton type="button" onClick={() => handleDelete(r._id)}>삭제</DelButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </TableWrap>
      </Panel>
    </Page>
  );
}

const Page = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const PageHead = styled.div`
  h1 { margin: 0.3rem 0 0.3rem; font-size: 1.4rem; color: #2c3e50; }
`;

const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a99e8f;
`;

const Lede = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: #7a6e5d;
`;

const Panel = styled.div`
  background: #fff;
  border: 1px solid #e5ddd0;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(44, 36, 24, 0.06);
  overflow: hidden;
`;

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5ddd0;
`;

const PanelTitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #2c3e50;
`;

const PanelSub = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  color: #a99e8f;
`;

const StatPill = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f5f0e8;
  color: #7a6e5d;
  white-space: nowrap;
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  min-width: 560px;

  th {
    text-align: left;
    padding: 0.6rem 1rem;
    background: #f5f0e8;
    border-bottom: 1px solid #e5ddd0;
    font-weight: 700;
    color: #7a6e5d;
    white-space: nowrap;
  }
  td {
    padding: 0.55rem 1rem;
    border-bottom: 1px solid #f0ebe2;
    vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
`;

const SongCell = styled.div`
  min-width: 120px;
`;

const SongTitle = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const TextInput = styled.input`
  width: 160px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.78rem;

  &:focus { outline: none; border-color: #8b7355; }
`;

const TimeInput = styled.input`
  width: 70px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.78rem;

  &:focus { outline: none; border-color: #8b7355; }
`;

const StatusTag = styled.span<{ $set: boolean }>`
  font-size: 0.68rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: ${(p) => (p.$set ? '#eaf2ea' : '#fff0f0')};
  color: ${(p) => (p.$set ? '#6b8e6b' : '#c0392b')};
  white-space: nowrap;
`;

const SaveBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 0.85rem 1.25rem;
  border-top: 1px solid #e5ddd0;
  background: #f5f0e8;
`;

const SaveNote = styled.span`
  font-size: 0.72rem;
  color: #a99e8f;
  margin-right: auto;
`;

const SaveButton = styled.button`
  padding: 0.55rem 1.25rem;
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

const DelButton = styled.button`
  padding: 5px 11px;
  border: none;
  border-radius: 6px;
  background: #fff0f0;
  color: #c0392b;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;

  &:hover { background: #ffe0e0; }
`;

const Empty = styled.p`
  padding: 1.5rem;
  text-align: center;
  font-size: 0.82rem;
  color: #a99e8f;
`;
