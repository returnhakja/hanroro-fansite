'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { theme } from '@/styles/theme';

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <FooterContainer>
      <FooterInner>
        <FooterLogo>HANRORO</FooterLogo>
        <FooterDesc>싱어송라이터 한로로의 팬사이트</FooterDesc>

        <FooterGrid>
          <FooterColumn>
            <FooterColumnTitle>Navigation</FooterColumnTitle>
            <FooterLink href="/gallery">Gallery</FooterLink>
            <FooterLink href="/profile">About</FooterLink>
            <FooterLink href="/board">Board</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterColumnTitle>Social</FooterColumnTitle>
            <FooterExternalLink
              href="https://www.youtube.com/channel/UCrDa_5OU-rhvXqWlPx5hgKQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </FooterExternalLink>
            <FooterExternalLink
              href="https://www.instagram.com/hanr0r0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </FooterExternalLink>
            <FooterExternalLink
              href="https://artist.mnetplus.world/main/stg/hanroro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Plus Chat
            </FooterExternalLink>
            <FooterExternalLink
              href="https://blog.naver.com/hanr0r0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Naver Blog
            </FooterExternalLink>
          </FooterColumn>

          <FooterColumn>
            <FooterColumnTitle>Legal</FooterColumnTitle>
            <FooterLink href="/privacy-policy">개인정보처리방침</FooterLink>
            <FooterLink href="/terms-of-service">서비스 이용약관</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterColumnTitle>Contact</FooterColumnTitle>
            <FooterLink href="/contact">문의하기</FooterLink>
          </FooterColumn>
        </FooterGrid>

        <FooterDivider />
        <FooterCopyright>
          &copy; {year ?? ''} HANRORO FANSITE. All rights reserved.
        </FooterCopyright>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background-color: ${theme.colors.textPrimary};
  color: ${theme.colors.surfaceWarm};
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 4rem 3rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 3rem 1.5rem 2rem;
  }
`;

const FooterLogo = styled.div`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: ${theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const FooterDesc = styled.p`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textTertiary};
  margin-bottom: 3rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterColumnTitle = styled.span`
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accent};
  margin-bottom: 0.25rem;
`;

const FooterLink = styled(Link)`
  text-decoration: none;
  color: ${theme.colors.secondaryLight};
  font-size: 0.875rem;
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.textLight};
  }
`;

const FooterExternalLink = styled.a`
  text-decoration: none;
  color: ${theme.colors.secondaryLight};
  font-size: 0.875rem;
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.textLight};
  }
`;

const FooterDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(229, 221, 208, 0.15);
  margin-bottom: 1.5rem;
`;

const FooterCopyright = styled.p`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textTertiary};
`;
