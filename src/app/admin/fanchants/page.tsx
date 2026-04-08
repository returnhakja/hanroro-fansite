'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
  useAdminFanchants,
  useCreateFanchant,
  useUpdateFanchant,
  useDeleteFanchant,
  type Fanchant,
  type FanchantFormData,
} from '@/hooks/queries/useFanchants';
import { parseLyrics, unparseLyrics } from '@/lib/utils/parseLyrics';
import type { ILyricLine } from '@/lib/db/models/Fanchant';
import type { LyricType } from '@/lib/db/models/Fanchant';

const EMPTY_FORM: FanchantFormData = {
  songTitle: '',
  album: '',
  albumImageUrl: '',
  order: 0,
  lyricsRaw: '',
};

export default function AdminFanchantsPage() {
  const { data: fanchants = [], isLoading } = useAdminFanchants();
  const createFanchant = useCreateFanchant();
  const updateFanchant = useUpdateFanchant();
  const deleteFanchant = useDeleteFanchant();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Fanchant | null>(null);
  const [form, setForm] = useState<FanchantFormData>(EMPTY_FORM);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (f: Fanchant) => {
    setEditing(f);
    setForm({
      songTitle: f.songTitle,
      album: f.album,
      albumImageUrl: f.albumImageUrl ?? '',
      order: f.order,
      lyricsRaw: unparseLyrics(f.lyrics),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateFanchant.mutateAsync({ id: editing._id, formData: form });
      } else {
        await createFanchant.mutateAsync(form);
      }
      closeModal();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : '저장 실패');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteFanchant.mutateAsync(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : '삭제 실패');
    }
  };

  // 실시간 가사 미리보기
  const preview: ILyricLine[] = parseLyrics(form.lyricsRaw);

  return (
    <Container>
      <PageHeader>
        <h1>응원법 관리</h1>
        <AddButton onClick={openCreate}>+ 새 곡 추가</AddButton>
      </PageHeader>

      {isLoading ? (
        <p>불러오는 중...</p>
      ) : fanchants.length === 0 ? (
        <Empty>등록된 응원법이 없습니다</Empty>
      ) : (
        <SongTable>
          <thead>
            <tr>
              <Th style={{ width: 48 }}>순서</Th>
              <Th>곡명</Th>
              <Th>앨범</Th>
              <Th style={{ width: 80 }}>가사 수</Th>
              <Th style={{ width: 120 }}>관리</Th>
            </tr>
          </thead>
          <tbody>
            {fanchants.map(f => (
              <tr key={f._id}>
                <Td style={{ textAlign: 'center' }}>{f.order}</Td>
                <Td>
                  <SongRow>
                    {f.albumImageUrl && (
                      <img
                        src={f.albumImageUrl}
                        alt={f.album}
                        width={32}
                        height={32}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                      />
                    )}
                    {f.songTitle}
                  </SongRow>
                </Td>
                <Td>{f.album}</Td>
                <Td style={{ textAlign: 'center' }}>{f.lyrics.length}줄</Td>
                <Td>
                  <ActionRow>
                    <EditBtn onClick={() => openEdit(f)}>수정</EditBtn>
                    <DeleteBtn onClick={() => handleDelete(f._id)}>삭제</DeleteBtn>
                  </ActionRow>
                </Td>
              </tr>
            ))}
          </tbody>
        </SongTable>
      )}

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h2>{editing ? '응원법 수정' : '새 곡 추가'}</h2>
              <CloseBtn onClick={closeModal}>✕</CloseBtn>
            </ModalHeader>

            <ModalForm onSubmit={handleSubmit}>
              <ModalColumns>
                {/* 왼쪽: 곡 정보 */}
                <ModalLeft>
                  <FormGroup>
                    <Label>곡명 *</Label>
                    <Input
                      required
                      value={form.songTitle}
                      onChange={e => setForm(p => ({ ...p, songTitle: e.target.value }))}
                      placeholder="예: 봄봄봄"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>앨범명 *</Label>
                    <Input
                      required
                      value={form.album}
                      onChange={e => setForm(p => ({ ...p, album: e.target.value }))}
                      placeholder="예: 봄의 다른 이름"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>앨범 커버 URL</Label>
                    <Input
                      value={form.albumImageUrl}
                      onChange={e => setForm(p => ({ ...p, albumImageUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>정렬 순서</Label>
                    <Input
                      type="number"
                      value={form.order}
                      onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>가사 입력</Label>
                    <HelpText>
                      일반 텍스트 = 한로로 파트<br />
                      <code>[fan] 텍스트</code> = 줄 전체 응원<br />
                      <code>[rest] 텍스트</code> = 간주/쉬는 구간<br />
                      <br />
                      줄 일부만 강조: <code>{'{fan:단어}'} 나머지 가사</code>
                    </HelpText>
                    <Textarea
                      value={form.lyricsRaw}
                      onChange={e => setForm(p => ({ ...p, lyricsRaw: e.target.value }))}
                      placeholder={`봄이 오면 뭔가 달라질 줄 알았어\n[fan] 한로로~! 한로로~!\n[clap] 박수 × 4\n[rest] 간주 (8박)`}
                      rows={14}
                    />
                  </FormGroup>
                </ModalLeft>

                {/* 오른쪽: 미리보기 */}
                <ModalRight>
                  <Label>미리보기</Label>
                  <PreviewBox>
                    {preview.length === 0 ? (
                      <PreviewEmpty>가사를 입력하면 여기에 표시됩니다</PreviewEmpty>
                    ) : (
                      preview.map((line, i) => {
                        const isRest =
                          line.segments.length === 1 && line.segments[0].type === 'rest';
                        return (
                          <PreviewLine key={i} $isRest={isRest}>
                            {line.segments.map((seg, j) => (
                              <PreviewSpan key={j} $type={seg.type}>
                                {seg.text}
                              </PreviewSpan>
                            ))}
                          </PreviewLine>
                        );
                      })
                    )}
                  </PreviewBox>
                </ModalRight>
              </ModalColumns>

              <ModalFooter>
                <CancelBtn type="button" onClick={closeModal}>
                  취소
                </CancelBtn>
                <SaveBtn
                  type="submit"
                  disabled={createFanchant.isPending || updateFanchant.isPending}
                >
                  {createFanchant.isPending || updateFanchant.isPending ? '저장 중...' : '저장'}
                </SaveBtn>
              </ModalFooter>
            </ModalForm>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const AddButton = styled.button`
  padding: 0.6rem 1.25rem;
  background: #8b7355;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover { background: #6b5740; }
`;

const Empty = styled.p`
  text-align: center;
  color: #999;
  padding: 3rem 0;
`;

const SongTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.625rem 0.75rem;
  background: #f5f0e8;
  border-bottom: 1px solid #e5ddd0;
  font-weight: 600;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #f0ebe2;
  vertical-align: middle;
`;

const SongRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.375rem;
`;

const EditBtn = styled.button`
  padding: 0.3rem 0.625rem;
  background: #f5f0e8;
  border: 1px solid #e5ddd0;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover { background: #e5ddd0; }
`;

const DeleteBtn = styled.button`
  padding: 0.3rem 0.625rem;
  background: #fff0f0;
  border: 1px solid #f0c0c0;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #c75b5b;
  cursor: pointer;

  &:hover { background: #ffe0e0; }
`;

// ─── 모달 ─────────────────────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(44, 36, 24, 0.5);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 20px 60px rgba(44, 36, 24, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5ddd0;

  h2 { font-size: 1.1rem; font-weight: 600; margin: 0; }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #999;
  line-height: 1;
`;

const ModalForm = styled.form``;

const ModalColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ModalLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b5740;
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: #999;
  line-height: 1.6;
  margin: 0;

  code {
    background: #f5f0e8;
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-size: 0.8em;
  }
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5ddd0;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;

  &:focus { border-color: #c9a96e; }
`;

const Textarea = styled.textarea`
  padding: 0.625rem 0.75rem;
  border: 1px solid #e5ddd0;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: 'Pretendard', monospace;
  resize: vertical;
  outline: none;
  line-height: 1.7;

  &:focus { border-color: #c9a96e; }
`;

const PreviewBox = styled.div`
  flex: 1;
  padding: 0.875rem 1rem;
  background: #faf7f2;
  border: 1px solid #e5ddd0;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.9;
  min-height: 200px;
  overflow-y: auto;
`;

const PreviewEmpty = styled.p`
  color: #bbb;
  font-size: 0.8125rem;
  margin: 0;
`;

const PreviewLine = styled.p<{ $isRest: boolean }>`
  margin: 0;
  color: #2c2418;
  text-align: ${({ $isRest }) => ($isRest ? 'center' : 'left')};
  opacity: ${({ $isRest }) => ($isRest ? 0.7 : 1)};
`;

const PreviewSpan = styled.span<{ $type: LyricType }>`
  color: ${({ $type }) => {
    if ($type === 'fan') return '#c9a96e';
    if ($type === 'clap') return '#8b7355';
    if ($type === 'rest') return '#a99e8f';
    return 'inherit';
  }};
  font-weight: ${({ $type }) => ($type === 'fan' ? 700 : 400)};
  font-style: ${({ $type }) => ($type === 'clap' ? 'italic' : 'normal')};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5ddd0;
`;

const CancelBtn = styled.button`
  padding: 0.6rem 1.25rem;
  background: #f5f0e8;
  border: 1px solid #e5ddd0;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
`;

const SaveBtn = styled.button`
  padding: 0.6rem 1.5rem;
  background: #8b7355;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover:not(:disabled) { background: #6b5740; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
