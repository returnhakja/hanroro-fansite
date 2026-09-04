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

export const AlbumCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.gap.sm};
  border-radius: ${theme.borderRadius.md};
  color: inherit;

  img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: ${theme.borderRadius.md};
    box-shadow: ${theme.shadows.sm};
    transition: all ${theme.transitions.normal};
  }

  &:hover img {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

export const AlbumBadge = styled.span`
  align-self: flex-start;
  font-size: ${theme.typography.small.fontSize};
  font-weight: 600;
  color: ${theme.colors.accent};
`;

export const AlbumCardTitle = styled.h4`
  margin: 0;
  font-size: ${theme.typography.body.fontSize};
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const AlbumCardMeta = styled.span`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textSecondary};
`;
