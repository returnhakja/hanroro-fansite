'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Event {
  _id: string;
  title: string;
  date: string;
  time?: string;
  place?: string;
  posterUrl?: string;
  type: 'concert' | 'award' | 'broadcast' | 'other' | 'festival';
  isPinned: boolean;
}

interface EventFormData {
  title: string;
  date: string;
  time: string;
  place: string;
  posterUrl: string;
  type: 'concert' | 'award' | 'broadcast' | 'other' | 'festival';
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    time: '',
    place: '',
    posterUrl: '',
    type: 'other',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('일정 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingEvent
        ? `/api/admin/events/${editingEvent._id}`
        : '/api/admin/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchEvents();
        handleCloseModal();
      } else {
        const data = await res.json();
        alert(data.error || '저장 실패');
      }
    } catch (error) {
      console.error('일정 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchEvents();
      } else {
        const data = await res.json();
        alert(data.error || '삭제 실패');
      }
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  const handleTogglePin = async (event: Event) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/events/${event._id}/pin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPinned: !event.isPinned }),
      });

      if (res.ok) {
        await fetchEvents();
      }
    } catch (error) {
      console.error('일정 고정/해제 실패:', error);
    }
  };

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date.split('T')[0],
        time: event.time || '',
        place: event.place || '',
        posterUrl: event.posterUrl || '',
        type: event.type,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: '',
        time: '',
        place: '',
        posterUrl: '',
        type: 'other',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      place: '',
      posterUrl: '',
      type: 'other',
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      concert: '공연',
      award: '시상식',
      broadcast: '방송',
      festival : '페스티벌',
      other: '기타',
    };
    return types[type] || type;
  };

  if (loading) {
    return <Container>로딩 중...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>일정 관리</Title>
        <AddButton onClick={() => handleOpenModal()}>+ 일정 추가</AddButton>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>고정</Th>
            <Th>제목</Th>
            <Th>날짜</Th>
            <Th>시간</Th>
            <Th>장소</Th>
            <Th>유형</Th>
            <Th>관리</Th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <Td>
                <PinButton
                  onClick={() => handleTogglePin(event)}
                  $pinned={event.isPinned}
                >
                  {event.isPinned ? '📌' : '○'}
                </PinButton>
              </Td>
              <Td>{event.title}</Td>
              <Td>{new Date(event.date).toLocaleDateString('ko-KR')}</Td>
              <Td>{event.time || '-'}</Td>
              <Td>{event.place || '-'}</Td>
              <Td>
                <TypeBadge $type={event.type}>{getTypeLabel(event.type)}</TypeBadge>
              </Td>
              <Td>
                <ActionButtons>
                  <EditButton onClick={() => handleOpenModal(event)}>수정</EditButton>
                  <DeleteButton onClick={() => handleDelete(event._id)}>
                    삭제
                  </DeleteButton>
                </ActionButtons>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {events.length === 0 && (
        <EmptyMessage>등록된 일정이 없습니다</EmptyMessage>
      )}

      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingEvent ? '일정 수정' : '일정 추가'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
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

              <FormRow>
                <FormGroup>
                  <Label>날짜 *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>시간</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>장소</Label>
                <Input
                  type="text"
                  value={formData.place}
                  onChange={(e) =>
                    setFormData({ ...formData, place: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>유형</Label>
                <Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as EventFormData['type'],
                    })
                  }
                >
                  <option value="concert">공연</option>
                  <option value="festival">페스티벌</option>
                  <option value="award">시상식</option>
                  <option value="broadcast">방송</option>
                  <option value="other">기타</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>포스터 URL</Label>
                <Input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, posterUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={handleCloseModal}>
                  취소
                </CancelButton>
                <SubmitButton type="submit">
                  {editingEvent ? '수정' : '추가'}
                </SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5568d3;
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const Th = styled.th`
  padding: 1rem;
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
`;

const PinButton = styled.button<{ $pinned: boolean }>`
  padding: 0.25rem 0.5rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: ${(props) => (props.$pinned ? 1 : 0.3)};
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const TypeBadge = styled.span<{ $type: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${(props) => {
    const colors: Record<string, string> = {
      concert: '#e3f2fd',
      award: '#fff3e0',
      broadcast: '#f3e5f5',
      festival: '#fff9c4',
      other: '#f5f5f5',
    };
    return colors[props.$type] || colors.other;
  }};
  color: ${(props) => {
    const colors: Record<string, string> = {
      concert: '#1976d2',
      award: '#f57c00',
      broadcast: '#7b1fa2',
      festival: '#f57f17',
      other: '#616161',
    };
    return colors[props.$type] || colors.other;
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5568d3;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c0392b;
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  max-width: 600px;
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
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

  &:focus {
    outline: none;
    border-color: #667eea;
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
    border-color: #667eea;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5568d3;
  }
`;
