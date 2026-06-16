"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import { shareToKakao, type KakaoShareParams } from "@/lib/kakao";

interface KakaoShareButtonProps extends KakaoShareParams {
  /** 버튼 라벨. 기본 "공유" */
  label?: string;
  /** 부모 카드의 onClick 전파 차단 여부. 기본 true */
  stopPropagation?: boolean;
  /** 크기. 기본 "sm" */
  size?: "sm" | "lg";
  /** 부모 너비 가득 채우기 */
  block?: boolean;
  className?: string;
}

const Button = styled.button<{ $size: "sm" | "lg"; $block: boolean }>`
  display: ${(p) => (p.$block ? "flex" : "inline-flex")};
  width: ${(p) => (p.$block ? "100%" : "auto")};
  align-items: center;
  justify-content: center;
  gap: ${(p) => (p.$size === "lg" ? "0.5rem" : "0.4rem")};
  padding: ${(p) => (p.$size === "lg" ? "0.8rem 1.4rem" : "0.5rem 0.9rem")};
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: #fee500;
  color: #3c1e1e;
  font-family: ${theme.typography.fontBody};
  font-size: ${(p) => (p.$size === "lg" ? "0.95rem" : "0.8125rem")};
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: ${theme.transitions.fast};

  svg {
    width: ${(p) => (p.$size === "lg" ? "20px" : "16px")};
    height: ${(p) => (p.$size === "lg" ? "20px" : "16px")};
  }

  &:hover {
    background: #f2da00;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.76 1.86 5.18 4.66 6.56-.2.7-.74 2.62-.85 3.03-.13.5.18.5.39.36.16-.11 2.6-1.77 3.66-2.49.7.1 1.42.16 2.14.16 5.523 0 10-3.477 10-7.78S17.523 3 12 3z" />
  </svg>
);

/**
 * 카카오톡 공유 버튼 (개별 항목용)
 * 클릭 시 해당 항목의 제목·설명·썸네일·딥링크로 Feed 공유
 */
export default function KakaoShareButton({
  label = "공유",
  stopPropagation = true,
  size = "sm",
  block = false,
  className,
  ...params
}: KakaoShareButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    shareToKakao(params).catch((err) => console.error("[kakao] 공유 실패", err));
  };

  return (
    <Button
      type="button"
      $size={size}
      $block={block}
      className={className}
      onClick={handleClick}
      aria-label="카카오톡으로 공유하기"
    >
      <KakaoIcon />
      {label}
    </Button>
  );
}
