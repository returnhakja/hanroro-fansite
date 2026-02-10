'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "@/components/Spinner";
import EventCalendar from "@/components/EventCalendar";

import {
  Container,
  HeroSection,
  HeroBackground,
  HeroOverlay,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
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
  BoardPreviewSection,
  BoardList,
  BoardItem,
  BoardItemTitle,
  BoardItemMeta,
  TwoColumnGrid,
  TwoColumnItem,
  ColumnTitle,
  TabWrapper,
  TabButton,
  SetlistCard,
  SetListItem,
  SongOrder,
  AlbumThumb,
  EventList,
  VideoSection,
  SpinnerWrapper,
  StyledSlider,
  VideoSlide,
  VideoWrapper,
  Thumbnail,
  StyledIframe,
} from "./Home.styles";
import { useReducedMotion } from "framer-motion";

interface Image {
  _id: string;
  title: string;
  filename: string;
  imageUrl: string;
  createdAt: string;
  __v: number;
}

interface BoardPost {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
}

const Home = () => {
  const router = useRouter();
  const setListRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(0);

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
      } catch (err) {
        console.error("유튜브 영상 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch('/api/images');
        const data = await res.json();
        setImages(data.slice(0, 6));
      } catch (err) {
        console.error("이미지 불러오기 실패:", err);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch('/api/board');
        const data = await res.json();
        setPosts(data.slice(0, 5));
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };
    loadPosts();
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
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
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
        </HeroContent>

        <ScrollIndicator
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={shouldReduceMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={scrollToContent}
        />
      </HeroSection>

      {/* Board Preview Section - 최신 소식 */}
      <BoardPreviewSection>
        <SectionHeader>
          <SectionHeaderLeft>
            <SectionOverline>LATEST</SectionOverline>
            <SectionTitle>최신 소식</SectionTitle>
          </SectionHeaderLeft>
          <SectionLink onClick={() => router.push('/board')}>
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
          <SectionLink onClick={() => router.push('/gallery')}>
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
              onClick={() => router.push('/gallery')}
            >
              <img src={image.imageUrl} alt={image.title} />
              <GalleryItemOverlay>
                <h4>{image.title}</h4>
              </GalleryItemOverlay>
            </GalleryItem>
          ))}
        </GalleryGrid>
      </GalleryPreviewSection>

      {/* Two Column Grid - Calendar + Setlist */}
      <TwoColumnGrid>
        <TwoColumnItem
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionOverline>SCHEDULE</SectionOverline>
          <ColumnTitle>일정</ColumnTitle>
          <EventList>
            <EventCalendar />
          </EventList>
        </TwoColumnItem>

        <TwoColumnItem
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionOverline>SETLIST</SectionOverline>
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
                      <SongOrder>{String(song.order).padStart(2, '0')}</SongOrder>
                      {song.albumImageUrl && (
                        <AlbumThumb src={song.albumImageUrl} alt={song.title} />
                      )}
                      <span>{song.title}</span>
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
        </TwoColumnItem>
      </TwoColumnGrid>

      {/* Video Section */}
      <VideoSection>
        <SectionOverline style={{ textAlign: 'center' }}>VIDEOS</SectionOverline>
        <SectionTitle style={{ textAlign: 'center' }}>Latest Videos</SectionTitle>
        {loading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : (
          <StyledSlider {...settings}>{memoizedSlides}</StyledSlider>
        )}
      </VideoSection>
    </Container>
  );
};

export default Home;
