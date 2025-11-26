// src/pages/Home.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import Slider from "react-slick";
import Spinner from "../components/Spinner";
import { SetLists } from "../data/setList";
import EventCalendar from "../components/EventCalendar";
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.REACT_APP_CHANNEL_ID;

const Home = () => {
  const setListRef = useRef<HTMLDivElement>(null);

  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"day1" | "day2">("day1");

  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=5`;

  useEffect(() => {
    if (setListRef.current) {
      setListRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(url);
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
    videos.forEach((video) => {
      const img = new Image();
      img.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
    });
  }, [videos]);

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
        {/* <h1>한로로 YouTube 최신 영상</h1> */}
        <Banner>
          <Quote>"{currentTitle}”</Quote>
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
              active={activeTab === "day1"}
              onClick={() => setActiveTab("day1")}
            >
              Day 1
            </TabButton>
            <TabButton
              active={activeTab === "day2"}
              onClick={() => setActiveTab("day2")}
            >
              Day 2
            </TabButton>
          </TabWrapper>

          <SetlistCard ref={setListRef}>
            {SetLists[activeTab].map((song, index) => (
              <SetlistItem key={index}>
                <span>
                  {song.albumImage && (
                    <AlbumThumb src={song.albumImage} alt={song.title} />
                  )}
                  {song.title}
                </span>
              </SetlistItem>
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
          <SectionTitle>갤러리 사진</SectionTitle>
          <PostCard>
            <h3>Post 제목</h3>
            <p>닉네임 · 2025.11.17</p>
            <p>Lorem ipsum doler</p>
          </PostCard>
        </RightColumn>
      </MainGrid>
    </Container>
  );
};

export default Home;
const Container = styled.div`
  padding: 2rem;
  font-family: "Noto Sans KR", sans-serif;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 2rem;
`;

const Banner = styled.div`
  background-color: #f8f5f2;
  padding: 2rem;
  border-radius: 12px;
`;

const Quote = styled.p`
  font-size: 1.5rem;
  color: #666;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div``;
const CenterColumn = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f5f2;
  border-radius: 12px;

  max-width: 100%;
  overflow-x: auto;

  .rbc-calendar {
    min-width: 700px;
  }
`;
const RightColumn = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const EventList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  li {
    margin-bottom: 0.5rem;
  }
`;

const PostCard = styled.div`
  background-color: #f2f2f2;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const StyledSlider = styled(Slider)`
  .slick-slide {
    display: flex !important;
    justify-content: center;
  }

  .slick-prev,
  .slick-next {
    background: none !important;
    width: auto;
    height: auto;
  }

  .slick-prev:before,
  .slick-next:before {
    color: black;
    font-size: 40px;
  }
`;

const VideoSlide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 460px;
  position: relative;
`;

const VideoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 700px;
  height: 460px;
  border-radius: 8px;
  overflow: hidden;
`;
const Thumbnail = styled.img<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

const StyledIframe = styled.iframe<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? "#333" : "#ccc")};
  background: none;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  cursor: pointer;
`;

const SetlistItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
  &::before {
    /* content: "🎵 "; */
    margin-right: 0.3rem;
  }
`;

const SetlistCard = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
`;

const AlbumThumb = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-right: 0.5rem;
  object-fit: cover;
`;
