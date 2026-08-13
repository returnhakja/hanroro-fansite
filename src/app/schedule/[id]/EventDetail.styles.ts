import styled from "styled-components";
import Link from "next/link";
import { theme } from "@/styles/theme";

export const Container = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 2.5rem 2rem 5rem;
  min-height: 60vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1.75rem 1.25rem 4rem;
  }
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  margin-bottom: 1.5rem;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

export const Hero = styled.div<{ $posterUrl?: string }>`
  position: relative;
  min-height: 260px;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  background: ${({ $posterUrl }) =>
    $posterUrl
      ? `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55)), url(${$posterUrl})`
      : `linear-gradient(160deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 60%, ${theme.colors.primaryDark} 130%)`};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 1.75rem;
  box-shadow: ${theme.shadows.lg};
  margin-bottom: 1.25rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-height: 200px;
    padding: 1.25rem;
  }
`;

export const HeroDday = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.32);
  color: #fff;
  padding: 0.4rem 0.9rem;
  border-radius: ${theme.borderRadius.full};
  font-family: ${theme.typography.fontHeading};
  font-size: 1.05rem;
`;

export const HeroBody = styled.div`
  position: relative;
  z-index: 1;
  color: #fff;
`;

export const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.28);
  margin-bottom: 0.6rem;
`;

export const HeroTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.65rem;
  font-weight: 500;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.35rem;
  }
`;

export const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 1.25rem;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: ${theme.colors.textSecondary};

  svg {
    width: 15px;
    height: 15px;
    color: ${theme.colors.accentDark};
    flex-shrink: 0;
  }

  strong {
    color: ${theme.colors.textPrimary};
    font-weight: 600;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{ $checked?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ $checked }) => ($checked ? theme.colors.accent : theme.colors.border)};
  background: ${({ $checked }) => ($checked ? theme.colors.accent : "transparent")};
  color: ${({ $checked }) => ($checked ? "#382C16" : theme.colors.textSecondary)};
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.accent};
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;

  h2 {
    font-family: ${theme.typography.fontHeading};
    font-size: 1.3rem;
    font-weight: 400;
    margin: 0;
    color: ${theme.colors.textPrimary};
  }

  span {
    font-size: 0.8rem;
    color: ${theme.colors.textTertiary};
  }
`;

/* ── 후기 ───────────────────────────────────── */

export const ReviewForm = styled.form`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 1.1rem;
  margin-bottom: 1.5rem;
`;

export const ReviewFormRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
  flex-wrap: wrap;
`;

export const AnonymousNotice = styled.p`
  margin: 0 0 0.6rem;
  font-size: 0.8rem;
  color: ${theme.colors.textTertiary};
`;

export const ReviewInput = styled.input`
  padding: 0.55rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.85rem;
  font-family: ${theme.typography.fontBody};
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  width: 140px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

export const ReviewTextarea = styled.textarea`
  width: 100%;
  min-height: 70px;
  padding: 0.7rem 0.85rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.88rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  resize: vertical;
  margin-bottom: 0.7rem;
  overflow-wrap: break-word;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

export const ImageAttachRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
`;

export const ImageThumb = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ImageRemoveButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  svg {
    width: 9px;
    height: 9px;
  }
`;

export const ImageAddButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px dashed ${theme.colors.border};
  background: ${theme.colors.surfaceAlt};
  color: ${theme.colors.textTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accentDark};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ReviewFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SubmitButton = styled.button`
  padding: 0.6rem 1.25rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const ReviewCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 1rem 1.1rem;
`;

export const ReviewTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.82rem;
`;

export const ReviewAuthor = styled.span`
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const ReviewTime = styled.span`
  color: ${theme.colors.textTertiary};
`;

export const ReviewDeleteButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: ${theme.colors.textTertiary};
  font-size: 0.78rem;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${theme.colors.error};
  }
`;

export const ReviewBody = styled.p`
  font-size: 0.9rem;
  line-height: 1.65;
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.6rem;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

export const ReviewImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ReviewImage = styled.img`
  width: 84px;
  height: 84px;
  border-radius: ${theme.borderRadius.sm};
  object-fit: cover;
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
`;

export const ReviewEmpty = styled.div`
  text-align: center;
  padding: 2.25rem 1rem;
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.textTertiary};
  font-size: 0.85rem;
  line-height: 1.7;
`;

export const LoadingText = styled.p`
  text-align: center;
  color: ${theme.colors.textTertiary};
  padding: 4rem 0;
`;
