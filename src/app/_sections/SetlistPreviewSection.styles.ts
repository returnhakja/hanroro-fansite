import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

export const SetlistPreviewSectionWrapper = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.surface};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
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
