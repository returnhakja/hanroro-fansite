'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <HeaderContainer>
      <LogoLink href="/">
        <LogoImage src="/로고딩.svg" alt="HANRORO Logo" />
      </LogoLink>

      <Hamburger onClick={() => setMenuOpen(true)}>☰</Hamburger>

      {menuOpen && <Overlay onClick={() => setMenuOpen(false)} />}

      <Nav $open={menuOpen}>
        <CloseButton onClick={() => setMenuOpen(false)}>✕</CloseButton>
        <NavLink href="/gallery" onClick={() => setMenuOpen(false)}>
          Gallery
        </NavLink>
        <NavLink href="/board" onClick={() => setMenuOpen(false)}>
          Board
        </NavLink>
        <NavLink href="/profile" onClick={() => setMenuOpen(false)}>
          Profile
        </NavLink>
      </Nav>

      <Auth>
        {/* 향후 로그인 기능 추가 시 사용 */}
      </Auth>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem;
  background-color: #f8f5f2;
  border-bottom: 1px solid #ddd;
  position: relative;
`;

const LogoLink = styled(Link)`
  display: inline-block;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  display: block;
`;

const Hamburger = styled.div`
  display: none;
  font-size: 2rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
`;

const Nav = styled.nav<{ $open: boolean }>`
  display: flex;
  gap: 1.5rem;

  @media (min-width: 769px) {
    position: static;
    transform: none;
    transition: none;
    height: auto;
    background: transparent;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    background: #f8f5f2;
    position: fixed;
    top: 0;
    right: 0;
    width: 220px;
    height: 100vh;
    padding: 2rem 1rem;
    border-left: 1px solid #ddd;
    z-index: 999;

    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-in-out;
  }
`;

const CloseButton = styled.div`
  align-self: flex-end;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 1rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  margin: 0.5rem 0;

  &:hover {
    color: #6a4c93;
  }
`;

const Auth = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export default Header;
