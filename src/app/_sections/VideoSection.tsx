"use client";

import { useMemo, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "@/components/ui/Spinner";
import { useYoutubeVideos } from "@/hooks/queries/useYoutube";
import { SectionOverline, SectionTitle, SpinnerWrapper } from "./common.styles";
import {
  VideoSectionWrapper,
  StyledSlider,
  VideoSlide,
  VideoWrapper,
  Thumbnail,
  StyledIframe,
} from "./VideoSection.styles";

export default function VideoSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { data: videoData, isLoading: loading } = useYoutubeVideos();
  const videos = videoData ?? [];

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: (index: number) => setActiveIndex(index),
    }),
    [videos],
  );

  const slides = useMemo(
    () =>
      videos.map((video, index) => (
        <VideoSlide key={video.id}>
          <VideoWrapper>
            <Thumbnail
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              visible={activeIndex !== index}
              onClick={() => setActiveIndex(index)}
            />
            <StyledIframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              visible={activeIndex === index}
            />
          </VideoWrapper>
        </VideoSlide>
      )),
    [videos, activeIndex],
  );

  return (
    <VideoSectionWrapper>
      <SectionOverline style={{ textAlign: "center" }}>VIDEOS</SectionOverline>
      <SectionTitle style={{ textAlign: "center" }}>Latest Videos</SectionTitle>
      {loading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <StyledSlider {...settings}>{slides}</StyledSlider>
      )}
    </VideoSectionWrapper>
  );
}
