"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import { usePushSubscription } from "./usePushSubscription";

function BellIcon({ active, denied }: { active: boolean; denied: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      {denied && <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" />}
    </svg>
  );
}

export default function PushToggleButton() {
  const { isSupported, permission, isSubscribed, loading, subscribe, unsubscribe } =
    usePushSubscription();

  if (!isSupported) return null;

  const denied = permission === "denied";
  const title = denied
    ? "알림이 차단됨 — 브라우저 설정에서 허용해 주세요"
    : isSubscribed
      ? "알림 끄기"
      : "알림 받기";

  return (
    <IconButton
      type="button"
      onClick={denied ? undefined : isSubscribed ? unsubscribe : subscribe}
      disabled={loading || denied}
      $active={isSubscribed}
      title={title}
      aria-label={title}
    >
      <BellIcon active={isSubscribed} denied={denied} />
    </IconButton>
  );
}

const IconButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  color: ${({ $active }) =>
    $active ? theme.colors.accent : theme.colors.textSecondary};
  transition:
    color ${theme.transitions.normal},
    background ${theme.transitions.fast};

  &:hover:not(:disabled) {
    color: ${theme.colors.accent};
    background: ${theme.colors.surfaceAlt};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
