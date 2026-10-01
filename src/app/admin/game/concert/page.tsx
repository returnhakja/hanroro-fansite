'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
  useAdminConcertQuestions,
  useCreateConcertQuestion,
  useUpdateConcertQuestion,
  useDeleteConcertQuestion,
  useAdminConcertResults,
  useDeleteAdminConcertResult,
  type AdminConcertQuestion,
  type ConcertQuestionFormValues,
} from '@/hooks/queries/useAdminConcertGame';
import { useAdminConcerts, type Concert } from '@/hooks/queries/useConcerts';
import { uploadAdminImage } from '@/lib/storage/uploadClient';

const EMPTY_FORM: ConcertQuestionFormValues = {
  imageUrl: '',
  correctDate: '',
  correctVenue: '',
  correctConcertName: '',
  wrongDates: ['', '', ''],
  wrongVenues: ['', '', ''],
  wrongConcertNames: ['', '', ''],
  credit: '',
  isActive: true,
};

function toDateInputValue(iso: string): string {
  return iso ? iso.slice(0, 10) : '';
}

function concertLabel(c: Concert): string {
  return `${c.title} · ${c.venue} · ${toDateInputValue(c.startDate)}`;
}

function findMatchingConcertId(concerts: Concert[], date: string, venue: string, name: string): string {
  const match = concerts.find(
    (c) => toDateInputValue(c.startDate) === date && c.venue === venue && c.title === name
  );
  return match?._id ?? '';
}

