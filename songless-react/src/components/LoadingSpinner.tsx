import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  text-align: center;
  color: ${p => p.theme.txM};
  font-size: 14px;
  padding: 20px;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid ${p => p.theme.bd};
  border-top-color: ${p => p.theme.ac};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 0 auto 10px;
`;

export default function LoadingSpinner() {
  return (
    <Wrapper>
      <Spinner />
      Loading song preview...
    </Wrapper>
  );
}
