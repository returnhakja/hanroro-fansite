import styled from "styled-components";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

export const VideoSectionWrapper = styled.section`
  padding: ${theme.spacing.sectionPadding.desktop};
  background-color: ${theme.colors.background};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sectionPadding.tablet};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionPadding.mobile};
  }
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
