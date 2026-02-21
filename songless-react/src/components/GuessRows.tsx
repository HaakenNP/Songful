import styled from 'styled-components';
import { MAX_STEPS } from '../constants';
import type { HistEntry, GameStateValue } from '../types';

type RowVariant = '' | 'current' | 'skip' | 'correct' | 'wrong';

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

const Row = styled.div<{ $variant: RowVariant }>`
  height: 42px;
  border-radius: 7px;
  border: 1px solid ${p => p.theme.bd};
  background: ${p => p.theme.sf};
  display: flex;
  align-items: center;
  padding: 0 14px;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;

  ${p => p.$variant === 'current' && `
    border-color: rgba(255, 255, 255, 0.18);
  `}
  ${p => p.$variant === 'skip' && `
    background: rgba(255, 255, 255, 0.015);
    color: #4a4a5a;
  `}
  ${p => p.$variant === 'correct' && `
    background: rgba(74, 222, 128, 0.1);
    border-color: ${p.theme.acD};
    color: ${p.theme.ac};
  `}
  ${p => p.$variant === 'wrong' && `
    background: rgba(239, 68, 68, 0.07);
    border-color: rgba(239, 68, 68, 0.25);
    color: ${p.theme.wr};
  `}

  @media (max-width: 480px) {
    height: 38px;
    font-size: 13px;
    padding: 0 10px;
  }
`;

const Icon = styled.span<{ $color: string }>`
  font-weight: 700;
  margin-right: 8px;
  font-size: 13px;
  color: ${p => p.$color};
`;

interface GuessRowsProps {
  hist: HistEntry[];
  gameState: GameStateValue;
}

export default function GuessRows({ hist, gameState }: GuessRowsProps) {
  return (
    <Rows>
      {Array.from({ length: MAX_STEPS }, (_, i) => {
        const entry = hist[i];
        let variant: RowVariant = '';
        let content: React.ReactNode = null;

        if (entry) {
          variant = entry.type;
          if (entry.type === 'correct') {
            content = <><Icon $color="var(--ac, #4ade80)">{'\u2713'}</Icon>{entry.text}</>;
          } else if (entry.type === 'wrong') {
            content = <><Icon $color="var(--wr, #ef4444)">{'\u2717'}</Icon>{entry.text}</>;
          } else {
            content = 'Skipped';
          }
        } else if (i === hist.length && gameState === 'playing') {
          variant = 'current';
        }

        return <Row key={i} $variant={variant}>{content}</Row>;
      })}
    </Rows>
  );
}
