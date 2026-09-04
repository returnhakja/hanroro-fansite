import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

export const AlbumHighlightSectionWrapper = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.background};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
`;

export const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.gap.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

/** 실제 앨범 커버 사진이 카드의 주인공이 되도록, 텍스트는 사진 위에 얹는다 */
export const AlbumCard = styled(motion.div)`
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
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

export const AlbumCardOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2px;
  padding: ${theme.spacing.gap.md};
  background: linear-gradient(
    to top,
    rgba(20, 16, 12, 0.85) 0%,
    rgba(20, 16, 12, 0.15) 55%,
    transparent 75%
  );
  color: ${theme.colors.textLight};
`;

export const AlbumBadge = styled.span`
  align-self: flex-start;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${theme.colors.accent};
  color: #fff;
  margin-bottom: ${theme.spacing.gap.xs};
`;

export const AlbumCardTitle = styled.h4`
  margin: 0;
  font-size: ${theme.typography.body.fontSize};
  font-weight: 700;
`;

export const AlbumCardMeta = styled.span`
  font-size: ${theme.typography.small.fontSize};
  opacity: 0.85;
`;
