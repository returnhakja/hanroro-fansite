import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

export const NewReleaseSection = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: #0a0807;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 25% 50%, rgba(201, 169, 110, 0.07) 0%, transparent 65%);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
`;

export const NewReleaseInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: ${theme.spacing.gap.xl};
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1.2fr;
    gap: ${theme.spacing.gap.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.gap.md};
  }
`;

export const AlbumCoverWrap = styled(motion.div)`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.7),
    0 0 48px rgba(201, 169, 110, 0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const ReleaseInfo = styled(motion.div)`
  color: ${theme.colors.textLight};
`;

export const ReleaseTitle = styled(motion.h2)`
  font-family: ${theme.typography.fontHeading};
  font-size: 4rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: ${theme.colors.textLight};
  margin: 0 0 0.5rem 0;
  line-height: 1.1;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

export const ReleaseMeta = styled.p`
  font-size: ${theme.typography.small.fontSize};
  letter-spacing: 0.15em;
  color: ${theme.colors.accent};
  text-transform: uppercase;
  margin: 0 0 ${theme.spacing.gap.md} 0;
`;

export const ReleaseDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: ${theme.spacing.gap.sm} 0;
`;

export const ReleaseTrackList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing.gap.sm} 0;
`;

export const ReleaseTrackItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: ${theme.typography.body.fontSize};
  color: rgba(255, 255, 255, 0.8);

  &:last-child {
    border-bottom: none;
  }
`;

export const TrackNumber = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.accent};
  font-weight: 600;
  min-width: 1.5rem;
`;

export const TitleBadge = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #0a0807;
  background: ${theme.colors.accent};
  padding: 0.15rem 0.45rem;
  border-radius: 2px;
`;

export const ReleaseDesc = styled.p`
  font-size: ${theme.typography.small.fontSize};
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.45);
  margin: ${theme.spacing.gap.sm} 0 ${theme.spacing.gap.md} 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const TeaserLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  color: ${theme.colors.accent};
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: opacity ${theme.transitions.fast};

  &::after {
    content: '→';
  }

  &:hover {
    opacity: 0.7;
  }
`;
