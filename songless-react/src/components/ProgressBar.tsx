import styled from 'styled-components';
import { CUM_FILL, CUM_DURATIONS, MAX_STEPS } from '../constants';

/* ── Outer track — represents 0 → 15 seconds ────────────────── */
const Track = styled.div`
  position: relative;
  height: 28px;
  border-radius: 6px;
  background: #15151e;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

/* ── Green fill — grows from 0 to show elapsed time ──────────── */
const Fill = styled.div<{ $width: number; $animating: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${p => p.$width}%;
  background: linear-gradient(
    90deg,
    ${p => p.theme.ac} 0%,
    ${p => p.theme.acD} 100%
  );
  z-index: 1;
  transition: ${p => (p.$animating ? 'none' : 'width 0.3s ease')};
  border-radius: 5px 0 0 5px;
`;

/* ── Step boundary marker lines ──────────────────────────────── */
const Marker = styled.div<{ $left: number; $past: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  left: ${p => p.$left}%;
  background: ${p => p.$past ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.1)'};
  z-index: 2;
`;

/* ── Labels row below the bar ────────────────────────────────── */
const Labels = styled.div`
  position: relative;
  height: 16px;
  margin-top: 3px;
`;

const Label = styled.span<{ $left: number; $active: boolean; $past: boolean }>`
  position: absolute;
  left: ${p => p.$left}%;
  transform: translateX(-50%);
  font-family: ${p => p.theme.fontMono};
  font-size: 9px;
  font-weight: 600;
  color: ${p =>
    p.$active
      ? '#fff'
      : p.$past
        ? p.theme.ac
        : 'rgba(255, 255, 255, 0.25)'};
  transition: color 0.2s;
  user-select: none;
`;

/* ── Component ───────────────────────────────────────────────── */
interface ProgressBarProps {
  fillWidth: number;
  animating: boolean;
  step: number;
}

export default function ProgressBar({ fillWidth, animating, step }: ProgressBarProps) {
  return (
    <div>
      <Track>
        <Fill $width={fillWidth} $animating={animating} />
        {/* Marker lines at each step boundary (skip the last — it's the end of the bar) */}
        {CUM_DURATIONS.slice(0, -1).map((_, i) => {
          const leftPct = CUM_FILL[i] * 100;
          const isPast = fillWidth >= leftPct;
          return <Marker key={i} $left={leftPct} $past={isPast} />;
        })}
      </Track>
      <Labels>
        {/* "0" at the start */}
        <Label $left={0} $active={step === 0} $past={false}>0s</Label>
        {/* Step milestones */}
        {CUM_DURATIONS.map((t, i) => {
          const leftPct = CUM_FILL[i] * 100;
          const isPast = i < step;
          const isActive = i === step;
          // Clamp last label so it doesn't overflow
          const clampedLeft = i === MAX_STEPS - 1 ? Math.min(leftPct, 98) : leftPct;
          return (
            <Label key={i} $left={clampedLeft} $active={isActive} $past={isPast}>
              {t}s
            </Label>
          );
        })}
      </Labels>
    </div>
  );
}
