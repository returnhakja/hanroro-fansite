"use client";

import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";
import LogoImg from "../assets/로고딩.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <HeaderContainer>
      <Link href="/" passHref legacyBehavior>
        <LogoLink>
          <LogoImage src={LogoImg} alt="HANRORO Logo" />
        </LogoLink>
      </Link>

      <Hamburger onClick={() => setMenuOpen(true)}>☰</Hamburger>

      {menuOpen && <Overlay onClick={() => setMenuOpen(false)} />}

      <Nav open={menuOpen}>
        <CloseButton onClick={() => setMenuOpen(false)}>✕</CloseButton>
        <Link href="/gallery" passHref legacyBehavior>
          <NavItem onClick={() => setMenuOpen(false)}>Gallery</NavItem>
        </Link>
        <Link href="/board" passHref legacyBehavior>
          <NavItem onClick={() => setMenuOpen(false)}>Board</NavItem>
        </Link>
        {/* <Link href="/support" passHref legacyBehavior>
          <NavItem onClick={() => setMenuOpen(false)}>Support</NavItem>
        </Link>
        <Link href="/archive" passHref legacyBehavior>
          <NavItem onClick={() => setMenuOpen(false)}>Archive</NavItem>
        </Link> */}
        <Link href="/profile" passHref legacyBehavior>
          <NavItem onClick={() => setMenuOpen(false)}>Profile</NavItem>
        </Link>
      </Nav>

      <Auth>
        {/* <Link href="/login" passHref legacyBehavior><AuthButton>Login</AuthButton></Link> */}
        {/* <Link href="/signup" passHref legacyBehavior><AuthButton>Sign Up</AuthButton></Link> */}
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

const LogoLink = styled.a`
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
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

const Nav = styled.nav<{ open: boolean }>`
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

    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
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

const NavItem = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  margin: 0.5rem 0;
  cursor: pointer;

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

const AuthButton = styled.a`
  padding: 0.4rem 0.8rem;
  border: 1px solid #6a4c93;
  border-radius: 6px;
  text-decoration: none;
  color: #6a4c93;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background-color: #6a4c93;
    color: white;
  }
`;

export default Header;
