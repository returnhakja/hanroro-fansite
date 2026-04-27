import styled from "styled-components";
import { theme } from "@/styles/theme";

/** 홈 상단: 헤더 아래 정렬 + 일정 페이지와 동일한 max 폭 */
export const HomeHeroQuickRoot = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 5.5rem 3rem 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 5rem 1.25rem 0;
  }
`;
