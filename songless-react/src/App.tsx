import { ThemeProvider } from 'styled-components';
import theme from './theme';
import GlobalStyles from './GlobalStyles';
import { GameProvider, useGame } from './context/GameContext';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';

function ScreenRouter() {
  const { state } = useGame();

  if (state.screen === 'game') {
    return <GameScreen />;
  }
  return <HomeScreen />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GameProvider>
        <ScreenRouter />
      </GameProvider>
    </ThemeProvider>
  );
}
