'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import { useScrollLock } from '@/hooks/useScrollLock';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 드로어 열림 시 배경 스크롤 잠금
  useScrollLock(drawerOpen);

  // 페이지 이동 시 모바일 드로어 닫기
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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

    // 서버에 실제 토큰 유효성 검증 (만료·위조 토큰 차단)
    let cancelled = false;
    setLoading(true);
    fetch('/api/admin/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          // 만료·위조 토큰 → 제거 후 로그인으로
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsAuthenticated(true); // 네트워크 오류 시 일단 진입 허용 (API가 다시 막음)
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
      <MobileBar>
        <MenuButton
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
        >
          ☰
        </MenuButton>
        <MobileLogo>HANRORO Admin</MobileLogo>
      </MobileBar>

      <Overlay $open={drawerOpen} onClick={() => setDrawerOpen(false)} />

      <Sidebar $open={drawerOpen}>
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
            href="/admin/inquiries"
            $active={pathname.startsWith('/admin/inquiries')}
          >
            ✉️ 비밀 문의
          </NavItem>
          <NavItem
            href="/admin/fanchants"
            $active={pathname.startsWith('/admin/fanchants')}
          >
            🎶 응원법 관리
          </NavItem>
          <NavItem
            href="/admin/chronicle"
            $active={pathname.startsWith('/admin/chronicle')}
          >
            📖 연대기 관리
          </NavItem>
        </Nav>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </Sidebar>
      <Main>{children}</Main>
    </Container>
  );
}

const MOBILE = '768px';

const Container = styled.div`
  display: flex;
  min-height: 100vh;

  @media (max-width: ${MOBILE}) {
    flex-direction: column;
  }
`;

const MobileBar = styled.div`
  display: none;

  @media (max-width: ${MOBILE}) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: sticky;
    top: 0;
    z-index: 30;
    height: 56px;
    padding: 0 1rem;
    background: #2c3e50;
    color: white;
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
`;

const MobileLogo = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
`;

const Overlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: ${MOBILE}) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${(props) => (props.$open ? 1 : 0)};
    visibility: ${(props) => (props.$open ? 'visible' : 'hidden')};
    transition: opacity 0.25s ease;
  }
`;

const Sidebar = styled.aside<{ $open: boolean }>`
  width: 260px;
  background: #2c3e50;
  color: white;
  padding: 2rem 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: ${MOBILE}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 50;
    min-height: 100vh;
    overflow-y: auto;
    transform: translateX(${(props) => (props.$open ? '0' : '-100%')});
    transition: transform 0.25s ease;
    box-shadow: ${(props) =>
      props.$open ? '2px 0 12px rgba(0, 0, 0, 0.3)' : 'none'};
  }
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

  @media (max-width: ${MOBILE}) {
    padding: 1.25rem 1rem;
    min-height: calc(100vh - 56px);
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.25rem;
  color: #7f8c8d;
`;
