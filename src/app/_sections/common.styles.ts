import styled from "styled-components";
import { theme } from "@/styles/theme";

export const Container = styled.div`
  font-family: ${theme.typography.fontBody};
  background-color: ${theme.colors.background};
  margin-top: -70px;
`;

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

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.gap.xl};
  min-height: 400px;
`;
