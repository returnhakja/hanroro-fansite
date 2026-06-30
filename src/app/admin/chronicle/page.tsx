'use client';

import { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  useAdminActivities,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
  type Activity,
  type ActivityFormData,
} from '@/hooks/queries/useActivities';
import { useScrollLock } from '@/hooks/useScrollLock';

const CURRENT_YEAR = new Date().getFullYear();

const TYPE_OPTIONS = [
  { value: 'concert', label: '공연' },
  { value: 'release', label: '음원/앨범' },
  { value: 'broadcast', label: '방송' },
  { value: 'award', label: '시상식' },
  { value: 'etc', label: '기타' },
] as const;

const TYPE_LABEL: Record<string, string> = {
  concert: '공연',
  release: '음원/앨범',
  broadcast: '방송',
  award: '시상식',
  etc: '기타',
};

const EMPTY_FORM: ActivityFormData = {
  year: CURRENT_YEAR,
  month: new Date().getMonth() + 1,
  type: 'etc',
  title: '',
  description: '',
  imageUrl: '',
  link: '',
};

export default function AdminChroniclePage() {
  const { data: activities = [], isLoading } = useAdminActivities();
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<ActivityFormData>(EMPTY_FORM);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useScrollLock(showModal);

  const years = [...new Set(activities.map((a) => a.year))].sort((a, b) => b - a);
  const filteredActivities = selectedYear
    ? activities.filter((a) => a.year === selectedYear)
    : activities;

  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        await updateActivity.mutateAsync({ id: editingActivity._id, formData });
      } else {
        await createActivity.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : '저장 실패');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteActivity.mutateAsync(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다');
    }
  };

  const handleOpenModal = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        year: activity.year,
        month: activity.month,
        type: activity.type,
        title: activity.title,
        description: activity.description || '',
        imageUrl: activity.imageUrl || '',
        link: activity.link || '',
      });
    } else {
      setEditingActivity(null);
      setFormData(EMPTY_FORM);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingActivity(null);
    setFormData(EMPTY_FORM);
  };

  if (isLoading) {
    return <Container>로딩 중...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>연대기 관리</Title>
        <AddButton onClick={() => handleOpenModal()}>+ 활동 추가</AddButton>
      </Header>

      <YearTabs>
        <YearTab $active={selectedYear === null} onClick={() => setSelectedYear(null)}>
          전체 ({activities.length})
        </YearTab>
        {years.map((year) => (
          <YearTab
            key={year}
            $active={selectedYear === year}
            onClick={() => setSelectedYear(year)}
          >
            {year}년 ({activities.filter((a) => a.year === year).length})
          </YearTab>
        ))}
      </YearTabs>

      <Table>
        <thead>
          <tr>
            <Th>연도</Th>
            <Th>월</Th>
            <Th>유형</Th>
            <Th>제목</Th>
            <Th>이미지</Th>
            <Th>관리</Th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities.map((activity) => (
            <tr key={activity._id}>
              <Td data-label="연도">{activity.year}</Td>
              <Td data-label="월">{activity.month}월</Td>
              <Td data-label="유형">
                <TypeBadge $type={activity.type}>
                  {TYPE_LABEL[activity.type] ?? activity.type}
                </TypeBadge>
              </Td>
              <Td $full>{activity.title}</Td>
              <Td data-label="이미지">
                {activity.imageUrl ? (
                  <Thumb src={activity.imageUrl} alt={activity.title} />
                ) : (
                  <NoImage>없음</NoImage>
                )}
              </Td>
              <Td $full>
                <ActionButtons>
                  <EditButton onClick={() => handleOpenModal(activity)}>수정</EditButton>
                  <DeleteButton onClick={() => handleDelete(activity._id)}>삭제</DeleteButton>
                </ActionButtons>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {filteredActivities.length === 0 && (
        <EmptyMessage>
          {selectedYear ? `${selectedYear}년 활동이 없습니다` : '등록된 활동이 없습니다'}
        </EmptyMessage>
      )}

      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingActivity ? '활동 수정' : '활동 추가'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label>연도 *</Label>
                  <Input
                    type="number"
                    min={2000}
                    max={2100}
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: Number(e.target.value) })
                    }
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>월 *</Label>
                  <Select
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({ ...formData, month: Number(e.target.value) })
                    }
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>{m}월</option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>유형</Label>
                <Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as ActivityFormData['type'],
                    })
                  }
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>제목 *</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>설명</Label>
                <Textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="간단한 설명을 입력하세요"
                />
              </FormGroup>

              <FormGroup>
                <Label>이미지 URL</Label>
                <Input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
                {formData.imageUrl && (
                  <ImagePreview src={formData.imageUrl} alt="미리보기" />
                )}
              </FormGroup>

              <FormGroup>
                <Label>링크</Label>
                <Input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://..."
                />
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={handleCloseModal}>
                  취소
                </CancelButton>
                <SubmitButton type="submit">
                  {editingActivity ? '수정' : '추가'}
                </SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

// ─── 스타일 ──────────────────────────────────────────────────────

const Container = styled.div`
  max-width: 1200px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.625rem;
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #8b7355;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6b5740;
  }
`;

const YearTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const YearTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  border: 2px solid ${({ $active }) => ($active ? '#8b7355' : '#e9ecef')};
  background: ${({ $active }) => ($active ? '#8b7355' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#495057')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #8b7355;
    color: ${({ $active }) => ($active ? 'white' : '#8b7355')};
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    background: transparent;
    box-shadow: none;
    border-radius: 0;

    thead {
      display: none;
    }

    tbody,
    tr,
    td {
      display: block;
    }

    tr {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 1rem;
      padding: 0.25rem 0;
      overflow: hidden;
    }
  }
`;

const Th = styled.th`
  padding: 1rem;
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
`;

const Td = styled.td<{ $full?: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  vertical-align: middle;

  @media (max-width: 768px) {
    ${(props) =>
      props.$full
        ? css`
            padding: 0.875rem 1rem;
            font-weight: 600;
            color: #2c3e50;

            &:not(:last-child) {
              border-bottom: 1px solid #e9ecef;
            }
          `
        : css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem 1rem;
            border-bottom: none;
            text-align: right;

            &::before {
              content: attr(data-label);
              font-weight: 600;
              color: #2c3e50;
              flex-shrink: 0;
            }
          `}
  }
`;

const TypeBadge = styled.span<{ $type: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${({ $type }) => {
    const map: Record<string, string> = {
      concert: '#e3f2fd',
      release: '#fff3e0',
      broadcast: '#f3e5f5',
      award: '#fffde7',
      etc: '#f5f5f5',
    };
    return map[$type] ?? map.etc;
  }};
  color: ${({ $type }) => {
    const map: Record<string, string> = {
      concert: '#1976d2',
      release: '#f57c00',
      broadcast: '#7b1fa2',
      award: '#f9a825',
      etc: '#616161',
    };
    return map[$type] ?? map.etc;
  }};
`;

const Thumb = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
`;

const NoImage = styled.span`
  color: #adb5bd;
  font-size: 0.875rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: #8b7355;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6b5740;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background: #c75b5b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #a84848;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  background: white;
  border-radius: 12px;
  margin-top: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #95a5a6;
  cursor: pointer;
  line-height: 1;

  &:hover {
    color: #7f8c8d;
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #8b7355;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #8b7355;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #8b7355;
  }
`;

const ImagePreview = styled.img`
  margin-top: 0.75rem;
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #7f8c8d;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #8b7355;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6b5740;
  }
`;
