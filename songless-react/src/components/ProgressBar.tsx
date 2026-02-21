import styled from 'styled-components';
import { CUM_FILL, DURATIONS } from '../constants';

const Bar = styled.div`
  height: 18px;
  border-radius: 9px;
  background: #222230;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
`;

const Fill = styled.div<{ $width: number; $animating: boolean }>`
  height: 100%;
  border-radius: 9px;
  background: linear-gradient(90deg, ${p => p.theme.ac}, ${p => p.theme.acD});
  transition: ${p => p.$animating ? 'none' : 'width 0.3s ease'};
  min-width: 0;
  width: ${p => p.$width}%;
`;

const Marker = styled.div<{ $left: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
  left: ${p => p.$left}%;
`;

interface ProgressBarProps {
  fillWidth: number;
  animating: boolean;
}

export default function ProgressBar({ fillWidth, animating }: ProgressBarProps) {
  return (
    <Bar>
      <Fill $width={fillWidth} $animating={animating} />
      {DURATIONS.slice(0, -1).map((_, i) => (
        <Marker key={i} $left={CUM_FILL[i] * 100} />
      ))}
    </Bar>
  );
}
