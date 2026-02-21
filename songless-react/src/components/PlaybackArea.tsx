import styled from 'styled-components';
import ProgressBar from './ProgressBar';
import { CUM_DURATIONS, MAX_STEPS } from '../constants';

const Wrapper = styled.div``;

const DurLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.theme.wh};
  margin-bottom: 5px;
  font-family: ${p => p.theme.fontMono};

  span {
    margin-left: 6px;
    color: ${p => p.theme.txM};
    font-size: 10px;
  }
`;

const PlayWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0 10px;
`;

const PlayBtn = styled.button`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: ${p => p.theme.ac};
  color: #000;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(74, 222, 128, 0.3);
  transition: transform 0.1s;

  &:active {
    transform: scale(0.92);
  }

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
`;

const ErrorMsg = styled.div`
  text-align: center;
  color: ${p => p.theme.wr};
  font-size: 14px;
  padding: 16px;

  button {
    margin-top: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid ${p => p.theme.bd};
    background: ${p => p.theme.sf};
    color: ${p => p.theme.tx};
    font-size: 13px;
    font-weight: 600;
  }
`;

interface PlaybackAreaProps {
  step: number;
  isPlaying: boolean;
  fillWidth: number;
  animating: boolean;
  previewError: boolean;
  onPlay: () => void;
  onRetry: () => void;
}

export default function PlaybackArea({ step, isPlaying, fillWidth, animating, previewError, onPlay, onRetry }: PlaybackAreaProps) {
  if (previewError) {
    return (
      <ErrorMsg>
        Could not load preview for this song.
        <br />
        <button onClick={onRetry}>Retry</button>
      </ErrorMsg>
    );
  }

  const d = CUM_DURATIONS[Math.min(step, MAX_STEPS - 1)];
  const label = d < 1 ? `${d} seconds` : `${d} second${d !== 1 ? 's' : ''}`;

  return (
    <Wrapper>
      <DurLabel>{label} <span>&#9660;</span></DurLabel>
      <ProgressBar fillWidth={fillWidth} animating={animating} step={step} />
      <PlayWrap>
        <PlayBtn onClick={onPlay}>
          {isPlaying ? '\u23F8' : '\u25B6'}
        </PlayBtn>
      </PlayWrap>
    </Wrapper>
  );
}
