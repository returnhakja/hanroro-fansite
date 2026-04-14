"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { useActiveSetlist } from "@/hooks/queries/useConcerts";
import {
  SectionOverline,
  SectionTitle,
  SectionLink,
  SectionHeader,
  SectionHeaderLeft,
  SpinnerWrapper,
} from "./common.styles";
import {
  SetlistPreviewSectionWrapper,
  TwoColumnItem,
  TabWrapper,
  TabButton,
  SetlistCard,
  SetListItem,
  SongOrder,
  AlbumThumb,
} from "./SetlistPreviewSection.styles";
import {
  PreviewList,
  PreviewItem,
  PreviewItemTitle,
} from "./PreviewList.styles";

export default function SetlistPreviewSection() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const setListRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const { data: activeSetlistData, isLoading: setlistLoading } =
    useActiveSetlist();
  const concert = activeSetlistData?.concert;
  const setlists = activeSetlistData?.setlists ?? [];

  useLayoutEffect(() => {
    if (setListRef.current) {
      setListRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <SetlistPreviewSectionWrapper>
      <SectionHeader>
        <SectionHeaderLeft>
          <SectionOverline>SETLIST</SectionOverline>
          <SectionTitle>{concert?.title || "최근 공연 셋리스트"}</SectionTitle>
        </SectionHeaderLeft>
        <SectionLink onClick={() => router.push("/setlist")}>
          전체 보기
        </SectionLink>
      </SectionHeader>
      {setlistLoading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : setlists.length > 0 ? (
        <TwoColumnItem
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {setlists.length > 1 && (
            <TabWrapper>
              {setlists.map((setlist, index) => (
                <TabButton
                  key={setlist._id}
                  $active={activeTab === index}
                  onClick={() => setActiveTab(index)}
                >
                  Day {setlist.day}
                </TabButton>
              ))}
            </TabWrapper>
          )}
          <SetlistCard ref={setListRef}>
            {setlists[activeTab]?.songs
              .sort((a: any, b: any) => a.order - b.order)
              .slice(0, 10)
              .map((song: any, index: number) => (
                <SetListItem key={index}>
                  <SongOrder>{String(song.order).padStart(2, "0")}</SongOrder>
                  {song.albumImageUrl && (
                    <AlbumThumb src={song.albumImageUrl} alt={song.title} />
                  )}
                  <span>{song.title}</span>
                </SetListItem>
              ))}
          </SetlistCard>
        </TwoColumnItem>
      ) : (
        <PreviewList>
          <PreviewItem
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <PreviewItemTitle>등록된 셋리스트가 없습니다</PreviewItemTitle>
          </PreviewItem>
        </PreviewList>
      )}
    </SetlistPreviewSectionWrapper>
  );
}
