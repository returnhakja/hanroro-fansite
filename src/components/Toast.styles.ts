import styled, { css, keyframes } from "styled-components";

const slideUp = keyframes`
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const ToastViewport = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
  pointer-events: none;
`;

export const ToastItem = styled.div<{ $type: "success" | "error" | "info" }>`
  min-width: 220px;
  max-width: 320px;
  padding: 12px 14px;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.18s ease-out;

  ${(p) =>
    p.$type === "success" &&
    css`
      background: #2f9e44;
    `}
  ${(p) =>
    p.$type === "error" &&
    css`
      background: #e03131;
    `}
  ${(p) =>
    p.$type === "info" &&
    css`
      background: #6a4c93;
    `}
`;

