import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/styles/theme";

// 홈 리디자인(A안) 전용 팔레트. 헤더는 기존 크림 톤을 그대로 쓰므로 바탕은
// 사이트 기본 배경에 맞추고, 글자·포인트만 새 톤으로 간다.
export const ink = "#151515";
export const inkSoft = "#4A4A4A";
export const muted = "#5A5A5A";
export const line = "#DAD8D2";
export const lineSoft = "#ECEAE5";
export const accent = "#C8442E";
export const display = "'Space Grotesk', 'Pretendard', sans-serif";

export const HomeRoot = styled.div`
  background: ${theme.colors.background};
  color: ${ink};
  font-family: ${theme.typography.fontBody};
`;

export const Inner = styled.div`
  max-width: 1264px;
  margin: 0 auto;
  padding: 64px 48px;
  box-sizing: border-box;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 40px 20px;
  }
`;

export const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${display};
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.04em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 26px;
  }
`;

export const SectionMore = styled(Link)<{ $onDark?: boolean }>`
  font-size: 15px;
  padding: 12px 0;
  color: ${({ $onDark }) => ($onDark ? "#F4F3F0" : ink)};
  text-decoration: underline;
  text-underline-offset: 3px;
`;

export const Tag = styled.span`
  display: inline-block;
  font-family: ${display};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: ${accent};
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
`;

export const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${display};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
`;

export const PrimaryButton = styled(Link)<{ $onDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 26px;
  border-radius: 6px;
  background: ${({ $onDark }) => ($onDark ? "#F4F3F0" : ink)};
  color: ${({ $onDark }) => ($onDark ? ink : "#FFFFFF")};
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
`;

export const GhostButton = styled(Link)<{ $onDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 26px;
  border-radius: 6px;
  border: 1.5px solid ${({ $onDark }) => ($onDark ? "#F4F3F0" : ink)};
  color: ${({ $onDark }) => ($onDark ? "#F4F3F0" : ink)};
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  box-sizing: border-box;
`;

export const BigNumber = styled.div`
  font-family: ${display};
  font-size: 150px;
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.04em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 96px;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
`;

export const Col = styled.div<{ $grow?: number; $basis?: string }>`
  flex: ${({ $grow = 1, $basis = "420px" }) => `${$grow} 1 ${$basis}`};
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid ${line};
  border-radius: 8px;
`;

export const ListTop = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 2px solid ${ink};
`;
