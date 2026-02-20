import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 3rem 6rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 6rem 1.5rem 4rem;
  }
`;

export const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  color: ${theme.colors.textPrimary};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.1rem;
  text-align: center;
  color: ${theme.colors.textSecondary};
  margin-bottom: 4rem;
  font-weight: 400;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: 3rem;
  }
`;

export const UpcomingSection = styled.section`
  margin-bottom: 5rem;
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.75rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: 2rem;
  letter-spacing: -0.01em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const UpcomingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const EventCard = styled(motion.div)`
  position: relative;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};
  transition: transform ${theme.transitions.normal}, box-shadow ${theme.transitions.normal};
  background: ${theme.colors.surface};
  min-height: 380px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.xl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-height: 320px;
  }
`;

export const EventPoster = styled.div<{ $posterUrl?: string }>`
  width: 100%;
  height: 220px;
  background: ${props =>
    props.$posterUrl
      ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${props.$posterUrl})`
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
  right: 1rem;
  background: ${props => props.$isToday
    ? `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%)`
    : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.full};
  font-weight: 700;
  font-size: 1rem;
  box-shadow: ${theme.shadows.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`;

export const EventContent = styled.div`
  padding: 1.5rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1.25rem;
  }
`;

export const EventType = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 600;
  margin-bottom: 0.75rem;
  background: ${props => {
    switch (props.type) {
      case 'concert': return `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`;
      case 'fanmeeting': return `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%)`;
      case 'broadcast': return `linear-gradient(135deg, ${theme.colors.info} 0%, #5D7186 100%)`;
      case 'festival': return `linear-gradient(135deg, ${theme.colors.success} 0%, #4E6E4E 100%)`;
      default: return `linear-gradient(135deg, ${theme.colors.secondaryLight} 0%, ${theme.colors.secondary} 100%)`;
    }
  }};
  color: white;
`;

export const EventTitle = styled.h3`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: 1rem;
  line-height: 1.4;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`;

export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textSecondary};

  strong {
    color: ${theme.colors.textPrimary};
    min-width: 50px;
    font-weight: 600;
  }
`;

export const CalendarSection = styled.section`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  padding: 3rem;
  box-shadow: ${theme.shadows.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 1.5rem;
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 3rem 1.5rem;
    font-size: 1rem;
  }
`;
