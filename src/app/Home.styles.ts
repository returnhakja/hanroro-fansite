import styled from "styled-components";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

export const Container = styled.div`
  font-family: "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background-color: ${theme.colors.background};
`;

/* ==================== Hero Section ==================== */

export const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    height: 60vh;
    min-height: 450px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 50vh;
    min-height: 400px;
  }
`;

export const HeroBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${theme.colors.gradientHero};
  z-index: 0;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${theme.colors.gradientOverlay};
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
  font-size: ${theme.typography.hero.fontSize};
  font-weight: ${theme.typography.hero.fontWeight};
  line-height: ${theme.typography.hero.lineHeight};
  letter-spacing: ${theme.typography.hero.letterSpacing};
  margin-bottom: ${theme.spacing.gap.md};
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled(motion.p)`
  font-size: ${theme.typography.h3.fontSize};
  font-weight: ${theme.typography.h3.fontWeight};
  line-height: ${theme.typography.h3.lineHeight};
  margin-bottom: ${theme.spacing.gap.xl};
  opacity: 0.95;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.125rem;
    margin-bottom: ${theme.spacing.gap.lg};
  }
`;

export const CTAButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  font-size: ${theme.typography.body.fontSize};
  font-weight: 600;
  color: ${theme.colors.textLight};
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all ${theme.transitions.normal};

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.875rem 2rem;
    font-size: 0.9375rem;
  }
`;

export const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 30px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: ${theme.borderRadius.xl};
  display: flex;
  justify-content: center;
  padding-top: 8px;
  cursor: pointer;

  &::before {
    content: '';
    width: 6px;
    height: 10px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 3px;
    animation: scroll 2s infinite;
  }

  @keyframes scroll {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(15px);
      opacity: 0;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    bottom: 1rem;
  }
`;

/* ==================== Video Section ==================== */

export const VideoSection = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.surface};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  line-height: ${theme.typography.h1.lineHeight};
  color: ${theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${theme.spacing.gap.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.75rem;
    margin-bottom: ${theme.spacing.gap.lg};
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
    color: ${theme.colors.primary};
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
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  margin: 0 auto;
  box-shadow: ${theme.shadows.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    max-width: 700px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 100%;
    min-width: 320px;
    border-radius: ${theme.borderRadius.md};
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

/* ==================== Main Grid (Setlist + Calendar + Gallery) ==================== */

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

export const ColumnTitle = styled.h2`
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
  gap: ${theme.spacing.gap.sm};
  margin-bottom: ${theme.spacing.gap.lg};
  border-bottom: 2px solid ${theme.colors.surfaceAlt};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.gap.sm} ${theme.spacing.gap.md};
  border: none;
  border-bottom: 3px solid ${(props) => (props.$active ? theme.colors.primary : "transparent")};
  background: none;
  font-weight: ${(props) => (props.$active ? 700 : 400)};
  font-size: ${theme.typography.body.fontSize};
  color: ${(props) => (props.$active ? theme.colors.primary : theme.colors.textSecondary)};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  position: relative;
  margin-bottom: -2px;

  &:hover {
    color: ${theme.colors.primary};
    transform: translateY(-2px);
  }
`;

export const SetlistCard = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: ${theme.spacing.gap.md};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.primaryLight};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: ${theme.colors.surfaceAlt};
  }
`;

export const SetListItem = styled(motion.li)`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.gap.sm};
  margin-bottom: ${theme.spacing.gap.xs};
  font-size: ${theme.typography.body.fontSize};
  line-height: ${theme.typography.body.lineHeight};
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.surfaceAlt};
    transform: translateX(4px);
  }
`;

export const AlbumThumb = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.sm};
  margin-right: ${theme.spacing.gap.sm};
  object-fit: cover;
  box-shadow: ${theme.shadows.sm};
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

/* ==================== Gallery ==================== */

export const PostCard = styled(motion.div)`
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.gap.lg};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  transition: all ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-4px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.gap.md};
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
