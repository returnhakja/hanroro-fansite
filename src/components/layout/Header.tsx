'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { theme } from '@/styles/theme';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderContainer $scrolled={scrolled}>
      <LogoLink href="/">HANRORO</LogoLink>

      <Hamburger onClick={() => setMenuOpen(true)}>
        <HamburgerLine />
        <HamburgerLine />
        <HamburgerLine />
      </Hamburger>

      {menuOpen && <Overlay onClick={() => setMenuOpen(false)} />}

      <Nav $open={menuOpen}>
        <CloseButton onClick={() => setMenuOpen(false)}>&times;</CloseButton>
        <NavLink href="/gallery" onClick={() => setMenuOpen(false)}>
          Gallery
        </NavLink>
        <NavLink href="/profile" onClick={() => setMenuOpen(false)}>
          About
        </NavLink>
        <NavLink href="/board" onClick={() => setMenuOpen(false)}>
          Board
        </NavLink>
      </Nav>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header<{ $scrolled: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 3rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${({ $scrolled }) =>
    $scrolled ? 'rgba(250, 247, 242, 0.95)' : 'transparent'};
  border-bottom: ${({ $scrolled }) =>
    $scrolled ? `1px solid ${theme.colors.border}` : '1px solid transparent'};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(12px)' : 'none')};
  transition: background-color 0.4s ease, border-bottom 0.4s ease, backdrop-filter 0.4s ease;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1rem 1.5rem;
  }
`;

const LogoLink = styled(Link)`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: ${theme.colors.textPrimary};
  text-decoration: none;
  transition: color ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.accent};
  }
`;

const Hamburger = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: flex;
  }
`;

const HamburgerLine = styled.span`
  display: block;
  width: 24px;
  height: 2px;
  background-color: ${theme.colors.textPrimary};
  transition: ${theme.transitions.normal};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(44, 36, 24, 0.3);
  z-index: 998;
`;

const Nav = styled.nav<{ $open: boolean }>`
  display: flex;
  gap: 2.5rem;
  align-items: center;

  @media (min-width: 769px) {
    position: static;
    transform: none;
    transition: none;
    height: auto;
    background: transparent;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    background: ${theme.colors.background};
    position: fixed;
    top: 0;
    right: 0;
    width: 260px;
    height: 100vh;
    padding: 2.5rem 2rem;
    border-left: 1px solid ${theme.colors.border};
    z-index: 999;
    gap: 0;
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-in-out;
  }
`;

const CloseButton = styled.button`
  align-self: flex-end;
  font-size: 1.75rem;
  cursor: pointer;
  margin-bottom: 2rem;
  background: none;
  border: none;
  color: ${theme.colors.textPrimary};

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontBody};
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  position: relative;
  padding: 0.5rem 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 1.5px;
    background-color: ${theme.colors.accent};
    transition: width 0.3s ease, left 0.3s ease;
  }

  &:hover::after {
    width: 100%;
    left: 0;
  }

  &:hover {
    color: ${theme.colors.primaryDark};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1rem;
    padding: 0.75rem 0;
    width: 100%;
    border-bottom: 1px solid ${theme.colors.borderLight};

    &::after {
      display: none;
    }
  }
`;

export default Header;
