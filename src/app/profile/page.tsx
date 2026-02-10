'use client';

import { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { artistData } from '@/data/artistData';
import { theme } from '@/styles/theme';

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
      <HeroBanner>
        <HeroOverlay />
        <HeroText>ABOUT</HeroText>
      </HeroBanner>

      <ContentArea>
        <ProfileSection>
          <ProfileLayout>
            <ProfileImageWrapper>
              <ProfileImage src={artistData.imageUrl} alt={artistData.name} />
            </ProfileImageWrapper>
            <ProfileInfo>
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
            </ProfileInfo>
          </ProfileLayout>
        </ProfileSection>

        <DiscographySection>
          <SectionHeader>
            <SectionLabelGroup>
              <SectionOverline>DISCOGRAPHY</SectionOverline>
              <SectionTitle>디스코그래피</SectionTitle>
            </SectionLabelGroup>
            <ScrollButtons>
              <ScrollButton onClick={() => scroll('left')} aria-label="왼쪽으로 스크롤">&#8592;</ScrollButton>
              <ScrollButton onClick={() => scroll('right')} aria-label="오른쪽으로 스크롤">&#8594;</ScrollButton>
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
      </ContentArea>
    </Wrapper>
  );
}

/* ─── Styled Components ─── */

const Wrapper = styled.div`
  min-height: calc(100vh - 200px);
  background: ${theme.colors.background};
`;

const HeroBanner = styled.div`
  position: relative;
  width: 100%;
  height: 40vh;
  min-height: 280px;
  background-image: url('/assets/콘서트.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(44, 36, 24, 0.3) 0%,
    rgba(44, 36, 24, 0.65) 100%
  );
`;

const HeroText = styled.h1`
  position: relative;
  z-index: 1;
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.hero.fontSize};
  font-weight: ${theme.typography.hero.fontWeight};
  letter-spacing: ${theme.typography.hero.letterSpacing};
  color: ${theme.colors.textLight};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 3rem;
  }
`;

const ContentArea = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 1.25rem;
  }
`;

const ProfileSection = styled.section`
  margin-bottom: 5rem;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ProfileLayout = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: ${theme.spacing.gap.xl};
  align-items: start;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 320px 1fr;
    gap: ${theme.spacing.gap.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.gap.lg};
  }
`;

const ProfileImageWrapper = styled.div`
  @media (max-width: ${theme.breakpoints.mobile}) {
    display: flex;
    justify-content: center;
  }
`;

const ProfileImage = styled.img`
  width: 400px;
  height: auto;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  transition: transform ${theme.transitions.normal}, box-shadow ${theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 320px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    max-width: 400px;
  }
`;

const ProfileInfo = styled.div`
  padding-top: 0.5rem;
`;

const ArtistName = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  line-height: ${theme.typography.h1.lineHeight};
  letter-spacing: ${theme.typography.h1.letterSpacing};
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.5rem 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.25rem;
    text-align: center;
  }
`;

const DifferentName = styled.h3`
  font-family: ${theme.typography.fontBody};
  font-size: ${theme.typography.h3.fontSize};
  font-weight: 300;
  color: ${theme.colors.textSecondary};
  margin: 0 0 2.5rem 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    text-align: center;
  }
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid ${theme.colors.borderLight};

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: center;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accent};
`;

const InfoValue = styled.span`
  font-family: ${theme.typography.fontBody};
  font-size: ${theme.typography.body.fontSize};
  font-weight: ${theme.typography.body.fontWeight};
  color: ${theme.colors.textPrimary};
`;

const Bio = styled.p`
  font-family: ${theme.typography.fontBody};
  font-size: ${theme.typography.bodyLarge.fontSize};
  font-weight: ${theme.typography.bodyLarge.fontWeight};
  line-height: ${theme.typography.bodyLarge.lineHeight};
  color: ${theme.colors.textSecondary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    text-align: center;
  }
`;

const DiscographySection = styled.section`
  margin-top: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
`;

const SectionLabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionOverline = styled.span`
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accent};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  line-height: ${theme.typography.h2.lineHeight};
  letter-spacing: ${theme.typography.h2.letterSpacing};
  color: ${theme.colors.textPrimary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const ScrollButtons = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const ScrollButton = styled.button`
  width: 42px;
  height: 42px;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-size: 1.2rem;
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.surfaceAlt};
    border-color: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AlbumCarousel = styled.div`
  display: flex;
  gap: ${theme.spacing.gap.md};
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.border} transparent;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primaryLight};
  }
`;

const AlbumCard = styled.div`
  flex: 0 0 320px;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: 0.75rem;
  box-shadow: ${theme.shadows.sm};
  transition: transform ${theme.transitions.normal}, box-shadow ${theme.transitions.normal};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.md};
  }
`;

const AlbumCover = styled.img<{ $clickable: boolean }>`
  width: 100%;
  height: 304px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 0.75rem;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: box-shadow ${theme.transitions.normal};

  &:hover {
    box-shadow: ${({ $clickable }) =>
      $clickable ? theme.shadows.md : 'none'};
  }
`;

const AlbumTitle = styled.h3`
  font-family: ${theme.typography.fontBody};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.35rem 0;
  color: ${theme.colors.textPrimary};
`;

const AlbumDate = styled.p`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textTertiary};
  margin: 0 0 1rem 0;
`;

const ViewTracksButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-family: ${theme.typography.fontBody};
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.overline.letterSpacing};
  transition: background ${theme.transitions.fast};
  margin-bottom: 0.75rem;

  &:hover {
    background: ${theme.colors.accent};
  }
`;

const TrackList = styled.div`
  background: ${theme.colors.surfaceAlt};
  border-radius: ${theme.borderRadius.md};
  padding: 0.75rem 1rem;
  animation: ${slideDown} 0.3s ease-out;
  overflow: hidden;
`;

const TrackItem = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr auto;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${theme.colors.borderLight};
  align-items: center;
  transition: background ${theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(44, 36, 24, 0.02);
  }
`;

const TrackNumber = styled.span`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textTertiary};
  font-weight: 500;
`;

const TrackTitle = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.textPrimary};
`;

const TrackDuration = styled.span`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textTertiary};
`;
