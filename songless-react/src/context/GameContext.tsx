import { createContext, useContext, useReducer, useCallback, type ReactNode, type Dispatch } from 'react';
import { GENRE_ORDER } from '../data/songs';
import { MAX_STEPS } from '../constants';
import { pickSong, getDailySeed } from '../utils/seededRandom';
import { normalizeGuess } from '../utils/normalize';
import type { GameState, GameAction, GameMode, GameResult, Genre, Song } from '../types';

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  startSession: (mode: GameMode, savedResults?: Partial<Record<Genre, GameResult>>) => { songs: Record<Genre, Song>; activeGenre: Genre };
  showCompletedDaily: (savedResults: Partial<Record<Genre, GameResult>>) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const initialState: GameState = {
  screen: 'home',
  mode: null,
  activeGenre: 'all',
  songs: {},
  step: 0,
  hist: [],
  gameState: 'playing',
  results: {},
  currentPreviewUrl: null,
  previewLoading: false,
  previewError: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO_HOME':
      return { ...state, screen: 'home' };

    case 'START_SESSION': {
      const { mode, songs, results, activeGenre } = action.payload;
      return {
        ...initialState,
        screen: 'game',
        mode,
        songs,
        results: results || {},
        activeGenre: activeGenre || 'all',
      };
    }

    case 'SHOW_COMPLETED_DAILY': {
      const { songs, results } = action.payload;
      return {
        ...initialState,
        screen: 'game',
        mode: 'daily',
        songs,
        results,
        activeGenre: 'all',
        gameState: 'lost', // doesn't matter, just not 'playing'
      };
    }

    case 'RESET_ROUND':
      return {
        ...state,
        step: 0,
        hist: [],
        gameState: 'playing',
        currentPreviewUrl: null,
        previewLoading: false,
        previewError: false,
      };

    case 'SET_PREVIEW':
      return { ...state, currentPreviewUrl: action.payload, previewLoading: false, previewError: false };

    case 'SET_PREVIEW_LOADING':
      return { ...state, previewLoading: action.payload };

    case 'SET_PREVIEW_ERROR':
      return { ...state, previewError: true, previewLoading: false };

    case 'SKIP': {
      const newHist = [...state.hist, { type: 'skip' as const, step: state.step }];
      if (state.step >= MAX_STEPS - 1) {
        return {
          ...state,
          hist: newHist,
          gameState: 'lost',
          results: { ...state.results, [state.activeGenre]: 'lost' as const },
        };
      }
      return { ...state, hist: newHist, step: state.step + 1 };
    }

    case 'SUBMIT_GUESS': {
      const { text } = action.payload;
      const song = state.songs[state.activeGenre];
      const isCorrect = song ? normalizeGuess(text) === normalizeGuess(song.title) : false;

      if (isCorrect) {
        return {
          ...state,
          hist: [...state.hist, { type: 'correct' as const, text, step: state.step }],
          gameState: 'won',
          results: { ...state.results, [state.activeGenre]: 'won' as const },
        };
      }

      const newHist = [...state.hist, { type: 'wrong' as const, text, step: state.step }];
      if (state.step >= MAX_STEPS - 1) {
        return {
          ...state,
          hist: newHist,
          gameState: 'lost',
          results: { ...state.results, [state.activeGenre]: 'lost' as const },
        };
      }
      return { ...state, hist: newHist, step: state.step + 1 };
    }

    case 'SWITCH_GENRE':
      return { ...state, activeGenre: action.payload };

    case 'ADVANCE_GENRE': {
      const g = action.payload;
      return {
        ...state,
        activeGenre: g,
        step: 0,
        hist: [],
        gameState: 'playing',
        currentPreviewUrl: null,
        previewLoading: false,
        previewError: false,
      };
    }

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startSession = useCallback((mode: GameMode, savedResults?: Partial<Record<Genre, GameResult>>) => {
    const seed = mode === 'daily' ? getDailySeed() : Math.floor(Math.random() * 999999);
    const songs = {} as Record<Genre, Song>;
    GENRE_ORDER.forEach(g => {
      songs[g] = pickSong(g, seed + g.charCodeAt(0) * 100);
    });

    const results = savedResults || {};
    const activeGenre = GENRE_ORDER.find(g => !results[g]) || 'all';

    dispatch({
      type: 'START_SESSION',
      payload: { mode, songs, results, activeGenre },
    });

    return { songs, activeGenre };
  }, []);

  const showCompletedDaily = useCallback((savedResults: Partial<Record<Genre, GameResult>>) => {
    const seed = getDailySeed();
    const songs = {} as Record<Genre, Song>;
    GENRE_ORDER.forEach(g => {
      songs[g] = pickSong(g, seed + g.charCodeAt(0) * 100);
    });
    dispatch({ type: 'SHOW_COMPLETED_DAILY', payload: { songs, results: savedResults } });
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, startSession, showCompletedDaily }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
