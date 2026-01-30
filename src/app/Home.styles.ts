import styled from "styled-components";
import Slider from "react-slick";

export const Container = styled.div`
  padding: 2rem;
  font-family: "Noto Sans KR", sans-serif;
`;

export const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Banner = styled.div`
  background-color: #f8f5f2;
  padding: 2rem;
  border-radius: 12px;
`;

export const Quote = styled.p`
  font-size: 1.5rem;
  color: #666;
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div``;
export const CenterColumn = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f5f2;
  border-radius: 12px;

  max-width: 100%;
  overflow-x: auto;

  .rbc-calendar {
    min-width: 700px;
  }
`;
export const RightColumn = styled.div``;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const EventList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  li {
    margin-bottom: 0.5rem;
  }
`;

export const PostCard = styled.div`
  background-color: #f2f2f2;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
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
    color: black;
    font-size: 40px;
  }
`;

export const VideoSlide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto;

  @media (max-width: 1024px) {
    max-width: 700px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    min-width: 320px;
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
  border-radius: 8px;
  cursor: pointer;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease;
  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
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

export const TabWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-bottom: 2px solid ${(props) => (props.$active ? "#333" : "#ccc")};
  background: none;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  cursor: pointer;
`;

export const SetListItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
  &::before {
    /* content: "🎵 "; */
    margin-right: 0.3rem;
  }
`;

export const SetlistCard = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
`;

export const AlbumThumb = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-right: 0.5rem;
  object-fit: cover;
`;

export const PostImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const PostContent = styled.div`
  padding: 0.8rem 1rem;
`;
