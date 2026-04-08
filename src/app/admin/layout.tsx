'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 페이지는 체크 안 함
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    // 토큰 확인
    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    // 토큰 유효성은 일단 localStorage 존재 여부만 체크
    // (추후 verify API 추가 시 검증 가능)
    setIsAuthenticated(true);
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  // 로그인 페이지는 레이아웃 적용 안 함
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return <LoadingScreen>로딩 중...</LoadingScreen>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <Sidebar>
        <Logo>HANRORO Admin</Logo>
        <Nav>
          <NavItem href="/admin" $active={pathname === '/admin'}>
            📊 대시보드
          </NavItem>
          <NavItem
            href="/admin/concerts"
            $active={pathname.startsWith('/admin/concerts')}
          >
            🎤 공연 관리
          </NavItem>
          <NavItem
            href="/admin/events"
            $active={pathname.startsWith('/admin/events')}
          >
            📅 일정 관리
          </NavItem>
          <NavItem
            href="/admin/board"
            $active={pathname.startsWith('/admin/board')}
          >
            📝 게시글 관리
          </NavItem>
          <NavItem
            href="/admin/fanchants"
            $active={pathname.startsWith('/admin/fanchants')}
          >
            🎶 응원법 관리
          </NavItem>
        </Nav>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </Sidebar>
      <Main>{children}</Main>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 260px;
  background: #2c3e50;
  color: white;
  padding: 2rem 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  padding: 0 1.5rem;
  margin-bottom: 2.5rem;
  font-weight: 700;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  padding: 0.875rem 1rem;
  color: ${(props) => (props.$active ? '#fff' : '#bdc3c7')};
  background: ${(props) => (props.$active ? '#34495e' : 'transparent')};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: ${(props) => (props.$active ? 600 : 400)};

  &:hover {
    background: #34495e;
    color: #fff;
  }
`;

const LogoutButton = styled.button`
  margin: 2rem 1.25rem 0;
  padding: 0.875rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #c0392b;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  background: #ecf0f1;
  min-height: 100vh;
`;

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.25rem;
  color: #7f8c8d;
`;
