import styled from "styled-components";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

export const Container = styled.div`
  font-family: ${theme.typography.fontBody};
  background-color: ${theme.colors.background};
  margin-top: -70px;
`;

/* ==================== Hero Section ==================== */

export const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    min-height: 500px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 85vh;
    min-height: 450px;
  }
`;

export const HeroBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/assets/대로로.jpg');
  background-size: cover;
  background-position: center 20%;
  z-index: 0;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${theme.colors.gradientHero};
  z-index: 1;
`;

export const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  text-align: center;
  color: ${theme.colors.textLight};
  padding: ${theme.spacing.gap.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

export const HeroTitle = styled(motion.h1)`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.hero.fontSize};
  font-weight: ${theme.typography.hero.fontWeight};
  line-height: ${theme.typography.hero.lineHeight};
  letter-spacing: ${theme.typography.hero.letterSpacing};
  margin-bottom: ${theme.spacing.gap.md};
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.75rem;
  }
`;

export const HeroSubtitle = styled(motion.p)`
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.85;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.875rem;
    letter-spacing: 0.15em;
  }
`;

export const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 1px;
  height: 60px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: rgba(255, 255, 255, 0.9);
    animation: scrollLine 2s infinite;
  }

  @keyframes scrollLine {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    100% {
      transform: translateY(60px);
      opacity: 0;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    bottom: 2rem;
    height: 40px;
  }
`;

/* ==================== Section Common ==================== */

export const SectionOverline = styled.span`
  display: block;
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accent};
  margin-bottom: ${theme.spacing.gap.sm};
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  line-height: ${theme.typography.h1.lineHeight};
  letter-spacing: ${theme.typography.h1.letterSpacing};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.gap.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2.25rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.75rem;
    margin-bottom: ${theme.spacing.gap.md};
  }
`;

export const SectionLink = styled.a`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  cursor: pointer;
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.accent};
  }

  &::after {
    content: ' \\2192';
  }
`;

/* ==================== Video Section ==================== */

export const VideoSection = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.background};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.gap.xl};
  min-height: 400px;
`;

export const StyledSlider = styled(Slider)`
  .slick-slide {
    display: block !important;
    justify-content: center;
  }

  .slick-prev,
  .slick-next {
    position: absolute;
    z-index: 1;
    background: none !important;
    width: auto;
    height: auto;
  }

  .slick-prev:before,
  .slick-next:before {
    color: ${theme.colors.primary};
    font-size: 40px;
  }

  .slick-dots li button:before {
    color: ${theme.colors.primaryLight};
  }

  .slick-dots li.slick-active button:before {
    color: ${theme.colors.accent};
  }
`;

export const VideoSlide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 ${theme.spacing.gap.md};
`;

export const VideoWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  margin: 0 auto;
  box-shadow: ${theme.shadows.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    max-width: 700px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 100%;
    min-width: 320px;
    border-radius: ${theme.borderRadius.sm};
  }
`;

export const Thumbnail = styled.img.withConfig({
  shouldForwardProp: (prop) => prop !== "visible",
})<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease, transform ${theme.transitions.normal};
  pointer-events: ${(props) => (props.visible ? "auto" : "none")};

  &:hover {
    transform: scale(1.02);
  }
`;

export const StyledIframe = styled.iframe.withConfig({
  shouldForwardProp: (prop) => prop !== "visible",
})<{ visible: boolean }>`
  width: 100%;
  height: 100%;
  border: none;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

/* ==================== Gallery Preview Section ==================== */

export const GalleryPreviewSection = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.surface};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${theme.spacing.gap.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.gap.sm};
    align-items: flex-start;
  }
`;

export const SectionHeaderLeft = styled.div``;

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.gap.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const GalleryItem = styled(motion.div)`
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const GalleryItemOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing.gap.md};
  background: linear-gradient(to top, rgba(44, 36, 24, 0.7), transparent);
  color: ${theme.colors.textLight};
  transform: translateY(100%);
  transition: transform ${theme.transitions.normal};

  ${GalleryItem}:hover & {
    transform: translateY(0);
  }

  h4 {
    font-size: ${theme.typography.small.fontSize};
    font-weight: 500;
    margin: 0;
  }
`;

/* ==================== Board Preview Section ==================== */

export const BoardPreviewSection = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.background};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
`;

