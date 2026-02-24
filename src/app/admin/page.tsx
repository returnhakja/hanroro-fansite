'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Stats {
  concerts: number;
  events: number;
  posts: number;
  images: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    concerts: 0,
    events: 0,
    posts: 0,
    images: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('통계를 불러올 수 없습니다');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('통계 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container>
      <Title>대시보드</Title>
      <Subtitle>HANRORO 팬사이트 관리자 페이지</Subtitle>

      <Grid>
        <StatCard>
          <StatIcon>🎤</StatIcon>
          <StatNumber>{loading ? '-' : stats.concerts}</StatNumber>
          <StatLabel>공연</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>📅</StatIcon>
          <StatNumber>{loading ? '-' : stats.events}</StatNumber>
          <StatLabel>일정</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>📝</StatIcon>
          <StatNumber>{loading ? '-' : stats.posts}</StatNumber>
          <StatLabel>게시글</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>🖼️</StatIcon>
          <StatNumber>{loading ? '-' : stats.images}</StatNumber>
          <StatLabel>이미지</StatLabel>
        </StatCard>
      </Grid>

      <WelcomeBox>
        <WelcomeTitle>환영합니다!</WelcomeTitle>
        <WelcomeText>
          관리자 페이지에 오신 것을 환영합니다.
          <br />
          왼쪽 메뉴를 통해 공연, 일정, 게시글을 관리할 수 있습니다.
        </WelcomeText>
        <InfoBox>
          <InfoTitle>📌 다음 단계</InfoTitle>
          <InfoList>
            <li>공연 관리에서 새로운 공연을 추가하세요</li>
            <li>셋리스트를 작성하여 팬들과 공유하세요</li>
            <li>일정 관리에서 다가오는 이벤트를 등록하세요</li>
            <li>게시글 관리에서 부적절한 게시글을 삭제하세요</li>
          </InfoList>
        </InfoBox>
      </WelcomeBox>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #8B7355;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #7f8c8d;
  font-weight: 500;
`;

const WelcomeBox = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const WelcomeTitle = styled.h2`
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const WelcomeText = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.05rem;
`;

const InfoBox = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #8B7355;
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0.5rem 0;
    color: #7f8c8d;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #8B7355;
      font-weight: bold;
    }
  }
`;
