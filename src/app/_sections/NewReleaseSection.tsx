"use client";

import { useReducedMotion } from "framer-motion";
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

  return (
    <NewReleaseSectionWrapper>
      <NewReleaseInner>
        <AlbumCoverWrap
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img src="/assets/애증.png" alt="애증 앨범 커버" />
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
            애증
          </ReleaseTitle>
          <ReleaseMeta>2026.04.02 · Single</ReleaseMeta>
          <ReleaseDivider />
          <ReleaseTrackList>
            <ReleaseTrackItem>
              <TrackNumber>01</TrackNumber>
              <span>Game Over?</span>
              <TitleBadge>TITLE</TitleBadge>
            </ReleaseTrackItem>
            <ReleaseTrackItem>
              <TrackNumber>02</TrackNumber>
              <span>1111</span>
            </ReleaseTrackItem>
          </ReleaseTrackList>
          <ReleaseDivider />
          <ReleaseDesc>
            사랑은 죽 사랑일 수 없고, 미움은 죽 미움일 수 없습니다. 우리는
            미워하고 미움 받다 사랑하고 사랑 받는 공간. 이 헛구역질 나는 세계
            속에서 어떻게든 &apos;나&apos;를 알아가려 합니다.
          </ReleaseDesc>
          <TeaserLink
            href="https://youtu.be/qrzKsS-4lZo?si=k8GxDs_LQ90XeFMJ"
            target="_blank"
            rel="noopener noreferrer"
          >
            게임오버 ? 뮤직비디오 보기
          </TeaserLink>
          <br />
          <TeaserLink
            href="https://youtu.be/Gofn_ULNd5Q?si=wQtnKuUHxb7ktUt_"
            target="_blank"
            rel="noopener noreferrer"
          >
            1111 뮤직비디오 보기
          </TeaserLink>
        </ReleaseInfo>
      </NewReleaseInner>
    </NewReleaseSectionWrapper>
  );
}
