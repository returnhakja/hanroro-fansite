'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";
import EventCalendar from "@/components/EventCalendar";
import { fadeInScale, staggerContainer, staggerItem } from "@/utils/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Container,
  HeroSection,
  HeroBackground,
  HeroOverlay,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  CTAButton,
  ScrollIndicator,
  VideoSection,
  SectionTitle,
  MainGrid,
  LeftColumn,
  CenterColumn,
  RightColumn,
  ColumnTitle,
  EventList,
  PostCard,
  SpinnerWrapper,
  StyledSlider,
  VideoSlide,
  VideoWrapper,
  Thumbnail,
  StyledIframe,
  TabWrapper,
  TabButton,
  SetListItem,
  SetlistCard,
  AlbumThumb,
  PostImage,
  PostContent,
} from "./Home.styles";

interface Image {
  _id: string;
  title: string;
  filename: string;
  imageUrl: string;
  createdAt: string;
  __v: number;
}

const Home = () => {
  const setListRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(0);

  const [image, setImage] = useState<Image | null>(null);
  const [concert, setConcert] = useState<any>(null);
  const [setlists, setSetlists] = useState<any[]>([]);
  const [setlistLoading, setSetlistLoading] = useState(true);

  useLayoutEffect(() => {
    if (setListRef.current) {
      setListRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/youtube/videos');
        const data = await res.json();
        const videoData = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
        }));
        setVideos(videoData);
        setCurrentTitle(videoData[0]?.title || "");
      } catch (err) {
        console.error("유튜브 영상 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const loadRandomImage = async () => {
      try {
        const res = await fetch('/api/images/random');
        const data = await res.json();
        setImage(data);
      } catch (err) {
        console.error("랜덤 이미지 불러오기 실패:", err);
      }
    };
    loadRandomImage();
  }, []);

  useEffect(() => {
    const loadSetlists = async () => {
      try {
        const res = await fetch('/api/setlists/active');
        const data = await res.json();
        setConcert(data.concert);
        setSetlists(data.setlists);
      } catch (err) {
        console.error("셋리스트 불러오기 실패:", err);
      } finally {
        setSetlistLoading(false);
      }
    };
    loadSetlists();
  }, []);

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: (index: number) => {
        setActiveIndex(index);
        setCurrentTitle(videos[index]?.title || "");
      },
    }),
    [videos]
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
    [videos, activeIndex]
  );

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.7,
      behavior: 'smooth'
    });
  };

  return (
    <Container>
      {/* Hero Section - 새로운 디자인 */}
      <HeroSection>
        <HeroBackground
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <HeroOverlay />

        <HeroContent
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <HeroTitle
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            HANRORO
          </HeroTitle>

          <HeroSubtitle
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {currentTitle || "한로로의 최신 소식을 만나보세요"}
          </HeroSubtitle>

          <CTAButton
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={scrollToContent}
          >
            최신 영상 보기
          </CTAButton>
        </HeroContent>

        <ScrollIndicator
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={shouldReduceMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={scrollToContent}
        />
      </HeroSection>

      {/* Video Section */}
      <VideoSection>
        <SectionTitle>Latest Videos</SectionTitle>
        {loading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : (
          <StyledSlider {...settings}>{memoizedSlides}</StyledSlider>
        )}
      </VideoSection>

      {/* Main Grid - Setlist + Calendar + Gallery */}
      <MainGrid>
        <LeftColumn
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <ColumnTitle>
            {concert?.title || '셋리스트'}
          </ColumnTitle>

          {setlistLoading ? (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          ) : setlists.length > 0 ? (
            <>
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

              <SetlistCard ref={setListRef}>
                {setlists[activeTab]?.songs
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((song: any, index: number) => (
                    <SetListItem key={index}>
                      <span>
                        {song.albumImageUrl && (
                          <AlbumThumb src={song.albumImageUrl} alt={song.title} />
                        )}
                        {song.title}
                      </span>
                    </SetListItem>
                  ))}
              </SetlistCard>
            </>
          ) : (
            <SetlistCard>
              <SetListItem>
                <span>등록된 셋리스트가 없습니다</span>
              </SetListItem>
            </SetlistCard>
          )}
        </LeftColumn>

        <CenterColumn
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ColumnTitle>일정</ColumnTitle>
          <EventList>
            <EventCalendar />
          </EventList>
        </CenterColumn>

        <RightColumn
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <PostCard
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ColumnTitle>갤러리 사진</ColumnTitle>
            {image && (
              <>
                <PostImage
                  src={image.imageUrl}
                  alt={image.title}
                  initial={shouldReduceMotion ? {} : { opacity: 0, scale: 1.05 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <PostContent>
                  <h3>{image.title}</h3>
                </PostContent>
              </>
            )}
          </PostCard>
        </RightColumn>
      </MainGrid>
    </Container>
  );
};

export default Home;
