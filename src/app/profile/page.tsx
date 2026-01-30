'use client';

import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { artistData } from '@/data/artistData';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function ProfilePage() {
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);

  const toggleAlbum = (id: string, hasTracks: boolean) => {
    if (!hasTracks) return;
    setOpenAlbumId(openAlbumId === id ? null : id);
  };

  return (
    <Wrapper>
      <ProfileSection>
        <ProfileImage src={artistData.imageUrl} alt={artistData.name} />
        <h2>{artistData.name}</h2>
        <h4>{artistData.differentName}</h4>
        <p>
          소속사 : {artistData.company} <br />
          데뷔일 : {artistData.debutDate}
        </p>
        <p>{artistData.genre}</p>
        <Bio>{artistData.bio}</Bio>
      </ProfileSection>

      <h3>🎵 앨범</h3>
      <AlbumList>
        {artistData.albums.map((album) => {
          const hasTracks = album.tracks && album.tracks.length > 0;
          const isOpen = openAlbumId === album.id;

          return (
            <AlbumCard key={album.id}>
              <AlbumHeader
                onClick={() => toggleAlbum(album.id, hasTracks)}
                $clickable={hasTracks}
              >
                <Cover src={album.coverUrl} alt={album.title} />
                <AlbumInfo>
                  <strong>{album.title}</strong>
                  <p>{new Date(album.releaseDate).toLocaleDateString()}</p>
                </AlbumInfo>
                {hasTracks && <ToggleIcon>{isOpen ? '▲' : '▼'}</ToggleIcon>}
              </AlbumHeader>

              {isOpen && hasTracks && (
                <TrackList>
                  {album.tracks.map((track, idx) => (
                    <TrackItem key={idx}>
                      {idx + 1}. {track.title} ({track.duration})
                    </TrackItem>
                  ))}
                </TrackList>
              )}
            </AlbumCard>
          );
        })}
      </AlbumList>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const Bio = styled.p`
  color: #555;
`;

const AlbumList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const AlbumCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AlbumHeader = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  padding: 0.5rem;
  background-color: #f9f9f9;
`;

const Cover = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 1rem;
`;

const AlbumInfo = styled.div`
  flex: 1;

  p {
    font-size: 0.8rem;
    color: #888;
    margin: 0.2rem 0 0;
  }
`;

const ToggleIcon = styled.span`
  font-size: 1.2rem;
`;

const TrackList = styled.div`
  padding: 0.5rem 1rem;
  background-color: #fff;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  animation: ${slideDown} 0.3s ease-out;
`;

const TrackItem = styled.p`
  margin: 0.3rem 0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #f5f5f5;
  }
`;
