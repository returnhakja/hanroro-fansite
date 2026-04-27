import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 7rem 3rem 6rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 5.5rem 1.25rem 4rem;
  }
`;

/* =========================================================
   Hero Section
   ========================================================= */
export const HeroSection = styled.section`
  position: relative;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  margin-bottom: 2rem;
  min-height: 420px;
  box-shadow: ${theme.shadows.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-height: unset;
  }
`;

export const HeroBackground = styled.div<{ $posterUrl?: string }>`
  position: absolute;
  inset: 0;
  background: ${(props) =>
    props.$posterUrl
      ? `linear-gradient(135deg, rgba(20,14,6,0.75) 0%, rgba(20,14,6,0.55) 50%, rgba(20,14,6,0.8) 100%), url(${props.$posterUrl})`
      : `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`};
  background-size: cover;
  background-position: center;
  filter: blur(${(props) => (props.$posterUrl ? '2px' : '0')});
  transform: scale(1.05);
  z-index: 0;
`;

export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 3rem;
  padding: 4rem 3.5rem;
  min-height: 420px;
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 2rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2.25rem 1.25rem;
    gap: 1.5rem;
  }
`;

export const HeroCopy = styled.div`
  color: ${theme.colors.textLight};
  max-width: 520px;
`;

export const HeroOverline = styled.span`
  display: inline-block;
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  color: ${theme.colors.accentLight};
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

export const HeroTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 2.75rem;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin-bottom: 1.25rem;
  color: ${theme.colors.textLight};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.875rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.9375rem;
    margin-bottom: 1.5rem;
  }
`;

export const HeroCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: ${theme.colors.gradientGold};
  color: ${theme.colors.textPrimary};
  border-radius: ${theme.borderRadius.full};
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: transform ${theme.transitions.normal}, box-shadow ${theme.transitions.normal};
  box-shadow: ${theme.shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const FeaturedCard = styled.div`
  background: rgba(22, 16, 10, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: 1.25rem;
  color: ${theme.colors.textLight};
  box-shadow: ${theme.shadows.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

export const FeaturedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
  padding: 0 0.25rem;
`;

export const FeaturedLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${theme.colors.accentLight};
  letter-spacing: 0.05em;
`;

export const FeaturedBadge = styled.span<{ $isToday?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  background: ${(props) =>
    props.$isToday
      ? `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentLight} 100%)`
      : `linear-gradient(135deg, ${theme.colors.accentLight} 0%, ${theme.colors.accent} 100%)`};
`;

export const FeaturedPoster = styled.div<{ $posterUrl?: string }>`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: ${theme.borderRadius.lg};
  background: ${(props) =>
    props.$posterUrl
      ? `url(${props.$posterUrl})`
      : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`};
  background-size: cover;
  background-position: center;
  margin-bottom: 1rem;
`;

export const FeaturedTitle = styled.h3`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  padding: 0 0.25rem;
  color: ${theme.colors.textLight};
`;

export const FeaturedMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 0.25rem 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.78);

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  svg {
    width: 14px;
    height: 14px;
    color: ${theme.colors.accentLight};
    flex-shrink: 0;
  }
`;

export const FeaturedCTAButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.12);
  color: ${theme.colors.textLight};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

/* =========================================================
   Quick Nav
   ========================================================= */
export const QuickNavBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: 1.25rem;
  margin-bottom: 4rem;
  box-shadow: ${theme.shadows.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    padding: 0.85rem;
    margin-bottom: 3rem;
  }
`;

export const QuickTile = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: ${theme.borderRadius.lg};
  text-decoration: none;
  color: ${theme.colors.textPrimary};
  transition: background ${theme.transitions.normal}, transform ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.surfaceAlt};
    transform: translateY(-2px);
  }
`;

export const QuickTileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.surfaceWarm};
  color: ${theme.colors.primary};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const QuickTileText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`;

export const QuickTileTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  line-height: 1.2;
`;

export const QuickTileSub = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

/* =========================================================
   Section Headers
   ========================================================= */
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: 1.5rem;
  }
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.75rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.01em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.375rem;
  }
`;

export const SectionMore = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  padding: 0.4rem 0.85rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  white-space: nowrap;
  transition: all ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
`;

/* =========================================================
   Upcoming Section
   ========================================================= */
export const UpcomingSection = styled.section`
  margin-bottom: 4rem;
  scroll-margin-top: 6rem;
`;

export const UpcomingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const EventCard = styled(motion.div)`
  position: relative;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  transition: transform ${theme.transitions.normal}, box-shadow ${theme.transitions.normal};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${theme.shadows.xl};
  }
`;

export const EventPoster = styled.div<{ $posterUrl?: string }>`
  width: 100%;
  height: 220px;
  background: ${(props) =>
    props.$posterUrl
      ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.45)), url(${props.$posterUrl})`
      : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`};
  background-size: cover;
  background-position: center;
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 180px;
  }
`;

export const DdayBadge = styled.div<{ $isToday?: boolean }>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${(props) =>
    props.$isToday
      ? `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%)`
      : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`};
  color: white;
  padding: 0.4rem 0.85rem;
  border-radius: ${theme.borderRadius.md};
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: ${theme.shadows.sm};
`;

export const EventContent = styled.div`
  padding: 1.25rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

export const EventType = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  background: ${(props) => {
    switch (props.type) {
      case 'concert':
        return `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`;
      case 'fanmeeting':
        return `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%)`;
      case 'broadcast':
        return `linear-gradient(135deg, ${theme.colors.info} 0%, #5D7186 100%)`;
      case 'festival':
        return `linear-gradient(135deg, ${theme.colors.success} 0%, #4E6E4E 100%)`;
      default:
        return `linear-gradient(135deg, ${theme.colors.secondaryLight} 0%, ${theme.colors.secondary} 100%)`;
    }
  }};
  color: white;
