/**
 * 게시판/일정 프리뷰 섹션 공통 스타일
 * BoardPreviewSection, SchedulePreviewSection에서 공유
 */
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

export const PreviewSection = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.background};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
`;

export const PreviewList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PreviewItem = styled(motion.div)`
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

export const PreviewItemTitle = styled.h3`
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

export const PreviewItemMeta = styled.div`
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