export const BoardList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BoardItem = styled(motion.div)`
  padding: ${theme.spacing.gap.md} 0;
  border-bottom: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  position: relative;
  padding-left: 0;

  &:hover {
    padding-left: ${theme.spacing.gap.md};
    border-left: 3px solid ${theme.colors.accent};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.gap.sm} 0;
  }
`;

export const BoardItemTitle = styled.h3`
  font-family: ${theme.typography.fontBody};
  font-size: ${theme.typography.h3.fontSize};
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.gap.xs} 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

export const BoardItemMeta = styled.div`
  display: flex;
  gap: ${theme.spacing.gap.sm};
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textTertiary};

  span {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.gap.xs};
  }

  span + span::before {
    content: '/';
    margin-right: ${theme.spacing.gap.xs};
    color: ${theme.colors.borderLight};
  }
`;

/* ==================== Two Column Grid (Calendar + Setlist) ==================== */

export const TwoColumnGrid = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.surfaceAlt};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.gridGap.desktop};
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
    gap: ${theme.spacing.gridGap.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    padding: ${theme.spacing.sectionPadding.mobile};
    gap: ${theme.spacing.gridGap.mobile};
  }
`;

export const TwoColumnItem = styled(motion.div)`
  padding: ${theme.spacing.gap.lg};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.gap.md};
  }
`;

export const ColumnTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.gap.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
    margin-bottom: ${theme.spacing.gap.md};
  }
`;

/* ==================== Setlist ==================== */

export const TabWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.gap.xs};
  margin-bottom: ${theme.spacing.gap.lg};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.25rem;
  border: 1.5px solid ${(props) => (props.$active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${theme.borderRadius.full};
  background: ${(props) => (props.$active ? theme.colors.accent : 'transparent')};
  font-weight: ${(props) => (props.$active ? 600 : 400)};
  font-size: ${theme.typography.small.fontSize};
  color: ${(props) => (props.$active ? theme.colors.textLight : theme.colors.textSecondary)};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.accent};
    color: ${(props) => (props.$active ? theme.colors.textLight : theme.colors.accent)};
  }
`;

export const SetlistCard = styled.div`
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.secondaryLight};
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

export const SetListItem = styled(motion.li)`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.gap.sm};
  margin-bottom: 2px;
  font-size: ${theme.typography.body.fontSize};
  line-height: ${theme.typography.body.lineHeight};
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.surfaceAlt};
    transform: translateX(4px);
  }
`;

export const SongOrder = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.accent};
  margin-right: ${theme.spacing.gap.sm};
  flex-shrink: 0;
`;

export const AlbumThumb = styled.img`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.sm};
  margin-right: ${theme.spacing.gap.sm};
  object-fit: cover;
`;

/* ==================== Calendar ==================== */

export const EventList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  li {
    margin-bottom: ${theme.spacing.gap.xs};
  }
`;

/* ==================== Unused but kept for compatibility ==================== */

export const PostCard = styled(motion.div)`
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.gap.lg};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-4px);
  }
`;

export const PostImage = styled(motion.img)`
  width: 100%;
  height: auto;
  display: block;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.gap.md};
`;

export const PostContent = styled.div`
  padding: ${theme.spacing.gap.sm} 0;

  h3 {
    font-size: ${theme.typography.h3.fontSize};
    font-weight: ${theme.typography.h3.fontWeight};
    color: ${theme.colors.textPrimary};
    margin: 0;
  }
`;

/* ==================== Removed components (no longer used) ==================== */

export const SectionButton = styled.button`
  padding: 0.625rem 1.5rem;
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  color: ${theme.colors.primary};
  background: transparent;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accent};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    text-align: center;
  }
`;

export const MainGrid = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.surfaceAlt};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${theme.spacing.gridGap.desktop};
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    padding: ${theme.spacing.sectionPadding.tablet};
    gap: ${theme.spacing.gridGap.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    padding: ${theme.spacing.sectionPadding.mobile};
    gap: ${theme.spacing.gridGap.mobile};
  }
`;

export const LeftColumn = styled(motion.div)``;
export const CenterColumn = styled(motion.div)`
  padding: ${theme.spacing.gap.lg};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.gap.md};
  }
`;
export const RightColumn = styled(motion.div)``;
