'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
  useAdminBanners,
  useSaveBanner,
  useDeleteBanner,
  type AdminBanner,
  type BannerFormData,
} from '@/hooks/queries/useBanners';
import { uploadAdminImage } from '@/lib/storage/uploadClient';
import { useScrollLock } from '@/hooks/useScrollLock';

const EMPTY_FORM: BannerFormData = {
  title: '',
  pcImageUrl: '',
  mobileImageUrl: '',
  alt: '',
  buttonLabel: '',
  linkUrl: '',
  startDate: '',
  endDate: '',
  order: 0,
  isActive: true,
};

// 저장된 Date(ISO) → 한국 날짜 YYYY-MM-DD
function toKstDateInput(iso?: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}

function getStatus(b: AdminBanner): { label: string; tone: 'on' | 'wait' | 'off' } {
  if (!b.isActive) return { label: '숨김', tone: 'off' };
  const now = Date.now();
  if (b.startAt && new Date(b.startAt).getTime() > now) return { label: '예약', tone: 'wait' };
  if (b.endAt && new Date(b.endAt).getTime() < now) return { label: '종료', tone: 'off' };
  return { label: '노출 중', tone: 'on' };
}

export default function AdminBannersPage() {
  const { data: banners = [], isLoading } = useAdminBanners();
  const saveBanner = useSaveBanner();
  const deleteBanner = useDeleteBanner();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerFormData>(EMPTY_FORM);
  const [uploading, setUploading] = useState<'pc' | 'mobile' | null>(null);

  useScrollLock(showModal);

  const set = <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (b: AdminBanner) => {
    setEditingId(b._id);
    setForm({
      title: b.title,
      pcImageUrl: b.pcImageUrl,
      mobileImageUrl: b.mobileImageUrl ?? '',
      alt: b.alt,
      buttonLabel: b.buttonLabel ?? '',
      linkUrl: b.linkUrl,
      startDate: toKstDateInput(b.startAt),
      endDate: toKstDateInput(b.endAt),
      order: b.order,
      isActive: b.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleUpload = async (kind: 'pc' | 'mobile', file?: File) => {
    if (!file) return;
    setUploading(kind);
    try {
      const url = await uploadAdminImage(file);
      set(kind === 'pc' ? 'pcImageUrl' : 'mobileImageUrl', url);
    } catch (err) {
      alert(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveBanner.mutateAsync({ id: editingId ?? undefined, formData: form });
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : '저장 실패');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 배너를 삭제할까요?')) return;
    try {
      await deleteBanner.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패');
    }
  };

  return (
    <Container>
      <PageHeader>
        <div>
          <h1>홈 배너 관리</h1>
          <Sub>홈 최상단에 슬라이드로 노출돼요. 기간이 지나면 자동으로 내려가요. (반영까지 최대 5분)</Sub>
        </div>
        <AddButton onClick={openCreate}>+ 배너 추가</AddButton>
      </PageHeader>

      {isLoading ? (
        <p>불러오는 중...</p>
      ) : banners.length === 0 ? (
        <Empty>등록된 배너가 없습니다</Empty>
      ) : (
        <List>
          {banners.map((b) => {
            const status = getStatus(b);
            return (
              <Item key={b._id}>
                <Thumb src={b.pcImageUrl} alt={b.alt} />
                <Info>
                  <TitleRow>
                    <Badge $tone={status.tone}>{status.label}</Badge>
                    <strong>{b.title}</strong>
                    <OrderText>순서 {b.order}</OrderText>
                  </TitleRow>
                  <MetaText>
                    {toKstDateInput(b.startAt) || '시작 제한 없음'} ~ {toKstDateInput(b.endAt) || '종료 제한 없음'}
                  </MetaText>
                  <MetaText>
                    {b.buttonLabel ? `[${b.buttonLabel}] ` : ''}
                    {b.linkUrl}
                  </MetaText>
                </Info>
                <Actions>
                  <SmallBtn onClick={() => openEdit(b)}>수정</SmallBtn>
                  <SmallBtn $danger onClick={() => handleDelete(b._id)}>
                    삭제
                  </SmallBtn>
                </Actions>
              </Item>
            );
          })}
        </List>
      )}

      {showModal && (
        <Overlay onClick={closeModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{editingId ? '배너 수정' : '배너 추가'}</h2>
              <CloseBtn type="button" onClick={closeModal} aria-label="닫기">
                ✕
              </CloseBtn>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <Field>
                <Label>관리용 이름 *</Label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="예: 2026 생일카페 (위드윈스)"
                />
              </Field>

              <Field>
                <Label>PC 이미지 * (1200×400, 3:1)</Label>
                <UploadRow>
                  <Input
                    required
                    value={form.pcImageUrl}
                    onChange={(e) => set('pcImageUrl', e.target.value)}
                    placeholder="/banners/birthday-cafe-2026-pc.webp 또는 업로드"
                  />
                  <FileLabel>
                    {uploading === 'pc' ? '업로드 중…' : '파일 선택'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploading !== null}
                      onChange={(e) => handleUpload('pc', e.target.files?.[0])}
                    />
                  </FileLabel>
                </UploadRow>
                {form.pcImageUrl && <Preview src={form.pcImageUrl} alt="" $ratio="3 / 1" />}
              </Field>

              <Field>
                <Label>모바일 이미지 (1000×400, 5:2 · 없으면 PC 이미지를 축소해서 보여줌)</Label>
                <UploadRow>
                  <Input
                    value={form.mobileImageUrl}
                    onChange={(e) => set('mobileImageUrl', e.target.value)}
                    placeholder="/banners/birthday-cafe-2026-mobile.webp 또는 업로드"
                  />
                  <FileLabel>
                    {uploading === 'mobile' ? '업로드 중…' : '파일 선택'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploading !== null}
                      onChange={(e) => handleUpload('mobile', e.target.files?.[0])}
                    />
                  </FileLabel>
                </UploadRow>
                {form.mobileImageUrl && (
                  <Preview src={form.mobileImageUrl} alt="" $ratio="5 / 2" $narrow />
                )}
              </Field>

              <Field>
                <Label>대체 텍스트 * (이미지 속 글자를 그대로)</Label>
                <Textarea
                  required
                  rows={2}
                  value={form.alt}
                  onChange={(e) => set('alt', e.target.value)}
                  placeholder="예: 한로로 생일카페 11월 21일~22일, 망원동 카페 위드윈스"
                />
              </Field>

              <Row>
                <Field>
                  <Label>버튼 문구</Label>
                  <Input
                    value={form.buttonLabel}
                    onChange={(e) => set('buttonLabel', e.target.value)}
                    placeholder="예: 카페 정보 보기 (비우면 버튼 없음)"
                    maxLength={20}
                  />
                </Field>
                <Field>
                  <Label>링크 *</Label>
                  <Input
                    required
                    value={form.linkUrl}
                    onChange={(e) => set('linkUrl', e.target.value)}
                    placeholder="https://open.kakao.com/... 또는 /board/..."
                  />
                </Field>
              </Row>

              <Row>
                <Field>
                  <Label>시작일 (비우면 바로)</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => set('startDate', e.target.value)}
                  />
                </Field>
                <Field>
                  <Label>종료일 (그날 밤 23:59까지)</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => set('endDate', e.target.value)}
                  />
                </Field>
              </Row>

              <Row>
                <Field>
                  <Label>순서 (작을수록 먼저)</Label>
                  <Input
                    type="number"
                    value={form.order}
                    onChange={(e) => set('order', Number(e.target.value))}
                  />
                </Field>
                <Field>
                  <Label>노출</Label>
                  <CheckLabel>
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => set('isActive', e.target.checked)}
                    />
                    홈에 노출
                  </CheckLabel>
                </Field>
              </Row>

              <Footer>
                <SmallBtn type="button" onClick={closeModal}>
                  취소
                </SmallBtn>
                <SaveBtn type="submit" disabled={saveBanner.isPending || uploading !== null}>
                  {saveBanner.isPending ? '저장 중...' : '저장'}
                </SaveBtn>
              </Footer>
            </Form>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Sub = styled.p`
  margin-top: 0.375rem;
  font-size: 0.85rem;
  color: #7a6e5d;
`;

const AddButton = styled.button`
  padding: 0.6rem 1.25rem;
  background: #8b7355;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #6b5740;
  }
`;

const Empty = styled.p`
  text-align: center;
  color: #999;
  padding: 3rem 0;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #fff;
  border: 1px solid #f0ebe2;
  border-radius: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Thumb = styled.img`
  width: 240px;
  aspect-ratio: 3 / 1;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  background: #f5f0e8;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $tone: 'on' | 'wait' | 'off' }>`
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $tone }) =>
    $tone === 'on' ? '#e3f4e6' : $tone === 'wait' ? '#fff4d6' : '#eeeeee'};
  color: ${({ $tone }) =>
    $tone === 'on' ? '#22703a' : $tone === 'wait' ? '#8a6100' : '#666666'};
`;

const OrderText = styled.span`
  font-size: 0.8rem;
  color: #999;
`;

const MetaText = styled.span`
  font-size: 0.85rem;
  color: #6b5740;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
`;

const SmallBtn = styled.button<{ $danger?: boolean }>`
  padding: 0.4rem 0.75rem;
  background: ${({ $danger }) => ($danger ? '#fff0f0' : '#f5f0e8')};
  border: 1px solid ${({ $danger }) => ($danger ? '#f0c0c0' : '#e5ddd0')};
  color: ${({ $danger }) => ($danger ? '#c0392b' : 'inherit')};
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const CloseBtn = styled.button`
  border: none;
  background: none;
  font-size: 1.1rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a3f30;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid #e5ddd0;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid #e5ddd0;
  border-radius: 6px;
  font-size: 0.9rem;
  resize: vertical;
`;

const UploadRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FileLabel = styled.label`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 0 0.875rem;
  border: 1px solid #e5ddd0;
  border-radius: 6px;
  background: #f5f0e8;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
`;

const Preview = styled.img<{ $ratio: string; $narrow?: boolean }>`
  width: ${({ $narrow }) => ($narrow ? '60%' : '100%')};
  aspect-ratio: ${({ $ratio }) => $ratio};
  object-fit: cover;
  border-radius: 6px;
  background: #f5f0e8;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 38px;
  font-size: 0.9rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SaveBtn = styled.button`
  padding: 0.5rem 1.25rem;
  background: #8b7355;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
