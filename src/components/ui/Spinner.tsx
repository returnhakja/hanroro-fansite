'use client';

import styled from 'styled-components';

const Spinner = () => (
  <SpinnerOverlay>
    <SpinnerCircle />
  </SpinnerOverlay>
);

export default Spinner;

const SpinnerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const SpinnerCircle = styled.div`
  border: 4px solid #eee;
  border-top: 4px solid #6a4c93;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