export default function AdminConcertGamePage() {
  const { data: questions = [], isLoading: questionsLoading } = useAdminConcertQuestions();
  const createQuestion = useCreateConcertQuestion();
  const updateQuestion = useUpdateConcertQuestion();
  const deleteQuestion = useDeleteConcertQuestion();
  const { data: results = [], isLoading: resultsLoading } = useAdminConcertResults();
  const deleteResult = useDeleteAdminConcertResult();
  const { data: concerts = [] } = useAdminConcerts();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ConcertQuestionFormValues>(EMPTY_FORM);
  const [correctConcertId, setCorrectConcertId] = useState('');
  const [wrongConcertIds, setWrongConcertIds] = useState(['', '', '']);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setCorrectConcertId('');
    setWrongConcertIds(['', '', '']);
    setImageMode('url');
    setUploadProgress(null);
    setFormError('');
  };

  const startEdit = (q: AdminConcertQuestion) => {
    setEditingId(q._id);
    const correctDate = toDateInputValue(q.correctDate);
    const wrongDates = q.wrongDates.map(toDateInputValue);
    setForm({
      imageUrl: q.imageUrl,
      correctDate,
      correctVenue: q.correctVenue,
      correctConcertName: q.correctConcertName,
      wrongDates,
      wrongVenues: [...q.wrongVenues],
      wrongConcertNames: [...q.wrongConcertNames],
      credit: q.credit,
      isActive: q.isActive,
    });
    // 기존 문제가 지금 등록된 공연 일정과 완전히 일치하면 선택지에 자동으로 표시(최선 노력, 못 찾아도 값은 그대로 유지됨)
    setCorrectConcertId(findMatchingConcertId(concerts, correctDate, q.correctVenue, q.correctConcertName));
    setWrongConcertIds(
      wrongDates.map((d, i) => findMatchingConcertId(concerts, d, q.wrongVenues[i], q.wrongConcertNames[i]))
    );
    setImageMode('url');
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyCorrectConcert = (id: string) => {
    setCorrectConcertId(id);
    const c = concerts.find((item) => item._id === id);
    setForm((p) => ({
      ...p,
      correctDate: c ? toDateInputValue(c.startDate) : '',
      correctVenue: c ? c.venue : '',
      correctConcertName: c ? c.title : '',
    }));
  };

  const applyWrongConcert = (i: number, id: string) => {
    setWrongConcertIds((prev) => {
      const next = [...prev];
      next[i] = id;
      return next;
    });
    const c = concerts.find((item) => item._id === id);
    setForm((prev) => {
      const wrongDates = [...prev.wrongDates];
      const wrongVenues = [...prev.wrongVenues];
      const wrongConcertNames = [...prev.wrongConcertNames];
      wrongDates[i] = c ? toDateInputValue(c.startDate) : '';
      wrongVenues[i] = c ? c.venue : '';
      wrongConcertNames[i] = c ? c.title : '';
      return { ...prev, wrongDates, wrongVenues, wrongConcertNames };
    });
  };

  const handleFileUpload = async (file: File) => {
    setFormError('');
    setUploadProgress(0);
    try {
      const publicUrl = await uploadAdminImage(file, setUploadProgress);
      setForm((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '업로드에 실패했습니다');
    } finally {
      setUploadProgress(null);
    }
  };

  const validate = (): string | null => {
    if (!form.imageUrl.trim()) return '이미지를 등록해주세요';
    if (!form.correctDate || !form.correctVenue.trim() || !form.correctConcertName.trim()) {
      return '정답 공연을 선택해주세요';
    }
    if (form.wrongDates.some((d) => !d) || form.wrongVenues.some((v) => !v.trim()) || form.wrongConcertNames.some((v) => !v.trim())) {
      return '오답 공연 3개를 모두 선택해주세요';
    }
    const chosenIds = [correctConcertId, ...wrongConcertIds].filter(Boolean);
    if (new Set(chosenIds).size !== chosenIds.length) {
      return '같은 공연을 중복으로 선택했어요. 서로 다른 공연 4개를 선택해주세요';
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setFormError(error);
      return;
    }
    try {
      if (editingId) {
        await updateQuestion.mutateAsync({ id: editingId, values: form });
      } else {
        await createQuestion.mutateAsync(form);
      }
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '저장에 실패했습니다');
    }
  };

  const handleToggleActive = async (q: AdminConcertQuestion) => {
    try {
      await updateQuestion.mutateAsync({
        id: q._id,
        values: {
          imageUrl: q.imageUrl,
          correctDate: toDateInputValue(q.correctDate),
          correctVenue: q.correctVenue,
          correctConcertName: q.correctConcertName,
          wrongDates: q.wrongDates.map(toDateInputValue),
          wrongVenues: q.wrongVenues,
          wrongConcertNames: q.wrongConcertNames,
          credit: q.credit,
          isActive: !q.isActive,
        },
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : '변경에 실패했습니다');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 문제를 삭제할까요?')) return;
    try {
      await deleteQuestion.mutateAsync(id);
      if (editingId === id) resetForm();
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

  const activeCount = questions.filter((q) => q.isActive).length;
  const saving = createQuestion.isPending || updateQuestion.isPending;

  return (
    <Page>
      <PageHead>
        <Eyebrow>Admin · 공연 맞추기</Eyebrow>
        <h1>공연 맞추기 게임 관리</h1>
        <Lede>무대 사진을 등록하고, 정답/오답 공연을 기존 공연 일정 중에서 골라요. 플레이 때마다 활성 문제 중 10개를 무작위로 출제해요.</Lede>
      </PageHead>

      <Panel>
        <PanelHead>
          <div>
            <PanelTitle>{editingId ? '문제 수정' : '새 문제 등록'}</PanelTitle>
            <PanelSub>이미지는 URL을 직접 입력하거나 파일을 업로드할 수 있어요.</PanelSub>
          </div>
          {editingId && <CancelButton type="button" onClick={resetForm}>취소</CancelButton>}
        </PanelHead>

        <FormBody>
          <FieldBlock>
            <FieldLabel>무대 사진</FieldLabel>
            <TabRow>
              <TabButton type="button" $active={imageMode === 'url'} onClick={() => setImageMode('url')}>URL 입력</TabButton>
              <TabButton type="button" $active={imageMode === 'upload'} onClick={() => setImageMode('upload')}>파일 업로드</TabButton>
            </TabRow>
            {imageMode === 'url' ? (
              <TextInput
                type="text"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                {uploadProgress !== null && <ProgressText>업로드 중... {uploadProgress}%</ProgressText>}
              </>
            )}
            {form.imageUrl && (
              <Thumbnail src={form.imageUrl} alt="미리보기" />
            )}
          </FieldBlock>

          <FieldBlock>
            <FieldLabel>정답 공연 (날짜·장소·공연명이 한 번에 채워져요)</FieldLabel>
            <SelectInput value={correctConcertId} onChange={(e) => applyCorrectConcert(e.target.value)}>
              <option value="">공연 선택...</option>
              {concerts.map((c) => (
                <option key={c._id} value={c._id}>{concertLabel(c)}</option>
              ))}
            </SelectInput>
          </FieldBlock>

          <FieldBlock>
            <FieldLabel>오답 공연 3개 (4지선다용 헷갈릴 만한 공연을 골라주세요)</FieldLabel>
            <FieldRow3>
              {wrongConcertIds.map((id, i) => (
                <SelectInput key={i} value={id} onChange={(e) => applyWrongConcert(i, e.target.value)}>
                  <option value="">공연 선택...</option>
                  {concerts.map((c) => (
                    <option key={c._id} value={c._id}>{concertLabel(c)}</option>
                  ))}
                </SelectInput>
              ))}
            </FieldRow3>
          </FieldBlock>

          <FieldBlock>
            <FieldLabel>출처 표기 (선택)</FieldLabel>
            <TextInput
              type="text"
              placeholder="예: 탐광꾼팬"
              value={form.credit}
              onChange={(e) => setForm((p) => ({ ...p, credit: e.target.value }))}
            />
          </FieldBlock>

          {formError && <ErrorText>{formError}</ErrorText>}

          <SaveBar>
            <SaveNote>{editingId ? '수정 후 저장하면 바로 반영돼요' : '등록하면 바로 출제 풀에 추가돼요'}</SaveNote>
            <SaveButton type="button" onClick={handleSubmit} disabled={saving}>
              {saving ? '저장 중...' : editingId ? '수정 저장' : '등록'}
            </SaveButton>
          </SaveBar>
        </FormBody>
      </Panel>

      <Panel>
        <PanelHead>
          <div>
            <PanelTitle>등록된 문제</PanelTitle>
            <PanelSub>활성 문제만 실제 게임에 출제돼요. 최소 10개가 활성화되어 있어야 플레이할 수 있어요.</PanelSub>
          </div>
          <StatPill>{activeCount} / {questions.length}개 활성</StatPill>
        </PanelHead>
        <TableWrap>
          {questionsLoading ? (
            <Empty>불러오는 중...</Empty>
          ) : questions.length === 0 ? (
            <Empty>등록된 문제가 없어요</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>사진</th>
                  <th>정답 날짜</th>
                  <th>정답 장소</th>
                  <th>정답 공연명</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id}>
                    <td><RowThumb src={q.imageUrl} alt="" /></td>
                    <td>{toDateInputValue(q.correctDate)}</td>
                    <td>{q.correctVenue}</td>
                    <td>{q.correctConcertName}</td>
                    <td>
                      <StatusTag $set={q.isActive} onClick={() => handleToggleActive(q)}>
                        {q.isActive ? '활성' : '비활성'}
                      </StatusTag>
                    </td>
                    <td>
                      <RowActions>
                        <EditButton type="button" onClick={() => startEdit(q)}>수정</EditButton>
                        <DelButton type="button" onClick={() => handleDelete(q._id)}>삭제</DelButton>
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
                  <th>점수</th>
                  <th>날짜 정답</th>
                  <th>장소 정답</th>
                  <th>공연명 정답</th>
                  <th>등록일</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r._id}>
                    <td>{r.nickname}</td>
                    <td>{r.score}/10</td>
                    <td>{r.dateCorrectCount}/10</td>
                    <td>{r.venueCorrectCount}/10</td>
                    <td>{r.concertNameCorrectCount}/10</td>
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
`;

const FieldRow3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const FieldLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: #7a6e5d;
`;

const TabRow = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? '#8b7355' : '#ddd')};
  background: ${(p) => (p.$active ? '#8b7355' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#7a6e5d')};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
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

const ProgressText = styled.span`
  font-size: 0.75rem;
  color: #8b7355;
  font-weight: 600;
`;

const Thumbnail = styled.img`
  margin-top: 0.4rem;
  width: 100%;
  max-width: 280px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5ddd0;
`;

const RowThumb = styled.img`
  width: 64px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  display: block;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #c0392b;
`;

const SaveBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  padding-top: 0.5rem;
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

const CancelButton = styled.button`
  padding: 0.45rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  color: #7a6e5d;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
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

const RowActions = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const StatusTag = styled.button<{ $set: boolean }>`
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

const EditButton = styled.button`
  padding: 5px 11px;
  border: none;
  border-radius: 6px;
  background: #f0ebe2;
  color: #6b5740;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;

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
