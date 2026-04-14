"use client";

import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useImages } from "@/hooks/queries/useGallery";
import {
  SectionOverline,
  SectionTitle,
  SectionLink,
  SectionHeader,
  SectionHeaderLeft,
} from "./common.styles";
import {
  GalleryPreviewSectionWrapper,
  GalleryGrid,
  GalleryItem,
  VideoPlayIcon,
  GalleryItemOverlay,
} from "./GalleryPreviewSection.styles";

export default function GalleryPreviewSection() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { data: imageData } = useImages();
  const images = imageData?.slice(0, 6) ?? [];

  return (
    <GalleryPreviewSectionWrapper>
      <SectionHeader>
        <SectionHeaderLeft>
          <SectionOverline>GALLERY</SectionOverline>
          <SectionTitle>갤러리</SectionTitle>
        </SectionHeaderLeft>
        <SectionLink onClick={() => router.push("/gallery")}>
          전체 보기
        </SectionLink>
      </SectionHeader>
      <GalleryGrid>
        {images.map((image, index) => (
          <GalleryItem
            key={image._id}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() =>
              router.push(
                `/gallery?tab=${image.type === "video" ? "video" : "image"}`,
              )
            }
          >
            {image.type === "video" ? (
              <>
                <video src={image.imageUrl} preload="metadata" muted />
                <VideoPlayIcon>▶</VideoPlayIcon>
              </>
            ) : (
              <img src={image.imageUrl} alt={image.title} />
            )}
            <GalleryItemOverlay>
              <h4>{image.title}</h4>
            </GalleryItemOverlay>
          </GalleryItem>
        ))}
      </GalleryGrid>
    </GalleryPreviewSectionWrapper>
  );
}
