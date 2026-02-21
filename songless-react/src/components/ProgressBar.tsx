import styled from 'styled-components';
import { CUM_FILL, DURATIONS, CUM_DURATIONS, MAX_DURATION } from '../constants';

/* ── Outer track ─────────────────────────────────────────────── */
const Track = styled.div`
  position: relative;
  height: 32px;
  border-radius: 6px;
  background: #15151e;
  overflow: hidden;
  margin-bottom: 6px;
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

/* ── Individual segment cell (proportional width) ────────────── */
const SegmentCell = styled.div<{ $widthPct: number; $isLast: boolean }>`
  position: relative;
  width: ${p => p.$widthPct}%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${p => !p.$isLast && `border-right: 1px solid rgba(255, 255, 255, 0.08);`}
`;

/* ── Duration label inside each segment ──────────────────────── */
const SegLabel = styled.span<{ $active: boolean; $filled: boolean; $tiny: boolean }>`
  position: relative;
  z-index: 3;
  font-family: ${p => p.theme.fontMono};
  font-size: ${p => p.$tiny ? '8px' : '10px'};
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${p =>
    p.$filled
      ? 'rgba(0, 0, 0, 0.7)'
      : p.$active
        ? 'rgba(255, 255, 255, 0.9)'
        : 'rgba(255, 255, 255, 0.22)'};
  white-space: nowrap;
  user-select: none;
  transition: color 0.2s;
`;

/* ── Green fill overlay (absolute, fills proportionally) ──────── */
const FillOverlay = styled.div<{ $width: number; $animating: boolean }>`
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

/* ── Step dots row below bar ─────────────────────────────────── */
const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 2px 0 0;
`;

const Dot = styled.div<{ $state: 'past' | 'current' | 'future' }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transition: all 0.25s;
  background: ${p =>
    p.$state === 'past'
      ? p.theme.ac
      : p.$state === 'current'
        ? '#fff'
        : 'rgba(255, 255, 255, 0.12)'};
  ${p => p.$state === 'current' && `
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
  `}
`;

/* ── Helpers ──────────────────────────────────────────────────── */
function fmtDur(d: number): string {
  if (d < 1) return `${d}s`;
  return `${d}s`;
}

/* ── Component ───────────────────────────────────────────────── */
interface ProgressBarProps {
  fillWidth: number;
  animating: boolean;
  step: number;
}

export default function ProgressBar({ fillWidth, animating, step }: ProgressBarProps) {
  // Each segment's proportional width based on its delta duration
  const segWidths = DURATIONS.map(d => (d / MAX_DURATION) * 100);

  return (
    <>
      <Track>
        <FillOverlay $width={fillWidth} $animating={animating} />
        {DURATIONS.map((_, i) => {
          const segEnd = CUM_FILL[i] * 100;
          const isFilled = fillWidth >= segEnd;
          const isActive = i === step;
          const isTiny = segWidths[i] < 4;

          return (
            <SegmentCell key={i} $widthPct={segWidths[i]} $isLast={i === DURATIONS.length - 1}>
              <SegLabel $active={isActive} $filled={isFilled} $tiny={isTiny}>
                {fmtDur(CUM_DURATIONS[i])}
              </SegLabel>
            </SegmentCell>
          );
        })}
      </Track>
      <DotsRow>
        {DURATIONS.map((_, i) => (
          <Dot
            key={i}
            $state={i < step ? 'past' : i === step ? 'current' : 'future'}
          />
        ))}
      </DotsRow>
    </>
  );
}
