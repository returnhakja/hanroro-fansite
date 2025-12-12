import styled from "styled-components";

export const ConfirmBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 280px;
  max-width: 420px;
`;

export const ConfirmTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  color: #222;
`;

export const ConfirmDesc = styled.p`
  margin: 0;
  color: #555;
  font-size: 0.95rem;
`;

export const ConfirmActions = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const ConfirmButton = styled.button<{ $variant: "primary" | "ghost" }>`
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.95rem;
  cursor: pointer;

  ${(p) =>
    p.$variant === "primary"
      ? `
    background: #6a4c93;
    color: white;
  `
      : `
    background: #e9ecef;
    color: #222;
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
