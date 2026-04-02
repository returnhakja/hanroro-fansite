"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "@/components/Spinner";
import AwardModal from "@/components/ui/AwardModal";

import {
  Container,
  HeroSection,
  HeroBackground,
  HeroOverlay,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  AwardBadge,
  AwardBadgeImage,
  ScrollIndicator,
  GalleryPreviewSection,
  SectionOverline,
  SectionTitle,
  SectionHeader,
  SectionHeaderLeft,
  SectionLink,
  GalleryGrid,
  GalleryItem,
  GalleryItemOverlay,
  VideoPlayIcon,
  BoardPreviewSection,
  BoardList,
  BoardItem,
  BoardItemTitle,
  BoardItemMeta,
  TwoColumnItem,
  TabWrapper,
  TabButton,
  SetlistCard,
  SetListItem,
  SongOrder,
  AlbumThumb,
  VideoSection,
  SpinnerWrapper,
  StyledSlider,
  VideoSlide,
  VideoWrapper,
  Thumbnail,
  StyledIframe,
  NewReleaseSection,
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
} from "./Home.styles";
import { useReducedMotion } from "framer-motion";
import { useYoutubeVideos } from "@/hooks/queries/useYoutube";
import { useImages } from "@/hooks/queries/useGallery";
import { useBoardList } from "@/hooks/queries/useBoard";
import { useActiveSetlist } from "@/hooks/queries/useConcerts";
import { useUpcomingEvents } from "@/hooks/queries/useEvents";

const RELEASE_DATE = new Date("2026-04-02");

const Home = () => {
  const router = useRouter();
  const setListRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [dday, setDday] = useState<string>("");

  useLayoutEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const release = new Date(RELEASE_DATE);
    release.setHours(0, 0, 0, 0);
    const diff = Math.ceil(
      (release.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff > 0) setDday(`D-${diff}`);
    else if (diff === 0) setDday("D-DAY");
    else setDday("OUT NOW");
  }, []);

  const { data: videoData, isLoading: loading } = useYoutubeVideos();
  const { data: imageData } = useImages();
  const { data: postData } = useBoardList();
  const { data: activeSetlistData, isLoading: setlistLoading } =
    useActiveSetlist();
  const { data: eventData } = useUpcomingEvents();

  const videos = videoData ?? [];
  const images = imageData?.slice(0, 6) ?? [];
  const posts = postData?.slice(0, 5) ?? [];
  const concert = activeSetlistData?.concert;
  const setlists = activeSetlistData?.setlists ?? [];
  const upcomingEvents = (eventData || [])
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 2);

  useLayoutEffect(() => {
    if (setListRef.current) {
      setListRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: (index: number) => {
        setActiveIndex(index);
      },
    }),
    [videos],
  );

  const memoizedSlides = useMemo(
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

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <HeroOverlay />

        <HeroContent
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <HeroTitle
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            HANRORO
          </HeroTitle>

          <HeroSubtitle
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Singer-Songwriter
          </HeroSubtitle>

          <AwardBadge
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            onClick={() => setIsAwardModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <AwardBadgeImage
              src="/assets/대중음악상.jpg"
              alt="2026 한국대중음악상"
            />
            🏆 &nbsp;2026 제23회 한국대중음악상 &nbsp;·&nbsp; 올해의 음악인
          </AwardBadge>
        </HeroContent>

        <ScrollIndicator
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={shouldReduceMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={scrollToContent}
        />
      </HeroSection>

      {/* New Release Section - 애증 */}
      <NewReleaseSection>
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
              <br />
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
            <TeaserLink
              href="https://youtu.be/Gofn_ULNd5Q?si=wQtnKuUHxb7ktUt_"
              target="_blank"
              rel="noopener noreferrer"
            >
              1111 뮤직비디오 보기
            </TeaserLink>
          </ReleaseInfo>
        </NewReleaseInner>
      </NewReleaseSection>

      {/* Board Preview Section - 최신 소식 */}
      <BoardPreviewSection>
        <SectionHeader>
          <SectionHeaderLeft>
            <SectionOverline>LATEST</SectionOverline>
            <SectionTitle>최신 소식</SectionTitle>
          </SectionHeaderLeft>
          <SectionLink onClick={() => router.push("/board")}>
            더 보기
          </SectionLink>
        </SectionHeader>
        <BoardList>
          {posts.map((post, index) => (
            <BoardItem
              key={post._id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => router.push(`/board/${post._id}`)}
            >
              <BoardItemTitle>{post.title}</BoardItemTitle>
              <BoardItemMeta>
                <span>{post.author}</span>
                <span>{formatDate(post.createdAt)}</span>
                <span>조회 {post.views}</span>
              </BoardItemMeta>
            </BoardItem>
          ))}
        </BoardList>
      </BoardPreviewSection>

      {/* Gallery Preview Section */}
      <GalleryPreviewSection>
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
      </GalleryPreviewSection>

      {/* Schedule Preview Section */}
      <BoardPreviewSection>
        <SectionHeader>
          <SectionHeaderLeft>
            <SectionOverline>SCHEDULE</SectionOverline>
            <SectionTitle>다가오는 일정</SectionTitle>
          </SectionHeaderLeft>
          <SectionLink onClick={() => router.push("/schedule")}>
            전체 보기
          </SectionLink>
        </SectionHeader>
        {upcomingEvents.length > 0 ? (
          <BoardList>
            {upcomingEvents.map((event, index) => (
              <BoardItem
                key={event._id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => router.push("/schedule")}
              >
                <BoardItemTitle>{event.title}</BoardItemTitle>
                <BoardItemMeta>
                  <span>{formatDate(event.date)}</span>
                  {event.place && <span>{event.place}</span>}
                  {event.time && <span>{event.time}</span>}
                </BoardItemMeta>
              </BoardItem>
            ))}
          </BoardList>
        ) : (
          <BoardList>
            <BoardItem
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <BoardItemTitle>등록된 일정이 없습니다</BoardItemTitle>
            </BoardItem>
          </BoardList>
        )}
      </BoardPreviewSection>

      {/* Setlist Preview Section */}
      <GalleryPreviewSection>
        <SectionHeader>
          <SectionHeaderLeft>
            <SectionOverline>SETLIST</SectionOverline>
            <SectionTitle>
              {concert?.title || "최근 공연 셋리스트"}
            </SectionTitle>
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
          <BoardList>
            <BoardItem
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <BoardItemTitle>등록된 셋리스트가 없습니다</BoardItemTitle>
            </BoardItem>
          </BoardList>
        )}
      </GalleryPreviewSection>

      {/* Video Section */}
      <VideoSection>
        <SectionOverline style={{ textAlign: "center" }}>
          VIDEOS
        </SectionOverline>
        <SectionTitle style={{ textAlign: "center" }}>
          Latest Videos
        </SectionTitle>
        {loading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : (
          <StyledSlider {...settings}>{memoizedSlides}</StyledSlider>
        )}
      </VideoSection>

      <AwardModal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
      />
    </Container>
  );
};

export default Home;
