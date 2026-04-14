import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

export const GalleryPreviewSectionWrapper = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.surface};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
`;

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

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
`;

export const VideoPlayIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.2);
  pointer-events: none;
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
