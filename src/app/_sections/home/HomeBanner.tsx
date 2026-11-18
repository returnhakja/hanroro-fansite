"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useBanners, type PublicBanner } from "@/hooks/queries/useBanners";
import { ink, muted, accent, display } from "./Home.styles";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;
const MOBILE_QUERY = "(max-width: 767px)";

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

/**
 * 홈 최상단 팬 이벤트 홍보 배너
 * - 글자까지 들어간 통이미지 + 오른쪽 아래 버튼 하나만 덧씌움
 * - 여러 장이면 5초마다 넘어가고, 마우스를 올리거나 포커스가 있으면 멈춤
 * - 노출 중인 배너가 없으면 아무것도 렌더링하지 않음
 */
export default function HomeBanner() {
  const { data: banners = [] } = useBanners();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const swiped = useRef(false);

  const count = banners.length;
  const current = count ? index % count : 0;

  const go = useCallback(
    (i: number) => {
      if (!count) return;
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setIndex((i) => (i + 1) % count);
      }
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion]);

  if (!count) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    swiped.current = false;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    setPaused(false);
    if (start === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      swiped.current = true;
      go(current + (dx < 0 ? 1 : -1));
    }
  };

  // 스와이프로 넘긴 직후 발생하는 클릭은 링크 이동으로 처리하지 않음
  const onLinkClick = (e: React.MouseEvent) => {
    if (swiped.current) {
      e.preventDefault();
      swiped.current = false;
    }
  };

  return (
    <Section aria-label="팬 이벤트 홍보" aria-roledescription="carousel">
      <Frame
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Track style={{ transform: `translateX(-${current * 100}%)` }}>
          {banners.map((b, i) => (
            <Slide
              key={b._id}
              banner={b}
              active={i === current}
              eager={i === 0}
              position={`${i + 1} / ${count}`}
              onClick={onLinkClick}
            />
          ))}
        </Track>

        {count > 1 && (
          <>
            <Arrow type="button" $side="left" aria-label="이전 배너" onClick={() => go(current - 1)}>
              ‹
            </Arrow>
            <Arrow type="button" $side="right" aria-label="다음 배너" onClick={() => go(current + 1)}>
              ›
            </Arrow>
          </>
        )}
      </Frame>

      {count > 1 && (
        <Meta>
          <Dots>
            {banners.map((b, i) => (
              <DotButton
                key={b._id}
                type="button"
                aria-label={`${i + 1}번째 배너`}
                aria-current={i === current}
                onClick={() => go(i)}
              >
                <Dot $active={i === current} />
              </DotButton>
            ))}
            <Counter>
              {current + 1} / {count}
            </Counter>
          </Dots>
        </Meta>
      )}
    </Section>
  );
}

function Slide({
  banner,
  active,
  eager,
  position,
  onClick,
}: {
  banner: PublicBanner;
  active: boolean;
  eager: boolean;
  position: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  const external = isExternal(banner.linkUrl);
  return (
    <SlideLink
      href={banner.linkUrl}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
      aria-roledescription="slide"
      aria-label={`${position}: ${banner.alt}${banner.buttonLabel ? ` - ${banner.buttonLabel}` : ""}`}
      onClick={onClick}
    >
      <picture>
        {banner.mobileImageUrl && <source media={MOBILE_QUERY} srcSet={banner.mobileImageUrl} />}
        <Img
          src={banner.pcImageUrl}
          alt={banner.alt}
          width={1200}
          height={400}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          $noMobile={!banner.mobileImageUrl}
        />
      </picture>
      {banner.buttonLabel && <Cta aria-hidden>{banner.buttonLabel} →</Cta>}
    </SlideLink>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────
const Section = styled.section`
  max-width: 1264px;
  margin: 0 auto;
  padding: 16px 48px 0;

  @media (max-width: 767px) {
    padding: 12px 20px 0;
  }
`;

const Frame = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: ${ink};
  aspect-ratio: 3 / 1;

  @media (max-width: 767px) {
    aspect-ratio: 5 / 2;
  }
`;

const Track = styled.div`
  display: flex;
  height: 100%;
  transition: transform 0.45s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const SlideLink = styled.a`
  position: relative;
  flex: 0 0 100%;
  height: 100%;
  display: block;

  &:focus-visible {
    outline: 3px solid ${accent};
    outline-offset: -3px;
  }
`;

const Img = styled.img<{ $noMobile: boolean }>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;

  /* 모바일 이미지가 없으면 PC 이미지를 잘리지 않게 통째로 보여줌 */
  @media (max-width: 767px) {
    object-fit: ${({ $noMobile }) => ($noMobile ? "contain" : "cover")};
  }
`;

const Cta = styled.span`
  position: absolute;
  right: 64px;
  bottom: 14px;
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  background: #ffffff;
  color: ${ink};
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  white-space: nowrap;

  ${SlideLink}:hover & {
    background: #f1efea;
  }

  @media (max-width: 767px) {
    right: 10px;
    bottom: 10px;
    min-height: 32px;
    padding: 0 12px;
    font-size: 12px;
  }
`;

const Arrow = styled.button<{ $side: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: 10px;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.88);
  color: ${ink};
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${Frame}:hover &,
  &:focus-visible {
    opacity: 1;
  }

  /* 모바일은 스와이프 + 점으로 넘김 */
  @media (hover: none), (max-width: 767px) {
    display: none;
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 4px;
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
`;

const DotButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Dot = styled.span<{ $active: boolean }>`
  display: block;
  width: ${({ $active }) => ($active ? 20 : 6)}px;
  height: 6px;
  border-radius: 3px;
  background: ${({ $active }) => ($active ? ink : "#C9C6BE")};
  transition: width 0.2s ease;
`;

const Counter = styled.span`
  font-family: ${display};
  font-size: 12px;
  color: ${muted};
  margin-left: 6px;
`;
