"use client";

import { Container } from "./_sections/common.styles";
import HeroSection from "./_sections/HeroSection";
import NewReleaseSection from "./_sections/NewReleaseSection";
import BoardPreviewSection from "./_sections/BoardPreviewSection";
import GalleryPreviewSection from "./_sections/GalleryPreviewSection";
import SchedulePreviewSection from "./_sections/SchedulePreviewSection";
import SetlistPreviewSection from "./_sections/SetlistPreviewSection";
import VideoSection from "./_sections/VideoSection";

export default function Home() {
  return (
    <Container>
      <HeroSection />
      <NewReleaseSection />
      <BoardPreviewSection />
      <GalleryPreviewSection />
      <SchedulePreviewSection />
      <SetlistPreviewSection />
      <VideoSection />
    </Container>
  );
}
