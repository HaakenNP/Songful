export interface Song {
  title: string;
  artist: string;
}

export interface SongDB {
  all: Song[];
  rock: Song[];
  hiphop: Song[];
}

export type Genre = 'all' | 'rock' | 'hiphop';

export type GameResult = 'won' | 'lost';

export type GameMode = 'daily' | 'unlimited';

export type GameStateValue = 'playing' | 'won' | 'lost';

export interface HistEntry {
  type: 'skip' | 'correct' | 'wrong';
  text?: string;
  step: number;
}

export interface GameState {
  screen: 'home' | 'game';
  mode: GameMode | null;
  activeGenre: Genre;
  songs: Partial<Record<Genre, Song>>;
  step: number;
  hist: HistEntry[];
  gameState: GameStateValue;
  results: Partial<Record<Genre, GameResult>>;
  currentPreviewUrl: string | null;
  previewLoading: boolean;
  previewError: boolean;
}

export interface Stats {
  p: number;
  w: number;
  s: number;
}

export interface DailyState {
  day: string;
  results: Partial<Record<Genre, GameResult>>;
}

export type GameAction =
  | { type: 'GO_HOME' }
  | { type: 'START_SESSION'; payload: { mode: GameMode; songs: Record<Genre, Song>; results: Partial<Record<Genre, GameResult>>; activeGenre: Genre } }
  | { type: 'SHOW_COMPLETED_DAILY'; payload: { songs: Record<Genre, Song>; results: Partial<Record<Genre, GameResult>> } }
  | { type: 'RESET_ROUND' }
  | { type: 'SET_PREVIEW'; payload: string }
  | { type: 'SET_PREVIEW_LOADING'; payload: boolean }
  | { type: 'SET_PREVIEW_ERROR' }
  | { type: 'SKIP' }
  | { type: 'SUBMIT_GUESS'; payload: { text: string } }
  | { type: 'SWITCH_GENRE'; payload: Genre }
  | { type: 'ADVANCE_GENRE'; payload: Genre };

export interface Theme {
  bg: string;
  sf: string;
  sfL: string;
  bd: string;
  tx: string;
  txM: string;
  ac: string;
  acD: string;
  wr: string;
  wh: string;
  fontBody: string;
  fontMono: string;
}
