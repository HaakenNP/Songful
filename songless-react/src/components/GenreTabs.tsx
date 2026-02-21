import styled from 'styled-components';
import { GENRE_ORDER, GENRE_LABELS } from '../data/songs';
import type { Genre, GameResult } from '../types';

const TabsWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 16px 4px;
`;

const Tabs = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${p => p.theme.bd};
`;

const Tab = styled.button<{ $active: boolean; $done: boolean; $locked: boolean }>`
  padding: 7px 20px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
  background: ${p => p.$active ? p.theme.sfL : 'transparent'};
  color: ${p => p.$done ? p.theme.acD : p.$active ? p.theme.wh : p.theme.txM};
  opacity: ${p => p.$locked ? 0.4 : 1};
  cursor: ${p => p.$locked ? 'default' : 'pointer'};

  @media (max-width: 480px) {
    padding: 7px 14px;
    font-size: 13px;
  }
`;

interface GenreTabsProps {
  activeGenre: Genre;
  results: Partial<Record<Genre, GameResult>>;
  onSwitch: (genre: Genre) => void;
}

export default function GenreTabs({ activeGenre, results, onSwitch }: GenreTabsProps) {
  return (
    <TabsWrap>
      <Tabs>
        {GENRE_ORDER.map(g => {
          const isActive = g === activeGenre;
          const isDone = !!results[g];
          const isLocked = !isDone && !isActive;

          let label = GENRE_LABELS[g];
          if (isDone) {
            label += results[g] === 'won' ? ' \u2713' : ' \u2717';
          }

          return (
            <Tab
              key={g}
              $active={isActive}
              $done={isDone}
              $locked={isLocked}
              onClick={() => {
                if (isDone && !isActive) onSwitch(g);
              }}
            >
              {label}
            </Tab>
          );
        })}
      </Tabs>
    </TabsWrap>
  );
}
