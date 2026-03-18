'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Modal from 'react-modal';
import { CloseButton } from '@/components/ui/CloseButton';
import Spinner from '@/components/ui/Spinner';
import { theme } from '@/styles/theme';
import { useImages, useUploadMedia, useDeleteImage, type GalleryImage } from '@/hooks/queries/useGallery';

type MediaTab = 'image' | 'video';

function GalleryContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'video' ? 'video' : 'image';
  const [activeTab, setActiveTab] = useState<MediaTab>(initialTab);

  const { data, isLoading: loading } = useImages(activeTab);
  const items = data ?? [];

  const { uploadMedia } = useUploadMedia();
  const deleteMutation = useDeleteImage();

  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);

  // 업로드 관련 상태
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setSelectedItem(null);
        alert('삭제되었습니다');
      },
      onError: () => alert('삭제에 실패했습니다'),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      alert('파일과 제목을 모두 입력해주세요');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      await uploadMedia({
        file: uploadFile,
        title: uploadTitle,
        onProgress: setUploadProgress,
      });
      alert('업로드 성공!');
      setUploadModalOpen(false);
      resetUploadForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : '업로드에 실패했습니다');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadTitle('');
    setPreview(null);
  };

  const handleDownload = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      const ext = url.split('.').pop()?.split('?')[0] || 'mp4';
      a.download = `${title}.${ext}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(a);
    } catch {
      alert('다운로드에 실패했습니다');
    }
  };

  const isVideoFile = (file: File | null) => file?.type.startsWith('video/') ?? false;

  if (loading) return <Spinner />;

  return (
    <Container>
      <Header>
        <div>
          <Overline>GALLERY</Overline>
          <Title>갤러리</Title>
          <Subtitle>한로로의 다양한 모습을 감상하세요</Subtitle>
        </div>
        {session && (
          <UploadButton onClick={() => setUploadModalOpen(true)}>
            미디어 업로드
          </UploadButton>
        )}
      </Header>

      <TabBar>
        <Tab $active={activeTab === 'image'} onClick={() => setActiveTab('image')}>
          이미지
        </Tab>
        <Tab $active={activeTab === 'video'} onClick={() => setActiveTab('video')}>
          동영상
        </Tab>
      </TabBar>

      {items.length === 0 ? (
        <EmptyState>
          {activeTab === 'image' ? '업로드된 이미지가 없습니다' : '업로드된 동영상이 없습니다'}
        </EmptyState>
      ) : (
        <Grid>
          {items.map((item) => (
            <MediaCard key={item._id} onClick={() => setSelectedItem(item)}>
              <MediaWrapper>
                {item.type === 'video' ? (
                  <>
                    <VideoThumb>
                      <video src={item.imageUrl} preload="metadata" muted />
                      <PlayIcon>▶</PlayIcon>
                    </VideoThumb>
                  </>
                ) : (
                  <StyledImage src={item.imageUrl} alt={item.title} />
                )}
              </MediaWrapper>
              <MediaTitle>{item.title}</MediaTitle>
            </MediaCard>
          ))}
        </Grid>
      )}

      {/* 상세보기 모달 */}
      <Modal
        isOpen={!!selectedItem}
        onRequestClose={() => setSelectedItem(null)}
        style={{
          overlay: {
            backgroundColor: 'rgba(44, 36, 24, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1000,
          },
          content: {
            background: 'transparent',
            border: 'none',
            padding: 0,
            inset: '50px',
          },
        }}
      >
        {selectedItem && (
          <ModalContent>
            <CloseButton onClick={() => setSelectedItem(null)} />
            {selectedItem.type === 'video' ? (
              <ModalVideo src={selectedItem.imageUrl} controls autoPlay={false} />
            ) : (
              <ModalImage src={selectedItem.imageUrl} alt={selectedItem.title} />
            )}
            <ModalTitle>{selectedItem.title}</ModalTitle>
            <ButtonGroup>
              <DownloadButton onClick={() => handleDownload(selectedItem.imageUrl, selectedItem.title)}>
                ⬇ 다운로드
              </DownloadButton>
              {session && selectedItem.userId === session.user?.id && (
                <DeleteButton onClick={() => handleDelete(selectedItem._id)}>
                  삭제
                </DeleteButton>
              )}
            </ButtonGroup>
          </ModalContent>
        )}
      </Modal>

      {/* 업로드 모달 */}
      <Modal
        isOpen={uploadModalOpen}
        onRequestClose={() => {
          if (uploading) return;
          setUploadModalOpen(false);
          resetUploadForm();
        }}
        style={{
          overlay: {
            backgroundColor: 'rgba(44, 36, 24, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1000,
          },
          content: {
            background: theme.colors.surfaceAlt,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
            padding: '2rem',
            maxWidth: '500px',
            margin: '50px auto',
            maxHeight: '80vh',
            overflow: 'auto',
          },
        }}
      >
        <UploadModalContent>
          <CloseButton
            onClick={() => {
              if (uploading) return;
              setUploadModalOpen(false);
              resetUploadForm();
            }}
          />
          <UploadModalTitle>미디어 업로드</UploadModalTitle>

          <UploadForm>
            <Label>제목</Label>
            <Input
              type="text"
              placeholder="제목을 입력하세요"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              disabled={uploading}
            />

            <Label>파일 선택 (이미지 또는 동영상)</Label>
            <FileInput
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {preview && (
              <PreviewContainer>
                {isVideoFile(uploadFile) ? (
                  <PreviewVideo src={preview} controls />
                ) : (
                  <PreviewImage src={preview} alt="미리보기" />
                )}
              </PreviewContainer>
            )}

            {uploading && (
              <ProgressWrapper>
                <ProgressBar>
                  <ProgressFill $percent={uploadProgress} />
                </ProgressBar>
                <ProgressText>{uploadProgress}%</ProgressText>
              </ProgressWrapper>
            )}

            <UploadSubmitButton
              onClick={handleUpload}
              disabled={!uploadFile || !uploadTitle.trim() || uploading}
            >
              {uploading ? `업로드 중... ${uploadProgress}%` : '업로드'}
            </UploadSubmitButton>
          </UploadForm>
        </UploadModalContent>
      </Modal>
    </Container>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <GalleryContent />
    </Suspense>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Overline = styled.span`
  display: block;
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accent};
  margin-bottom: 0.5rem;
  font-family: ${theme.typography.fontBody};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.textSecondary};
  font-family: ${theme.typography.fontBody};
  margin-bottom: 0;
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: ${theme.colors.primary};
  border: 1.5px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  font-family: ${theme.typography.fontBody};
  white-space: nowrap;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.accent};
    border-color: ${theme.colors.accent};
    color: ${theme.colors.textLight};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${theme.colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 2rem;
  background: transparent;
  color: ${({ $active }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? theme.colors.accent : 'transparent')};
  margin-bottom: -2px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  font-family: ${theme.typography.fontBody};
  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.accent};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MediaCard = styled.div`
  cursor: pointer;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.normal};
  background: ${theme.colors.surface};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

const MediaWrapper = styled.div`
  overflow: hidden;
  position: relative;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  transition: transform ${theme.transitions.normal};

  ${MediaCard}:hover & {
    transform: scale(1.03);
  }
