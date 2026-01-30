'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "@/components/Spinner";
import { SetLists } from "@/data/setList";
import EventCalendar from "@/components/EventCalendar";
import {
  Container,
  HeroSection,
  Banner,
  Quote,
  MainGrid,
  LeftColumn,
  CenterColumn,
  RightColumn,
  SectionTitle,
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

  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"day1" | "day2">("day1");

  const [image, setImage] = useState<Image | null>(null);

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

  return (
    <Container>
      <HeroSection>
        <Banner>
          <Quote>"{currentTitle}"</Quote>
          {loading ? (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          ) : (
            <StyledSlider {...settings}>{memoizedSlides}</StyledSlider>
          )}
        </Banner>
      </HeroSection>

      <MainGrid>
        <LeftColumn>
          <SectionTitle>
            4TH 단독콘서트 {`${`<자몽살구클럽>`}`} 셋리스트
          </SectionTitle>
          <TabWrapper>
            <TabButton
              $active={activeTab === "day1"}
              onClick={() => setActiveTab("day1")}
            >
              Day 1
            </TabButton>
            <TabButton
              $active={activeTab === "day2"}
              onClick={() => setActiveTab("day2")}
            >
              Day 2
            </TabButton>
          </TabWrapper>

          <SetlistCard ref={setListRef}>
            {SetLists[activeTab].map((song, index) => (
              <SetListItem key={index}>
                <span>
                  {song.albumImage && (
                    <AlbumThumb src={song.albumImage} alt={song.title} />
                  )}
                  {song.title}
                </span>
              </SetListItem>
            ))}
          </SetlistCard>
        </LeftColumn>

        <CenterColumn>
          <SectionTitle>일정</SectionTitle>
          <EventList>
            <EventCalendar />
          </EventList>
        </CenterColumn>

        <RightColumn>
          <PostCard>
            <SectionTitle>갤러리 사진</SectionTitle>
            {image && (
              <>
                <PostImage src={image.imageUrl} alt={image.title} />
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
