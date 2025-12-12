import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(to right, #f3eef8, #f8f5f2);
  display: flex;
  justify-content: center;
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 760px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 0.5rem;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  color: #6a4c93;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button<{ $variant: "primary" | "ghost" }>`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;

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

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1rem;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.label`
  font-weight: bold;
  color: #444;
`;

export const Counter = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

export const Input = styled.input`
  padding: 0.7rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #6a4c93;
    box-shadow: 0 0 0 2px rgba(106, 76, 147, 0.12);
  }
`;

export const Textarea = styled.textarea`
  padding: 0.7rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  resize: none;
  line-height: 1.6;

  &:focus {
    border-color: #6a4c93;
    box-shadow: 0 0 0 2px rgba(106, 76, 147, 0.12);
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #e03131;
`;

export const DropZone = styled.div<{ $dragging: boolean }>`
  border: 2px dashed ${(p) => (p.$dragging ? "#6a4c93" : "#c9c9c9")};
  background: ${(p) => (p.$dragging ? "#f3eef8" : "#fafafa")};
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  color: #555;
  cursor: pointer;
  transition: all 0.15s ease;
`;

export const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
  margin-top: 8px;
`;

export const ThumbItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;

  img {
    width: 100%;
    height: 110px;
    object-fit: cover;
    display: block;
  }
`;

export const RemoveThumb = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
`;

