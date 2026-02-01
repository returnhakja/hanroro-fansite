'use client';

import { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { artistData } from '@/data/artistData';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 300px;
  }
`;

export default function ProfilePage() {
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleAlbum = (id: string, hasTracks: boolean) => {
    if (!hasTracks) return;
    setOpenAlbumId(openAlbumId === id ? null : id);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Wrapper>
      <ProfileSection>
        <ProfileImage src={artistData.imageUrl} alt={artistData.name} />
        <ArtistName>{artistData.name}</ArtistName>
        <DifferentName>{artistData.differentName}</DifferentName>

        <InfoGrid>
          <InfoItem>
            <InfoLabel>소속사</InfoLabel>
            <InfoValue>{artistData.company}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>데뷔</InfoLabel>
            <InfoValue>{artistData.debutDate}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>장르</InfoLabel>
            <InfoValue>{artistData.genre}</InfoValue>
          </InfoItem>
        </InfoGrid>

        <Bio>{artistData.bio}</Bio>
      </ProfileSection>

      <DiscographySection>
        <SectionHeader>
          <SectionTitle>Discography</SectionTitle>
          <ScrollButtons>
            <ScrollButton onClick={() => scroll('left')}>←</ScrollButton>
            <ScrollButton onClick={() => scroll('right')}>→</ScrollButton>
          </ScrollButtons>
        </SectionHeader>

        <AlbumCarousel ref={scrollRef}>
          {artistData.albums.map((album) => {
            const hasTracks = album.tracks && album.tracks.length > 0;
            const isOpen = openAlbumId === album.id;

            return (
              <AlbumCard key={album.id}>
                <AlbumCover
                  src={album.coverUrl}
                  alt={album.title}
                  onClick={() => hasTracks && toggleAlbum(album.id, hasTracks)}
                  $clickable={hasTracks}
                />
                <AlbumTitle>{album.title}</AlbumTitle>
                <AlbumDate>{new Date(album.releaseDate).getFullYear()}</AlbumDate>

                {hasTracks && (
                  <ViewTracksButton onClick={() => toggleAlbum(album.id, hasTracks)}>
                    {isOpen ? 'Hide Tracks' : 'View Tracks'}
                  </ViewTracksButton>
                )}

                {isOpen && hasTracks && (
                  <TrackList>
                    {album.tracks.map((track, idx) => (
                      <TrackItem key={idx}>
                        <TrackNumber>{String(idx + 1).padStart(2, '0')}</TrackNumber>
                        <TrackTitle>{track.title}</TrackTitle>
                        <TrackDuration>{track.duration}</TrackDuration>
                      </TrackItem>
                    ))}
                  </TrackList>
                )}
              </AlbumCard>
            );
          })}
        </AlbumCarousel>
      </DiscographySection>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  padding: 3rem 0;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 2rem;
  object-fit: cover;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const ArtistName = styled.h1`
  font-size: 3rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem 0;
  color: #000;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const DifferentName = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  color: #666;
  margin: 0 0 3rem 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #999;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #000;
  font-weight: 400;
`;

const Bio = styled.p`
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
  color: #666;
  font-size: 1rem;
`;

const DiscographySection = styled.section`
  margin-top: 4rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: -0.01em;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ScrollButtons = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ScrollButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  color: #666;

  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AlbumCarousel = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;

const AlbumCard = styled.div`
  flex: 0 0 280px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const AlbumCover = styled.img<{ $clickable: boolean }>`
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: ${({ $clickable }) =>
      $clickable ? '0 8px 30px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.1)'};
  }
`;

const AlbumTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: #000;
`;

const AlbumDate = styled.p`
  font-size: 0.9rem;
  color: #999;
  margin: 0 0 1rem 0;
`;

const ViewTracksButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background 0.2s ease;
  margin-bottom: 1rem;

  &:hover {
    background: #333;
  }
`;

const TrackList = styled.div`
  background: #f9f9f9;
  border-radius: 4px;
  padding: 1rem;
  animation: ${slideDown} 0.3s ease-out;
  overflow: hidden;
`;

const TrackItem = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr auto;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`;

const TrackNumber = styled.span`
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
`;

const TrackTitle = styled.span`
  font-size: 0.9rem;
  color: #333;
`;

const TrackDuration = styled.span`
  font-size: 0.85rem;
  color: #999;
`;
