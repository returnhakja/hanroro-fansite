"use client";

import { Container } from "./_sections/common.styles";
import HomeHeroQuick from "./_sections/HomeHeroQuick";
import AlbumHighlightSection from "./_sections/AlbumHighlightSection";
import BoardPreviewSection from "./_sections/BoardPreviewSection";
import GalleryPreviewSection from "./_sections/GalleryPreviewSection";
import SchedulePreviewSection from "./_sections/SchedulePreviewSection";
import SetlistPreviewSection from "./_sections/SetlistPreviewSection";

export default function Home() {
  return (
    <Container>
      <HomeHeroQuick />
      <AlbumHighlightSection />
      {/* <NewReleaseSection /> */}
      <BoardPreviewSection />
      <GalleryPreviewSection />
      <SchedulePreviewSection />
      <SetlistPreviewSection />
    </Container>
  );
}
