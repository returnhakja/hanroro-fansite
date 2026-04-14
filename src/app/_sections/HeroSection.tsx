"use client";

import { useReducedMotion } from "framer-motion";
import AwardModal from "@/components/ui/AwardModal";
import { useState } from "react";
import {
  HeroSection as HeroSectionWrapper,
  HeroBackground,
  HeroOverlay,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  AwardBadge,
  AwardBadgeImage,
  ScrollIndicator,
} from "./HeroSection.styles";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <>
      <HeroSectionWrapper>
        <HeroBackground
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <HeroOverlay />

        <HeroContent
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <HeroTitle
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            HANRORO
          </HeroTitle>

          <HeroSubtitle
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Singer-Songwriter
          </HeroSubtitle>

          <AwardBadge
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            onClick={() => setIsAwardModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <AwardBadgeImage
              src="/assets/대중음악상.jpg"
              alt="2026 한국대중음악상"
            />
            🏆 &nbsp;2026 제23회 한국대중음악상 &nbsp;·&nbsp; 올해의 음악인
          </AwardBadge>
        </HeroContent>

        <ScrollIndicator
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={shouldReduceMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={scrollToContent}
        />
      </HeroSectionWrapper>

      <AwardModal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
      />
    </>
  );
}
