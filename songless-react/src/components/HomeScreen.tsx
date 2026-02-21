import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import { useStats, useDailyStorage } from '../hooks/useLocalStorage';
import { GENRE_ORDER } from '../data/songs';

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

export default function HomeScreen() {
  const { startSession, showCompletedDaily } = useGame();
  const { stats } = useStats();
  const { loadDailyState, isDailyComplete } = useDailyStorage();

  const handleDaily = () => {
    const saved = loadDailyState();
    if (saved && GENRE_ORDER.every(g => saved.results[g])) {
      showCompletedDaily(saved.results);
    } else {
      startSession('daily', saved?.results);
    }
  };

  const handleUnlimited = () => {
    startSession('unlimited');
  };

  const dailyComplete = isDailyComplete();

  return (
    <Screen>
      <Title>Songful</Title>
      <Sub>Guess the song from a tiny snippet</Sub>
      <Btns>
        <Btn $primary onClick={handleDaily}>Daily Songful</Btn>
        <Btn onClick={handleUnlimited}>Unlimited Play</Btn>
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
    </Screen>
  );
}
