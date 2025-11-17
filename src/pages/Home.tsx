// src/pages/Home.tsx
import styled from "styled-components";

const Home = () => {
  return (
    <Container>
      <HeroSection>
        <h1>오늘의 한로로</h1>
        <Banner>
          <Quote>“봄이 오면 너를 다시 만나”</Quote>
        </Banner>
      </HeroSection>

      <MainGrid>
        <LeftColumn>
          <SectionTitle>New Album 신보 발매</SectionTitle>
          <AlbumCard>앨범 커버 이미지</AlbumCard>

          <SectionTitle>Streaming Guide 스트리밍 가이드</SectionTitle>
          <StreamingCard>스트리밍 가이드 배너</StreamingCard>
        </LeftColumn>

        <CenterColumn>
          <SectionTitle>Coming Sum 일정</SectionTitle>
          <EventList>
            <li>Tue · Concert</li>
            <li>Mor · Concert</li>
            <li>Jmcast · 방송</li>
          </EventList>
        </CenterColumn>

        <RightColumn>
          <SectionTitle>HOT Posts 인기 게시글</SectionTitle>
          <PostCard>
            <h3>Post 제목</h3>
            <p>닉네임 · 2025.11.17</p>
            <p>Lorem ipsum doler</p>
          </PostCard>
          {/* 추가 게시글 */}
        </RightColumn>
      </MainGrid>
    </Container>
  );
};

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
`;

const LeftColumn = styled.div``;
const CenterColumn = styled.div``;
const RightColumn = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const AlbumCard = styled.div`
  background-color: #eae6f2;
  height: 200px;
  border-radius: 8px;
`;

const StreamingCard = styled.div`
  background-color: #dceaf5;
  height: 150px;
  border-radius: 8px;
  margin-top: 1rem;
`;

const EventList = styled.ul`
  list-style: none;
  padding: 0;
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

export default Home;
