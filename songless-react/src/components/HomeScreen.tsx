import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import { useStats, useDailyStorage } from '../hooks/useLocalStorage';
import { GENRE_ORDER, GENRE_LABELS } from '../data/songs';
import type { Genre, GameMode } from '../types';

const Screen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-family: ${p => p.theme.fontMono};
  font-size: 48px;
  font-weight: 700;
  color: ${p => p.theme.wh};
  margin-bottom: 8px;
  letter-spacing: -1px;

  @media (max-width: 480px) { font-size: 36px; }
  @media (max-width: 360px) { font-size: 30px; }
`;

const Sub = styled.p`
  color: ${p => p.theme.txM};
  font-size: 15px;
  margin-bottom: 44px;
`;

const Btns = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
`;

const Btn = styled.button<{ $primary?: boolean }>`
  padding: 15px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  transition: transform 0.1s;
  background: ${p => p.$primary ? p.theme.ac : p.theme.sf};
  color: ${p => p.$primary ? '#000' : p.theme.tx};
  ${p => !p.$primary && `border: 1px solid ${p.theme.bd};`}

  &:active { transform: scale(0.97); }
`;

const StatsRow = styled.div`
  margin-top: 36px;
  display: flex;
  gap: 28px;
  text-align: center;

  @media (max-width: 360px) { gap: 18px; }
`;

const StatVal = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${p => p.theme.wh};

  @media (max-width: 360px) { font-size: 20px; }
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${p => p.theme.txM};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DailyBanner = styled.div`
  background: ${p => p.theme.sf};
  border: 1px solid ${p => p.theme.bd};
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
  text-align: center;
  max-width: 320px;
  width: 100%;
`;

const BannerCheck = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`;

const BannerMsg = styled.div`
  color: ${p => p.theme.acD};
  font-size: 14px;
  font-weight: 600;
`;

const BannerSub = styled.div`
  color: ${p => p.theme.txM};
  font-size: 12px;
  margin-top: 4px;
`;

const Note = styled.p`
  color: ${p => p.theme.txM};
  font-size: 11px;
  margin-top: 36px;
  opacity: 0.4;
  max-width: 280px;
`;

/* Genre Picker Styles */
const PickerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
`;

const PickerCard = styled.div`
  background: ${p => p.theme.bg};
  border: 1px solid ${p => p.theme.bd};
  border-radius: 16px;
  padding: 28px 24px;
  max-width: 380px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
`;

const PickerTitle = styled.h2`
  font-family: ${p => p.theme.fontMono};
  font-size: 20px;
  font-weight: 700;
  color: ${p => p.theme.wh};
  margin-bottom: 4px;
  text-align: center;
`;

const PickerSub = styled.p`
  color: ${p => p.theme.txM};
  font-size: 13px;
  margin-bottom: 20px;
  text-align: center;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;
`;

const GenreChip = styled.button<{ $selected: boolean }>`
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${p => p.$selected ? p.theme.ac : p.theme.bd};
  background: ${p => p.$selected ? 'rgba(74, 222, 128, 0.12)' : p.theme.sf};
  color: ${p => p.$selected ? p.theme.ac : p.theme.tx};
  transition: all 0.15s;
  text-align: center;

  &:active { transform: scale(0.96); }
`;

const PickerActions = styled.div`
  display: flex;
  gap: 10px;
`;

const PickerBtn = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  border: none;
  background: ${p => p.$primary ? p.theme.ac : p.theme.sf};
  color: ${p => p.$primary ? '#000' : p.theme.tx};
  ${p => !p.$primary && `border: 1px solid ${p.theme.bd};`}
  opacity: ${p => p.disabled ? 0.4 : 1};
  cursor: ${p => p.disabled ? 'default' : 'pointer'};

  &:active { transform: ${p => p.disabled ? 'none' : 'scale(0.97)'}; }
`;

const SelectAllRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const SelectLink = styled.button`
  background: none;
  border: none;
  color: ${p => p.theme.acD};
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
`;

export default function HomeScreen() {
  const { startSession, showCompletedDaily } = useGame();
  const { stats } = useStats();
  const { loadDailyState, isDailyComplete } = useDailyStorage();

  const [pickerMode, setPickerMode] = useState<GameMode | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([...GENRE_ORDER]);

  const toggleGenre = (g: Genre) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const handleStartGame = () => {
    if (!pickerMode || selectedGenres.length === 0) return;

    // Maintain the order from GENRE_ORDER
    const orderedGenres = GENRE_ORDER.filter(g => selectedGenres.includes(g));

    if (pickerMode === 'daily') {
      const saved = loadDailyState();
      if (saved && orderedGenres.every(g => saved.results[g])) {
        showCompletedDaily(saved.results, orderedGenres);
      } else {
        startSession('daily', saved?.results, orderedGenres);
      }
    } else {
      startSession('unlimited', undefined, orderedGenres);
    }
    setPickerMode(null);
  };

  const dailyComplete = isDailyComplete();

  return (
    <Screen>
      <Title>Songful</Title>
      <Sub>Guess the song from a tiny snippet</Sub>
      <Btns>
        <Btn $primary onClick={() => setPickerMode('daily')}>Daily Songful</Btn>
        <Btn onClick={() => setPickerMode('unlimited')}>Unlimited Play</Btn>
      </Btns>

      {stats.p > 0 && (
        <StatsRow>
          <div><StatVal>{stats.p}</StatVal><StatLabel>Played</StatLabel></div>
          <div><StatVal>{stats.w}</StatVal><StatLabel>Won</StatLabel></div>
          <div><StatVal>{stats.s}</StatVal><StatLabel>Streak</StatLabel></div>
        </StatsRow>
      )}

      {dailyComplete && (
        <DailyBanner>
          <BannerCheck>{'\u2713'}</BannerCheck>
          <BannerMsg>Daily complete!</BannerMsg>
          <BannerSub>Come back tomorrow for a new challenge</BannerSub>
        </DailyBanner>
      )}

      <Note>&#127925; Uses real 30-second song previews via Deezer</Note>

      {pickerMode && (
        <PickerOverlay onClick={() => setPickerMode(null)}>
          <PickerCard onClick={e => e.stopPropagation()}>
            <PickerTitle>
              {pickerMode === 'daily' ? 'Daily Songful' : 'Unlimited Play'}
            </PickerTitle>
            <PickerSub>Select the genres you want to play</PickerSub>
            <SelectAllRow>
              <SelectLink onClick={() => setSelectedGenres([...GENRE_ORDER])}>Select All</SelectLink>
              <SelectLink onClick={() => setSelectedGenres([])}>Clear All</SelectLink>
            </SelectAllRow>
            <GenreGrid>
              {GENRE_ORDER.map(g => (
                <GenreChip
                  key={g}
                  $selected={selectedGenres.includes(g)}
                  onClick={() => toggleGenre(g)}
                >
                  {selectedGenres.includes(g) ? '\u2713 ' : ''}{GENRE_LABELS[g]}
                </GenreChip>
              ))}
            </GenreGrid>
            <PickerActions>
              <PickerBtn onClick={() => setPickerMode(null)}>Cancel</PickerBtn>
              <PickerBtn
                $primary
                disabled={selectedGenres.length === 0}
                onClick={handleStartGame}
              >
                Play ({selectedGenres.length})
              </PickerBtn>
            </PickerActions>
          </PickerCard>
        </PickerOverlay>
      )}
    </Screen>
  );
}
