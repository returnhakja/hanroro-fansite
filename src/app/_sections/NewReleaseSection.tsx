"use client";

import { useReducedMotion } from "framer-motion";
import { getLatestAlbum } from "@/data/artistData";
import { SectionOverline } from "./common.styles";
import {
  NewReleaseSection as NewReleaseSectionWrapper,
  NewReleaseInner,
  AlbumCoverWrap,
  ReleaseInfo,
  ReleaseTitle,
  ReleaseMeta,
  ReleaseDivider,
  ReleaseTrackList,
  ReleaseTrackItem,
  TrackNumber,
  TitleBadge,
  ReleaseDesc,
  TeaserLink,
} from "./NewReleaseSection.styles";

export default function NewReleaseSection() {
  const shouldReduceMotion = useReducedMotion();

  // 앨범을 새로 추가하면 이 섹션이 자동으로 최신작을 따라간다
  const album = getLatestAlbum();

  // 수록곡을 따로 두지 않는 싱글은 앨범 제목이 곧 곡 제목이다
  const isSingle = album.tracks.length === 0;
  const tracks = isSingle
    ? [{ title: album.title, duration: "" }]
    : album.tracks;

  const releaseType = album.tracks.length >= 3 ? "EP" : "Single";
  const releaseDate = album.releaseDate.replace(/-/g, ".");

  return (
    <NewReleaseSectionWrapper>
      <NewReleaseInner>
        <AlbumCoverWrap
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img src={album.coverUrl} alt={`${album.title} 앨범 커버`} />
        </AlbumCoverWrap>
        <ReleaseInfo
          initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <SectionOverline>NEW RELEASE</SectionOverline>
          <ReleaseTitle
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {album.title}
          </ReleaseTitle>
          <ReleaseMeta>
            {releaseDate} · {releaseType}
          </ReleaseMeta>
          <ReleaseDivider />
          <ReleaseTrackList>
            {tracks.map((track, idx) => (
              <ReleaseTrackItem key={track.title}>
                <TrackNumber>{String(idx + 1).padStart(2, "0")}</TrackNumber>
                <span>{track.title}</span>
                {/* 싱글은 그 곡 자체가 타이틀곡 */}
                {(isSingle || track.title === album.titleTrack) && (
                  <TitleBadge>TITLE</TitleBadge>
                )}
              </ReleaseTrackItem>
            ))}
          </ReleaseTrackList>
          {album.description && (
            <>
              <ReleaseDivider />
              <ReleaseDesc>{album.description}</ReleaseDesc>
            </>
          )}
          {album.videos?.map((video, idx) => (
            <span key={video.url}>
              {idx > 0 && <br />}
              <TeaserLink
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video.label}
              </TeaserLink>
            </span>
          ))}
        </ReleaseInfo>
      </NewReleaseInner>
    </NewReleaseSectionWrapper>
  );
}
