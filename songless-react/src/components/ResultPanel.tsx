import styled from 'styled-components';
import { GENRE_ORDER, GENRE_LABELS } from '../data/songs';
import type { Song, GameStateValue, GameResult, GameMode, Genre } from '../types';

const Wrapper = styled.div`
  text-align: center;
  padding: 12px 0;
  border-top: 1px solid ${p => p.theme.bd};
  margin-bottom: 8px;
`;

const Label = styled.div`
  font-size: 13px;
  color: ${p => p.theme.txM};
  margin-bottom: 2px;
`;

const SongTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${p => p.theme.wh};
`;

const SongArtist = styled.div`
  font-size: 14px;
  color: ${p => p.theme.txM};
  margin-bottom: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  background: ${p => p.theme.ac};
  color: #000;
`;

const SecondaryBtn = styled.button`
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid ${p => p.theme.bd};
  background: ${p => p.theme.sf};
  color: ${p => p.theme.tx};
`;

const DoneMsg = styled.div`
  font-size: 13px;
  color: ${p => p.theme.acD};
  font-weight: 600;
  padding: 8px 0;
`;

interface ResultPanelProps {
  song: Song;
  gameState: GameStateValue;
  results: Partial<Record<Genre, GameResult>>;
  mode: GameMode | null;
  activeGenre: Genre;
  onAdvance: (genre: Genre) => void;
  onNewGame: () => void;
  onHome: () => void;
}

export default function ResultPanel({ song, gameState, results, mode, activeGenre, onAdvance, onNewGame, onHome }: ResultPanelProps) {
  const allDone = GENRE_ORDER.every(g => results[g]);

  // Find next uncompleted genre
  const idx = GENRE_ORDER.indexOf(activeGenre);
  let nextGenre: Genre | null = null;
  for (let i = idx + 1; i < GENRE_ORDER.length; i++) {
    if (!results[GENRE_ORDER[i]]) { nextGenre = GENRE_ORDER[i]; break; }
  }

  return (
    <Wrapper>
      <Label>{gameState === 'won' ? '\uD83C\uDF89 Correct!' : 'The answer was:'}</Label>
      <SongTitle>{song.title}</SongTitle>
      <SongArtist>{song.artist}</SongArtist>
      <Actions>
        {nextGenre && (
          <PrimaryBtn onClick={() => onAdvance(nextGenre)}>
            Next {'\u2192'} {GENRE_LABELS[nextGenre]}
          </PrimaryBtn>
        )}
        {allDone && mode === 'unlimited' && (
          <PrimaryBtn onClick={onNewGame}>&#128256; New Game</PrimaryBtn>
        )}
        {allDone && mode === 'daily' && (
          <DoneMsg>All daily challenges complete! Come back tomorrow.</DoneMsg>
        )}
        <SecondaryBtn onClick={onHome}>Home</SecondaryBtn>
      </Actions>
    </Wrapper>
  );
}
