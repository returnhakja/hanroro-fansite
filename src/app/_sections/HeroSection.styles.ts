import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

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

export const AwardBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
  padding: 0.5rem 1.25rem 0.5rem 0.5rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid ${theme.colors.accent};
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.accentLight};
  font-family: ${theme.typography.fontBody};
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  backdrop-filter: blur(10px);
  box-shadow:
    0 0 24px rgba(201, 169, 110, 0.25),
    inset 0 0 16px rgba(201, 169, 110, 0.06);
  line-height: 1.6;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.6875rem;
    padding: 0.4rem 1rem 0.4rem 0.4rem;
    gap: 0.5rem;
    white-space: normal;
  }
`;

export const AwardBadgeImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${theme.colors.accent};
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 48px;
    height: 48px;
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
