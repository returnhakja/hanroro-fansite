"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import styled from "styled-components";
import { theme } from "@/styles/theme";

/* ==================== Styled Components ==================== */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const ModalBox = styled(motion.div)`
  background: #0e0c09;
  border: 1px solid ${theme.colors.accent};
  border-radius: ${theme.borderRadius.lg};
  max-width: 780px;
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  box-shadow:
    0 0 60px rgba(201, 169, 110, 0.2),
    0 24px 80px rgba(0, 0, 0, 0.6);

  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.accentDark} transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.accentDark};
    border-radius: 2px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem 1.25rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.2);
`;

const WinnerBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: ${theme.typography.fontHeading};
`;

const WinnerLabel = styled.span`
  background: ${theme.colors.accent};
  color: #0e0c09;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 0.25rem 0.625rem;
  border-radius: 3px;
`;

const WinnerTitle = styled.span`
  color: ${theme.colors.accentLight};
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.05em;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textTertiary};
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0.25rem;
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.accentLight};
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ReviewSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ReviewBlock = styled.div`
  grid-column: 1 / -1;
`;

const ReviewText = styled.p`
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.875rem;
  line-height: 1.9;
  word-break: keep-all;
  margin-bottom: 0.75rem;
`;

const ReviewAuthor = styled.p`
  color: ${theme.colors.accentLight};
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.04em;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(201, 169, 110, 0.15);
  margin: 0;
`;

const ReviewWithMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: start;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const MetaTable = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 180px;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.8125rem;
`;

const MetaDt = styled.dt`
  color: ${theme.colors.textTertiary};
  white-space: nowrap;
  min-width: 4rem;
`;

const MetaDd = styled.dd`
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  margin: 0;
`;

/* ==================== 컴포넌트 ==================== */

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const launchFireworks = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ["#C9A96E", "#DEC596", "#FFFFFF", "#FFD700", "#FFF8DC"];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

const AwardModal = ({ isOpen, onClose }: AwardModalProps) => {
  useEffect(() => {
    if (isOpen) {
      launchFireworks();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleOverlayClick}
        >
          <ModalBox
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* 헤더 */}
            <ModalHeader>
              <WinnerBadge>
                <WinnerLabel>WINNER</WinnerLabel>
                <WinnerTitle>올해의 음악인</WinnerTitle>
              </WinnerBadge>
              <CloseButton onClick={onClose} aria-label="닫기">
                ×
              </CloseButton>
            </ModalHeader>

            {/* 본문 */}
            <ModalBody>
              {/* 심사평 1 */}
              <ReviewBlock>
                <ReviewText>
                  우리는 흔히 청춘을 금빛의 수사로 치장하려 들지만, 한로로의 노래는 그 화려한
                  표면 아래 무너진 집의 잔해를 직시하는 리얼리스트의 응시에서 출발한다. 인디와
                  메이저 사이의 가교가 끊겨버린 이 고립의 시대에, 그녀가 일궈낸 궤적은 멸종된
                  줄 알았던 동 세대의 울음을 복원해 내는 절실한 &lsquo;보수공사&rsquo;다.
                  무너진 폐허 위에서도 끝내 서로를 놓지 않겠다는 윤리적 태도는, 맹목적인 희망이
                  아닌 상처의 깊이를 아는 자만이 찍을 수 있는 성숙한 낙관(樂觀)의 낙관(落款)이다.
                  그리하여 한로로라는 현상은 단순한 스타의 등장을 넘어, 파편화된 개인들을
                  &lsquo;우리&rsquo;라는 수평적 연대로 묶어내는 새로운 길(路)의 서막이 된다.
                  기성세대의 문법으로는 번역되지 않는 이 뜨거운 포용은, 이제 우리 시대가 목격하게
                  될 거대한 록스타의 필연적인 예고편이라 해도 무방하다.
                </ReviewText>
                <ReviewAuthor>선정위원 이재훈</ReviewAuthor>
              </ReviewBlock>

              <Divider />

              {/* 심사평 2 + 수상 정보 */}
              <ReviewWithMeta>
                <div>
                  <ReviewText>
                    여리게 떨리던 한 소녀의 독백이 봄을 맞고 시간을 달려, 마침내 2025년 한국
                    대중음악 신의 최전선에서 울리는 거대한 합창이 되었다. 한로로는 낭만으로
                    포장된 청춘의 외피 대신, 그 이면에 도사린 실존적 불안과 좌절을 문학적
                    감수성으로 포착한다. 그녀가 무대 위에서 노래하는 것은 &ldquo;나도 당신만큼
                    흔들리고 있다&rdquo;는 고백이자, &ldquo;그럼에도 서로를 놓지 말자&rdquo;는
                    외침이다. 그 섬세한 언어와 서정적 멜로디가 빚어낸 파동은 단순한 공감을 넘어
                    하나의 현상이 되었다. 소설과 음반을 결합해 표현의 영역을 더욱 확장한
                    [자몽살구클럽]에서 구축한 연대의 세계관은, 매일 누군가의 이어폰에서,
                    페스티벌의 깃발 아래서, 그리고 희망의 서사를 완성하는 단독 공연장에서 수많은
                    청춘들의 뜨거운 유대를 이끌어냈다. 메마른 세상에 건네는 올바른 분노와 다정한
                    용기. 한로로의 음악은 2025년 한국 대중음악 신의 가장 따뜻하고 찬란한 위로의
                    이정표다.
                  </ReviewText>
                  <ReviewAuthor>선정위원 최용환</ReviewAuthor>
                </div>

                <MetaTable>
                  <MetaRow>
                    <MetaDt>아티스트</MetaDt>
                    <MetaDd>한로로</MetaDd>
                  </MetaRow>
                  <MetaRow>
                    <MetaDt>음반명</MetaDt>
                    <MetaDd>자몽살구클럽</MetaDd>
                  </MetaRow>
                  <MetaRow>
                    <MetaDt>프로듀서</MetaDt>
                    <MetaDd>김원호</MetaDd>
                  </MetaRow>
                  <MetaRow>
                    <MetaDt>대표곡</MetaDt>
                    <MetaDd>시간을 달리네</MetaDd>
                  </MetaRow>
                  <MetaRow>
                    <MetaDt>제작사</MetaDt>
                    <MetaDd>authentic</MetaDd>
                  </MetaRow>
                  <MetaRow>
                    <MetaDt>유통사</MetaDt>
                    <MetaDd>더 볼트</MetaDd>
                  </MetaRow>
                  <MetaRow>
                    <MetaDt>발매일</MetaDt>
                    <MetaDd>2025.08.04</MetaDd>
                  </MetaRow>
                </MetaTable>
              </ReviewWithMeta>
            </ModalBody>
          </ModalBox>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default AwardModal;
