'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  useAdminConcerts,
  useSetlists,
  useCreateConcert,
  useUpdateConcert,
  useDeleteConcert,
  useToggleConcertActive,
  useCreateSetlist,
  useUpdateSetlist,
  useDeleteSetlist,
  type Concert,
  type SetList,
  type Song,
} from '@/hooks/queries/useConcerts';

export default function AdminConcertsPage() {
  const { data: concerts = [], isLoading } = useAdminConcerts();
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [showConcertModal, setShowConcertModal] = useState(false);
  const [showSetlistModal, setShowSetlistModal] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [editingSetlist, setEditingSetlist] = useState<SetList | null>(null);

  const [concertForm, setConcertForm] = useState({
    title: '',
    venue: '',
    startDate: '',
    endDate: '',
    posterUrl: '',
  });

  const [setlistForm, setSetlistForm] = useState({
    day: 1,
    date: '',
    songs: [] as Song[],
  });

  // concerts 로드 완료 후 첫 번째 공연 자동 선택
  useEffect(() => {
    if (concerts.length > 0 && !selectedConcert) {
      setSelectedConcert(concerts[0]);
    }
  }, [concerts, selectedConcert]);

  const { data: setlists = [] } = useSetlists(selectedConcert?._id ?? null);

  const createConcert = useCreateConcert();
  const updateConcert = useUpdateConcert();
  const deleteConcert = useDeleteConcert();
  const toggleActive = useToggleConcertActive();
  const createSetlist = useCreateSetlist(selectedConcert?._id ?? '');
  const updateSetlist = useUpdateSetlist(selectedConcert?._id ?? '');
  const deleteSetlist = useDeleteSetlist(selectedConcert?._id ?? '');

  const handleSaveConcert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingConcert) {
        await updateConcert.mutateAsync({ id: editingConcert._id, body: concertForm });
      } else {
        await createConcert.mutateAsync(concertForm as any);
      }
      handleCloseConcertModal();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : '저장 실패');
    }
  };

  const handleDeleteConcert = async (id: string) => {
    if (!confirm('공연을 삭제하면 해당 셋리스트도 모두 삭제됩니다. 계속하시겠습니까?'))
      return;
    try {
      await deleteConcert.mutateAsync(id);
      if (selectedConcert?._id === id) {
        setSelectedConcert(null);
      }
    } catch (err: unknown) {
      console.error('공연 삭제 실패:', err);
    }
  };

  const handleToggleActive = async (concert: Concert) => {
    try {
      await toggleActive.mutateAsync({ id: concert._id, isActive: !concert.isActive });
    } catch (err: unknown) {
      console.error('공연 활성화 실패:', err);
    }
  };

  const handleSaveSetlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConcert) return;
    try {
      if (editingSetlist) {
        await updateSetlist.mutateAsync({
          id: editingSetlist._id,
          body: { day: setlistForm.day, date: setlistForm.date, songs: setlistForm.songs },
        });
      } else {
        await createSetlist.mutateAsync({
          ...setlistForm,
          concertId: selectedConcert._id,
        });
      }
      handleCloseSetlistModal();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : '저장 실패');
    }
  };

  const handleDeleteSetlist = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteSetlist.mutateAsync(id);
    } catch (err: unknown) {
      console.error('셋리스트 삭제 실패:', err);
    }
  };

  const handleOpenConcertModal = (concert?: Concert) => {
    if (concert) {
      setEditingConcert(concert);
      setConcertForm({
        title: concert.title,
        venue: concert.venue,
        startDate: concert.startDate.split('T')[0],
        endDate: concert.endDate.split('T')[0],
        posterUrl: concert.posterUrl || '',
      });
    } else {
      setEditingConcert(null);
      setConcertForm({
        title: '',
        venue: '',
        startDate: '',
        endDate: '',
        posterUrl: '',
      });
    }
    setShowConcertModal(true);
  };

  const handleCloseConcertModal = () => {
    setShowConcertModal(false);
    setEditingConcert(null);
  };

  const handleOpenSetlistModal = (setlist?: SetList) => {
    if (setlist) {
      setEditingSetlist(setlist);
      setSetlistForm({
        day: setlist.day,
        date: setlist.date.split('T')[0],
        songs: setlist.songs,
      });
    } else {
      setEditingSetlist(null);
      setSetlistForm({
        day: setlists.length + 1,
        date: '',
        songs: [],
      });
    }
    setShowSetlistModal(true);
  };

  const handleCloseSetlistModal = () => {
    setShowSetlistModal(false);
    setEditingSetlist(null);
  };

  const handleAddSong = () => {
    setSetlistForm({
      ...setlistForm,
      songs: [
        ...setlistForm.songs,
        {
          title: '',
          albumImageUrl: '',
          order: setlistForm.songs.length + 1,
        },
      ],
    });
  };

  const handleRemoveSong = (index: number) => {
    const newSongs = setlistForm.songs.filter((_, i) => i !== index);
    // 순서 재정렬
    setSetlistForm({
      ...setlistForm,
      songs: newSongs.map((song, i) => ({ ...song, order: i + 1 })),
    });
  };

  const handleSongChange = (index: number, field: keyof Song, value: string) => {
    const newSongs = [...setlistForm.songs];
    newSongs[index] = { ...newSongs[index], [field]: value };
    setSetlistForm({ ...setlistForm, songs: newSongs });
  };

  if (isLoading) {
    return <Container>로딩 중...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>공연 및 셋리스트 관리</Title>
        <AddButton onClick={() => handleOpenConcertModal()}>+ 공연 추가</AddButton>
      </Header>

      <Content>
        <Sidebar>
          <SidebarTitle>공연 목록</SidebarTitle>
          {concerts.map((concert) => (
            <ConcertCard
              key={concert._id}
              $active={selectedConcert?._id === concert._id}
              onClick={() => setSelectedConcert(concert)}
            >
              <ConcertTitle>{concert.title}</ConcertTitle>
              <ConcertInfo>{concert.venue}</ConcertInfo>
              <ConcertInfo>
                {new Date(concert.startDate).toLocaleDateString('ko-KR')} ~{' '}
                {new Date(concert.endDate).toLocaleDateString('ko-KR')}
              </ConcertInfo>
              {concert.isActive && <ActiveBadge>활성</ActiveBadge>}
              <ConcertActions onClick={(e) => e.stopPropagation()}>
                <SmallButton onClick={() => handleToggleActive(concert)}>
                  {concert.isActive ? '비활성화' : '활성화'}
                </SmallButton>
                <SmallButton onClick={() => handleOpenConcertModal(concert)}>
                  수정
                </SmallButton>
                <SmallButton
                  $danger
                  onClick={() => handleDeleteConcert(concert._id)}
                >
                  삭제
                </SmallButton>
              </ConcertActions>
            </ConcertCard>
          ))}
        </Sidebar>

        <Main>
          {selectedConcert ? (
            <>
              <MainHeader>
                <MainTitle>{selectedConcert.title} 셋리스트</MainTitle>
                <AddButton onClick={() => handleOpenSetlistModal()}>
                  + 셋리스트 추가
                </AddButton>
              </MainHeader>

              {setlists.length === 0 ? (
                <EmptyMessage>등록된 셋리스트가 없습니다</EmptyMessage>
              ) : (
                <SetlistGrid>
                  {setlists.map((setlist) => (
                    <SetlistCard key={setlist._id}>
                      <SetlistHeader>
                        <div>
                          <SetlistDay>Day {setlist.day}</SetlistDay>
                          <SetlistDate>
                            {new Date(setlist.date).toLocaleDateString('ko-KR')}
                          </SetlistDate>
                        </div>
                        <SetlistActions>
                          <SmallButton
                            onClick={() => handleOpenSetlistModal(setlist)}
                          >
                            수정
                          </SmallButton>
                          <SmallButton
                            $danger
                            onClick={() => handleDeleteSetlist(setlist._id)}
                          >
                            삭제
                          </SmallButton>
                        </SetlistActions>
                      </SetlistHeader>
                      <SongList>
                        {setlist.songs.length === 0 ? (
                          <EmptySongs>곡이 없습니다</EmptySongs>
                        ) : (
                          setlist.songs.map((song, idx) => (
                            <SongItem key={idx}>
                              <SongOrder>{song.order}</SongOrder>
                              <SongTitle>{song.title}</SongTitle>
                            </SongItem>
                          ))
                        )}
                      </SongList>
                    </SetlistCard>
                  ))}
                </SetlistGrid>
              )}
            </>
          ) : (
            <EmptyMessage>공연을 선택하세요</EmptyMessage>
          )}
        </Main>
      </Content>

      {/* 공연 모달 */}
      {showConcertModal && (
        <Modal onClick={handleCloseConcertModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingConcert ? '공연 수정' : '공연 추가'}</ModalTitle>
              <CloseButton onClick={handleCloseConcertModal}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSaveConcert}>
              <FormGroup>
                <Label>제목 *</Label>
                <Input
                  type="text"
                  value={concertForm.title}
                  onChange={(e) =>
                    setConcertForm({ ...concertForm, title: e.target.value })
                  }
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>장소 *</Label>
                <Input
                  type="text"
                  value={concertForm.venue}
                  onChange={(e) =>
                    setConcertForm({ ...concertForm, venue: e.target.value })
                  }
                  required
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>시작일 *</Label>
                  <Input
                    type="date"
                    value={concertForm.startDate}
                    onChange={(e) =>
                      setConcertForm({ ...concertForm, startDate: e.target.value })
                    }
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>종료일 *</Label>
                  <Input
                    type="date"
                    value={concertForm.endDate}
                    onChange={(e) =>
                      setConcertForm({ ...concertForm, endDate: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>포스터 URL</Label>
                <Input
                  type="url"
                  value={concertForm.posterUrl}
                  onChange={(e) =>
                    setConcertForm({ ...concertForm, posterUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={handleCloseConcertModal}>
                  취소
                </CancelButton>
                <SubmitButton type="submit">
                  {editingConcert ? '수정' : '추가'}
                </SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* 셋리스트 모달 */}
      {showSetlistModal && (
        <Modal onClick={handleCloseSetlistModal}>
          <ModalContent $large onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingSetlist ? '셋리스트 수정' : '셋리스트 추가'}
              </ModalTitle>
              <CloseButton onClick={handleCloseSetlistModal}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSaveSetlist}>
              <FormRow>
                <FormGroup>
                  <Label>Day *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={setlistForm.day}
                    onChange={(e) =>
                      setSetlistForm({
                        ...setlistForm,
                        day: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>날짜 *</Label>
                  <Input
                    type="date"
                    value={setlistForm.date}
                    onChange={(e) =>
                      setSetlistForm({ ...setlistForm, date: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>곡 목록</Label>
                {setlistForm.songs.map((song, index) => (
                  <SongInputRow key={index}>
                    <SongInputNumber>{index + 1}</SongInputNumber>
                    <Input
                      type="text"
                      placeholder="곡 제목"
                      value={song.title}
                      onChange={(e) =>
                        handleSongChange(index, 'title', e.target.value)
                      }
                      required
                    />
                    <Input
                      type="url"
                      placeholder="앨범 이미지 URL (선택)"
                      value={song.albumImageUrl || ''}
                      onChange={(e) =>
                        handleSongChange(index, 'albumImageUrl', e.target.value)
                      }
                    />
                    <RemoveSongButton
                      type="button"
                      onClick={() => handleRemoveSong(index)}
                    >
                      삭제
                    </RemoveSongButton>
                  </SongInputRow>
                ))}
                <AddSongButton type="button" onClick={handleAddSong}>
                  + 곡 추가
                </AddSongButton>
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={handleCloseSetlistModal}>
                  취소
                </CancelButton>
                <SubmitButton type="submit">
                  {editingSetlist ? '수정' : '추가'}
                </SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  max-width: 1400px;
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
  background: #8B7355;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6B5740;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-height: calc(100vh - 250px);
  overflow-y: auto;
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ConcertCard = styled.div<{ $active: boolean }>`
  padding: 1rem;
  border: 2px solid ${(props) => (props.$active ? '#8B7355' : '#e9ecef')};
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? '#f8f9ff' : 'white')};

  &:hover {
    border-color: #8B7355;
  }
`;

const ConcertTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ConcertInfo = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
`;

const ActiveBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #8B7355;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const ConcertActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const SmallButton = styled.button<{ $danger?: boolean }>`
  padding: 0.4rem 0.8rem;
  background: ${(props) => (props.$danger ? '#C75B5B' : '#95a5a6')};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.$danger ? '#A84848' : '#7f8c8d')};
  }
`;

const Main = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const MainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MainTitle = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
`;

const SetlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SetlistCard = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f8f9fa;
`;

const SetlistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
`;

const SetlistDay = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #8B7355;
`;

const SetlistDate = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;

const SetlistActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SongItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
`;

const SongOrder = styled.div`
  width: 24px;
  height: 24px;
  background: #8B7355;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const SongTitle = styled.div`
  color: #2c3e50;
  font-size: 0.95rem;
`;

const EmptySongs = styled.div`
  text-align: center;
  padding: 2rem;
  color: #95a5a6;
  font-size: 0.9rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
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

const ModalContent = styled.div<{ $large?: boolean }>`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: ${(props) => (props.$large ? '800px' : '600px')};
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
    border-color: #8B7355;
  }
`;

const SongInputRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 80px;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  align-items: center;
`;

const SongInputNumber = styled.div`
  width: 32px;
  height: 32px;
  background: #8B7355;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const RemoveSongButton = styled.button`
  padding: 0.5rem;
  background: #C75B5B;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #A84848;
  }
`;

const AddSongButton = styled.button`
  padding: 0.75rem;
  background: #f8f9fa;
  color: #8B7355;
  border: 2px dashed #8B7355;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;

  &:hover {
    background: #f0f1ff;
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
  background: #8B7355;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6B5740;
  }
`;