`;

export const EventTitle = styled.h3`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.15rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.85rem;
  line-height: 1.4;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.05rem;
  }
`;

export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};

  svg {
    width: 14px;
    height: 14px;
    color: ${theme.colors.primary};
    flex-shrink: 0;
  }
`;

/* =========================================================
   Calendar Row + Sidebar
   ========================================================= */
export const CalendarRow = styled.section`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 4rem;
  scroll-margin-top: 6rem;
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const CalendarSection = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: 2rem;
  box-shadow: ${theme.shadows.sm};
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1.25rem;
  }
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

export const CalendarTitle = styled.h3`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

export const ScheduleSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

export const SidebarCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: 1.5rem;
  box-shadow: ${theme.shadows.sm};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const SidebarTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0 0 1rem;
  letter-spacing: -0.01em;
`;

export const DdayCountdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 0.85rem 1rem;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(135deg, ${theme.colors.surfaceWarm} 0%, ${theme.colors.surfaceAlt} 100%);
  border: 1px solid ${theme.colors.border};
`;

export const DdayLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const DdayHeadline = styled.div`
  font-family: ${theme.typography.fontHeading};
  font-size: 2.25rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  line-height: 1;
  letter-spacing: -0.02em;
`;

export const DdayEventTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  line-height: 1.4;
`;

export const DdayEventMeta = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

export const MiniEventList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

export const MiniEventItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${theme.colors.borderLight};
  cursor: pointer;
  transition: background ${theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.colors.surfaceAlt};
    margin: 0 -0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-radius: ${theme.borderRadius.sm};
  }
`;

export const MiniEventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
`;

export const MiniEventTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MiniEventDate = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textSecondary};
`;

export const MiniDday = styled.span<{ $isToday?: boolean }>`
  flex-shrink: 0;
  padding: 0.2rem 0.55rem;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.72rem;
  font-weight: 700;
  color: ${(props) => (props.$isToday ? theme.colors.textLight : theme.colors.primary)};
  background: ${(props) => (props.$isToday ? theme.colors.accent : theme.colors.surfaceAlt)};
  border: 1px solid
    ${(props) => (props.$isToday ? theme.colors.accent : theme.colors.border)};
`;

/* =========================================================
   Empty / Loading
   ========================================================= */
export const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  background: ${theme.colors.surface};
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
`;

/* =========================================================
   Past Section
   ========================================================= */
export const PastSection = styled.section`
  margin-bottom: 2rem;
  scroll-margin-top: 6rem;
`;

export const PastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const PastConcertCard = styled(motion.div)<{ $hasSetlist: boolean }>`
  position: relative;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  cursor: ${(props) => (props.$hasSetlist ? 'pointer' : 'default')};
  transition: transform ${theme.transitions.normal}, box-shadow ${theme.transitions.normal};

  &:hover {
    transform: ${(props) => (props.$hasSetlist ? 'translateY(-4px)' : 'none')};
    box-shadow: ${(props) => (props.$hasSetlist ? theme.shadows.lg : theme.shadows.sm)};
  }
`;

export const PastPoster = styled.div<{ $posterUrl?: string }>`
  width: 100%;
  height: 170px;
  background: ${(props) =>
    props.$posterUrl
      ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${props.$posterUrl})`
      : `linear-gradient(135deg, ${theme.colors.secondaryLight} 0%, ${theme.colors.secondary} 100%)`};
  background-size: cover;
  background-position: center;
  position: relative;
  filter: grayscale(15%);

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 140px;
  }
`;

export const SetlistBadge = styled.div`
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: ${theme.shadows.sm};
`;

export const PastConcertContent = styled.div`
  padding: 1rem 1.25rem 1.25rem;
`;

export const PastConcertTitle = styled.h3`
  font-family: ${theme.typography.fontHeading};
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.35rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PastConcertDate = styled.p`
  font-size: 0.82rem;
  color: ${theme.colors.textSecondary};
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  svg {
    width: 12px;
    height: 12px;
  }
`;

/* =========================================================
   Related (체류·연쇄 동선)
   ========================================================= */
export const RelatedSection = styled.section`
  margin-top: 3rem;
  margin-bottom: 2rem;
  scroll-margin-top: 6rem;
`;

export const RelatedIntro = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.textSecondary};
  margin: 0 0 1.5rem;
  line-height: 1.6;
`;

export const RelatedLinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const RelatedDeepLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.25rem 1.35rem;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  text-decoration: none;
  color: inherit;
  transition: border-color ${theme.transitions.normal}, box-shadow ${theme.transitions.normal},
    transform ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.primaryLight};
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const RelatedDeepTitle = styled.span`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.05rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const RelatedDeepDesc = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.45;
`;

export const RelatedEventsBlock = styled.div`
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surfaceAlt};
  padding: 1.5rem 1.5rem 1rem;
`;

export const RelatedEventsTitle = styled.h3`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.15rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0 0 1rem;
`;

export const RelatedEventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RelatedEventLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0.85rem;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.borderLight};
  text-decoration: none;
  color: inherit;
  transition: background ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.surfaceWarm};
  }
`;

export const RelatedEventMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
`;

export const RelatedEventName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RelatedEventMeta = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textSecondary};
`;