`;

const VideoThumb = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  background: ${theme.colors.surfaceWarm};
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  ${MediaCard}:hover & video {
    transform: scale(1.03);
    transition: transform ${theme.transitions.normal};
  }
`;

const PlayIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.2);
  transition: background ${theme.transitions.fast};

  ${MediaCard}:hover & {
    background: rgba(0, 0, 0, 0.35);
  }
`;

const MediaTitle = styled.div`
  padding: 0.75rem 1rem;
  background: ${theme.colors.surfaceAlt};
  font-size: 0.9rem;
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontBody};
  border-top: 1px solid ${theme.colors.borderLight};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.textTertiary};
  font-size: 1.1rem;
  font-family: ${theme.typography.fontBody};
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: ${theme.borderRadius.md};
`;

const ModalVideo = styled.video`
  max-width: 90%;
  max-height: 70vh;
  border-radius: ${theme.borderRadius.md};
  outline: none;
`;

const ModalTitle = styled.h3`
  color: ${theme.colors.textLight};
  margin-top: 1rem;
  font-size: 1.2rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const DownloadButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: ${theme.colors.accent};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: #B89B6A;
    box-shadow: ${theme.shadows.sm};
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: ${theme.colors.error};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: #A94A4A;
    box-shadow: ${theme.shadows.sm};
  }
`;

const UploadModalContent = styled.div`
  position: relative;
`;

const UploadModalTitle = styled.h2`
  font-size: 1.8rem;
  font-family: ${theme.typography.fontHeading};
  font-weight: 400;
  color: ${theme.colors.textPrimary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const UploadForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontBody};
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  transition: border-color ${theme.transitions.fast};

  &::placeholder { color: ${theme.colors.textTertiary}; }
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.15);
  }
  &:disabled {
    background: ${theme.colors.surfaceWarm};
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  padding: 0.75rem;
  border: 2px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 0.95rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textSecondary};
  background: ${theme.colors.surface};
  cursor: pointer;
  transition: border-color ${theme.transitions.fast};

  &:hover { border-color: ${theme.colors.accent}; }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 240px;
  object-fit: contain;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
`;

const PreviewVideo = styled.video`
  max-width: 100%;
  max-height: 240px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${theme.colors.borderLight};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${theme.colors.accent};
  border-radius: 4px;
  transition: width 0.2s ease;
`;

const ProgressText = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  font-family: ${theme.typography.fontBody};
  min-width: 40px;
  text-align: right;
`;

const UploadSubmitButton = styled.button`
  padding: 1rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: ${theme.typography.fontBody};
  transition: all ${theme.transitions.normal};
  margin-top: 0.5rem;

  &:hover:not(:disabled) { background: ${theme.colors.accent}; }
  &:disabled {
    background: ${theme.colors.borderLight};
    color: ${theme.colors.textTertiary};
    cursor: not-allowed;
  }
`;
