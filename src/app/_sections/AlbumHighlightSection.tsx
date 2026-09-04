"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { getHomeAlbumHighlights } from "@/data/artistData";
import type { Album } from "@/data/artistData";
import {
  SectionOverline,
  SectionTitle,
  SectionHeader,
  SectionHeaderLeft,
} from "./common.styles";
import {
  AlbumHighlightSectionWrapper,
  AlbumGrid,
  AlbumCard,
  AlbumBadge,
  AlbumCardTitle,
  AlbumCardMeta,
} from "./AlbumHighlightSection.styles";

export default function AlbumHighlightSection() {
  const shouldReduceMotion = useReducedMotion();
  // 최신작은 고정, 나머지는 방문마다 랜덤이라 하이드레이션 불일치를 피하려고
  // 마운트 이후에만 계산한다.
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    setAlbums(getHomeAlbumHighlights(3));
  }, []);

  if (albums.length === 0) return null;

  return (
    <AlbumHighlightSectionWrapper>
      <SectionHeader>
        <SectionHeaderLeft>
          <SectionOverline>DISCOGRAPHY</SectionOverline>
          <SectionTitle>최근 발매</SectionTitle>
        </SectionHeaderLeft>
      </SectionHeader>
      <AlbumGrid>
        {albums.map((album, index) => (
          <AlbumCard
            key={album.id}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img src={album.coverUrl} alt={`${album.title} 앨범 커버`} />
            {index === 0 && <AlbumBadge>NEW</AlbumBadge>}
            <AlbumCardTitle>{album.title}</AlbumCardTitle>
            <AlbumCardMeta>
              {album.releaseDate.replace(/-/g, ".")}
            </AlbumCardMeta>
          </AlbumCard>
        ))}
      </AlbumGrid>
    </AlbumHighlightSectionWrapper>
  );
}
