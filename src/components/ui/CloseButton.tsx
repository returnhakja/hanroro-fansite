import styled from 'styled-components';

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fff;
  border: none;
  font-size: 1.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 1100;

  &::before {
    content: '×';
    font-size: 1.5rem;
    color: #333;
    line-height: 36px;
    display: block;
    text-align: center;
  }

  &:hover::before {
    color: #ff0000;
  }
`;
