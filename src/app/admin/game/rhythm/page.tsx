'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  useAdminRhythmCharts,
  useCreateRhythmChart,
  useUpdateRhythmChart,
  useDeleteRhythmChart,
  useAdminRhythmResults,
  useDeleteAdminRhythmResult,
  type AdminRhythmChartRow,
  type RhythmChartFormValues,
} from '@/hooks/queries/useAdminRhythmGame';
import { RHYTHM_DIFFICULTY_LABEL, type RhythmDifficultyValue } from '@/lib/game/rhythm';

const EMPTY_FORM: RhythmChartFormValues = {
  title: '',
  youtubeId: '',
  startSeconds: 0,
  bpm: 100,
  offsetMs: 0,
  difficulty: 'normal',
};

export default function AdminRhythmGamePage() {
  const { data: charts = [], isLoading: chartsLoading } = useAdminRhythmCharts();
  const createChart = useCreateRhythmChart();
  const updateChart = useUpdateRhythmChart();
  const deleteChart = useDeleteRhythmChart();
  const { data: resultsData, isLoading: resultsLoading } = useAdminRhythmResults();
  const results = resultsData?.results ?? [];
  const totalResultsCount = resultsData?.totalCount ?? results.length;
  const deleteResult = useDeleteAdminRhythmResult();

  const [form, setForm] = useState<RhythmChartFormValues>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const validate = (): string | null => {
    if (!form.title.trim()) return '곡 제목을 입력해주세요';
    if (!form.youtubeId.trim()) return '유튜브 링크/ID를 입력해주세요';
    if (form.bpm < 20 || form.bpm > 300) return 'BPM을 20~300 사이로 입력해주세요';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setFormError(error);
      return;
    }
    try {
      await createChart.mutateAsync(form);
      setForm(EMPTY_FORM);
      setFormError('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '등록에 실패했습니다');
    }
  };

  const handleToggleActive = async (chart: AdminRhythmChartRow) => {
    if (!chart.isActive && chart.noteCount === 0) {
      alert('박자맵이 없는 곡은 활성화할 수 없어요. 먼저 차트 편집에서 노트를 찍어주세요.');
      return;
    }
    try {
      await updateChart.mutateAsync({ id: chart._id, values: { isActive: !chart.isActive } });
    } catch (err) {
      alert(err instanceof Error ? err.message : '변경에 실패했습니다');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 곡을 삭제할까요? 박자맵도 함께 삭제돼요.')) return;
    try {
      await deleteChart.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  };

  const handleDeleteResult = async (id: string) => {
    if (!confirm('이 기록을 삭제할까요?')) return;
    try {
      await deleteResult.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  };

  const activeCount = charts.filter((c) => c.isActive).length;

  return (
    <Page>
      <PageHead>
        <Eyebrow>Admin · 리듬게임 (비공개 테스트)</Eyebrow>
        <h1>리듬게임 관리</h1>
        <Lede>
          아직 공개 전 테스트 단계라 게임 허브에는 안 올라가 있어요. 아래 링크로만 들어갈 수 있어요.
        </Lede>
        <PreviewLinkRow>
          <PreviewLink href="/game/rhythm" target="_blank" rel="noopener noreferrer">
            /game/rhythm 플레이 링크 열기 →
          </PreviewLink>
        </PreviewLinkRow>
      </PageHead>

      <Panel>
        <PanelHead>
          <div>
            <PanelTitle>새 곡 등록</PanelTitle>
            <PanelSub>등록 후 "차트 편집"에서 박자맵(노트)을 찍어야 플레이 목록에 노출할 수 있어요.</PanelSub>
          </div>
        </PanelHead>
        <FormBody>
          <FieldBlock>
            <FieldLabel>곡 제목</FieldLabel>
            <TextInput
              type="text"
              placeholder="예: 너와 나"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </FieldBlock>

          <FieldBlock>
            <FieldLabel>유튜브 링크 또는 영상 ID</FieldLabel>
            <TextInput
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={form.youtubeId}
              onChange={(e) => setForm((p) => ({ ...p, youtubeId: e.target.value }))}
            />
          </FieldBlock>

          <FieldRow>
            <FieldBlock>
              <FieldLabel>시작 초</FieldLabel>
              <NumberInput
                type="number"
                min={0}
                value={form.startSeconds}
                onChange={(e) => setForm((p) => ({ ...p, startSeconds: Number(e.target.value) }))}
              />
            </FieldBlock>
            <FieldBlock>
              <FieldLabel>BPM</FieldLabel>
              <NumberInput
                type="number"
                min={20}
                max={300}
                value={form.bpm}
                onChange={(e) => setForm((p) => ({ ...p, bpm: Number(e.target.value) }))}
              />
            </FieldBlock>
            <FieldBlock>
              <FieldLabel>오프셋(ms)</FieldLabel>
              <NumberInput
                type="number"
                value={form.offsetMs}
                onChange={(e) => setForm((p) => ({ ...p, offsetMs: Number(e.target.value) }))}
              />
            </FieldBlock>
            <FieldBlock>
              <FieldLabel>난이도</FieldLabel>
              <SelectInput
                value={form.difficulty}
                onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value as RhythmDifficultyValue }))}
              >
                {(['easy', 'normal', 'hard'] as const).map((d) => (
                  <option key={d} value={d}>{RHYTHM_DIFFICULTY_LABEL[d]}</option>
                ))}
              </SelectInput>
            </FieldBlock>
          </FieldRow>

          {formError && <ErrorText>{formError}</ErrorText>}

          <SaveBar>
            <SaveButton type="button" onClick={handleSubmit} disabled={createChart.isPending}>
              {createChart.isPending ? '등록 중...' : '등록하기'}
            </SaveButton>
          </SaveBar>
        </FormBody>
      </Panel>

      <Panel>
        <PanelHead>
          <div>
            <PanelTitle>등록된 곡</PanelTitle>
            <PanelSub>박자맵이 없는 곡은 활성화할 수 없어요.</PanelSub>
          </div>
          <StatPill>{activeCount} / {charts.length}곡 활성</StatPill>
        </PanelHead>
        <TableWrap>
          {chartsLoading ? (
            <Empty>불러오는 중...</Empty>
          ) : charts.length === 0 ? (
            <Empty>등록된 곡이 없어요</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>곡</th>
                  <th>BPM</th>
                  <th>난이도</th>
                  <th>박자맵</th>
                  <th>활성</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {charts.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600, color: '#2c3e50' }}>{c.title}</td>
                    <td>{c.bpm}</td>
                    <td>{RHYTHM_DIFFICULTY_LABEL[c.difficulty]}</td>
                    <td>
                      {c.noteCount > 0 ? (
                        <StatusTag $set>작성됨 · {c.noteCount}노트</StatusTag>
                      ) : (
                        <StatusTag $set={false}>미작성</StatusTag>
                      )}
                    </td>
                    <td>
                      <StatusTag as="button" $set={c.isActive} onClick={() => handleToggleActive(c)}>
                        {c.isActive ? '활성' : '비활성'}
                      </StatusTag>
                    </td>
                    <td>
                      <RowActions>
                        <Link href={`/admin/game/rhythm/${c._id}`}>
                          <EditButton as="span">차트 편집</EditButton>
                        </Link>
                        <DelButton type="button" onClick={() => handleDelete(c._id)}>삭제</DelButton>
                      </RowActions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </TableWrap>
      </Panel>

      <Panel>
        <PanelHead>
          <div>
            <PanelTitle>랭킹 관리</PanelTitle>
            <PanelSub>부적절한 닉네임이나 어뷰징으로 의심되는 기록을 삭제할 수 있어요.</PanelSub>
          </div>
          <StatPill>전체 {totalResultsCount.toLocaleString('ko-KR')}건{totalResultsCount > results.length ? ` (최근 ${results.length}건 표시)` : ''}</StatPill>
        </PanelHead>
        <TableWrap>
          {resultsLoading ? (
            <Empty>불러오는 중...</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>곡</th>
                  <th>닉네임</th>
                  <th>점수</th>
                  <th>최고 콤보</th>
                  <th>P/G/M</th>
                  <th>등록일</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r._id}>
                    <td>{r.chartTitle}</td>
                    <td>{r.nickname}</td>
                    <td>{r.score.toLocaleString('ko-KR')}</td>
                    <td>{r.maxCombo}</td>
                    <td>{r.perfectCount}/{r.greatCount}/{r.missCount}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <DelButton type="button" onClick={() => handleDeleteResult(r._id)}>삭제</DelButton>
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
  max-width: 980px;
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

const PreviewLinkRow = styled.div`
  margin-top: 0.6rem;
`;

const PreviewLink = styled.a`
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  background: #8b7355;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;

  &:hover { background: #6b5740; }
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
  gap: 0.75rem;
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

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
`;

const FieldLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: #7a6e5d;
`;

const TextInput = styled.input`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.82rem;
  width: 100%;
  box-sizing: border-box;

  &:focus { outline: none; border-color: #8b7355; }
`;

const NumberInput = styled(TextInput)``;
const SelectInput = styled.select`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.82rem;
  width: 100%;
  box-sizing: border-box;
  background: #fff;

  &:focus { outline: none; border-color: #8b7355; }
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #c0392b;
`;

const SaveBar = styled.div`
  display: flex;
  justify-content: flex-end;
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

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  min-width: 640px;

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

const RowActions = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const StatusTag = styled.span<{ $set: boolean }>`
  border: none;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: ${(p) => (p.$set ? '#eaf2ea' : '#fff0f0')};
  color: ${(p) => (p.$set ? '#6b8e6b' : '#c0392b')};
  white-space: nowrap;
  cursor: pointer;
`;

const EditButton = styled.span`
  padding: 5px 11px;
  border-radius: 6px;
  background: #f0ebe2;
  color: #6b5740;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;

  &:hover { background: #e5ddd0; }
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
