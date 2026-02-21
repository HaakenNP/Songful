import { useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import { useAudio } from '../hooks/useAudio';
import { useDeezer } from '../hooks/useDeezer';
import { useSuggestions } from '../hooks/useSuggestions';
import { useStats, useDailyStorage } from '../hooks/useLocalStorage';
import GameHeader from './GameHeader';
import GenreTabs from './GenreTabs';
import GuessRows from './GuessRows';
import ResultPanel from './ResultPanel';
import PlaybackArea from './PlaybackArea';
import LoadingSpinner from './LoadingSpinner';
import SearchInput from './SearchInput';
import type { Genre } from '../types';

const Screen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 16px 0;
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
`;

const Spacer = styled.div`
  flex: 1;
  min-height: 20px;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;
  position: relative;
  padding-bottom: 16px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const SkipBtn = styled.button`
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid ${p => p.theme.bd};
  background: ${p => p.theme.sf};
  color: ${p => p.theme.tx};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover { background: ${p => p.theme.sfL}; }

  @media (max-width: 480px) {
    padding: 0 14px;
    font-size: 13px;
  }
`;

export default function GameScreen() {
  const { state, dispatch, startSession } = useGame();
  const { mode, activeGenre, selectedGenres, songs, step, hist, gameState, results, currentPreviewUrl, previewLoading, previewError } = state;
  const audio = useAudio();
  const { fetchPreview } = useDeezer();
  const suggestions = useSuggestions();
  const { updateStats } = useStats();
  const { saveDailyState } = useDailyStorage();
  const previewCacheRef = useRef<Record<string, string>>({});
  const prevGameStateRef = useRef(gameState);

  const song = songs[activeGenre];
  const isGameOver = gameState === 'won' || gameState === 'lost';
  const isCompletedView = isGameOver && !hist.length && !!results[activeGenre];

  // Load song preview when genre changes or on mount
  const loadPreview = useCallback(async () => {
    if (!song) return;
    const genre = activeGenre;

    // Check cache
    if (previewCacheRef.current[genre]) {
      const url = previewCacheRef.current[genre];
      dispatch({ type: 'SET_PREVIEW', payload: url });
      audio.loadSrc(url);
      return;
    }

    dispatch({ type: 'SET_PREVIEW_LOADING', payload: true });

    let url = await fetchPreview(song.title, song.artist);
    if (!url) url = await fetchPreview(song.title, '');

    if (url) {
      previewCacheRef.current[genre] = url;
      dispatch({ type: 'SET_PREVIEW', payload: url });
      audio.loadSrc(url);
    } else {
      dispatch({ type: 'SET_PREVIEW_ERROR' });
    }
  }, [song, activeGenre, fetchPreview, dispatch, audio]);

  // Load preview when activeGenre or songs change, but only if playing
  useEffect(() => {
    if (gameState === 'playing' && song && !isCompletedView) {
      loadPreview();
    }
  }, [activeGenre, song]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update progress bar when step changes
  useEffect(() => {
    audio.setProgressForStep(step, gameState);
  }, [step, gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play full song when game just ended
  useEffect(() => {
    if (prevGameStateRef.current === 'playing' && isGameOver && currentPreviewUrl) {
      audio.playFull();

      // Save stats
      updateStats(gameState === 'won');
      if (mode === 'daily') saveDailyState(results);
    }
    prevGameStateRef.current = gameState;
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = useCallback(() => {
    if (!currentPreviewUrl) return;
    if (audio.isPlaying) {
      audio.pause();
    } else {
      audio.play(step);
    }
  }, [currentPreviewUrl, audio, step]);

  const handleSkip = useCallback(() => {
    if (gameState !== 'playing') return;
    audio.stop();
    dispatch({ type: 'SKIP' });
  }, [gameState, audio, dispatch]);

  const handleGuess = useCallback((text: string) => {
    if (!text.trim() || gameState !== 'playing') return;
    audio.stop();
    dispatch({ type: 'SUBMIT_GUESS', payload: { text } });
    suggestions.setQuery('');
    suggestions.close();
  }, [gameState, audio, dispatch, suggestions]);

  const handleSuggestionSelect = useCallback((title: string) => {
    suggestions.setQuery(title);
    suggestions.close();
    setTimeout(() => handleGuess(title), 30);
  }, [suggestions, handleGuess]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    suggestions.handleKeyDown(e, handleSuggestionSelect, handleGuess);
  }, [suggestions, handleSuggestionSelect, handleGuess]);

  const handleHome = useCallback(() => {
    audio.stop();
    dispatch({ type: 'GO_HOME' });
  }, [audio, dispatch]);

  const handleShuffle = useCallback(() => {
    audio.stop();
    previewCacheRef.current = {};
    startSession('unlimited', undefined, selectedGenres);
  }, [audio, startSession, selectedGenres]);

  const handleAdvance = useCallback((genre: Genre) => {
    audio.stop();
    dispatch({ type: 'ADVANCE_GENRE', payload: genre });
  }, [audio, dispatch]);

  // Load preview after advance
  useEffect(() => {
    if (gameState === 'playing' && !currentPreviewUrl && !previewLoading && !previewError && song) {
      loadPreview();
    }
  }, [gameState, currentPreviewUrl, previewLoading, previewError, song, loadPreview]);

  const handleSwitchGenre = useCallback((genre: Genre) => {
    audio.stop();
    dispatch({ type: 'SWITCH_GENRE', payload: genre });
  }, [audio, dispatch]);

  const handleRetry = useCallback(() => {
    loadPreview();
  }, [loadPreview]);

  const handleNewGame = useCallback(() => {
    audio.stop();
    previewCacheRef.current = {};
    startSession('unlimited', undefined, selectedGenres);
  }, [audio, startSession, selectedGenres]);

  // Check if viewing a completed genre (not the one being actively played)
  const viewingCompleted = results[activeGenre] && (isCompletedView || (isGameOver && hist.length > 0));

  return (
    <Screen>
      <GameHeader mode={mode} onHome={handleHome} onShuffle={handleShuffle} />
      <GenreTabs activeGenre={activeGenre} results={results} selectedGenres={selectedGenres} onSwitch={handleSwitchGenre} />

      <Body>
        {/* Viewing a previously completed genre */}
        {isCompletedView && song && (
          <ResultPanel
            song={song}
            gameState={results[activeGenre] === 'won' ? 'won' : 'lost'}
            results={results}
            mode={mode}
            activeGenre={activeGenre}
            selectedGenres={selectedGenres}
            onAdvance={handleAdvance}
            onNewGame={handleNewGame}
            onHome={handleHome}
          />
        )}

        {/* Active game or just-finished game */}
        {!isCompletedView && (
          <>
            <GuessRows hist={hist} gameState={gameState} />

            {isGameOver && song && (
              <ResultPanel
                song={song}
                gameState={gameState}
                results={results}
                mode={mode}
                activeGenre={activeGenre}
                selectedGenres={selectedGenres}
                onAdvance={handleAdvance}
                onNewGame={handleNewGame}
                onHome={handleHome}
              />
            )}

            <Spacer />

            {previewLoading && <LoadingSpinner />}

            {!previewLoading && !isGameOver && (
              <PlaybackArea
                step={step}
                isPlaying={audio.isPlaying}
                fillWidth={audio.fillWidth}
                animating={audio.animating}
                previewError={previewError}
                onPlay={handlePlay}
                onRetry={handleRetry}
              />
            )}

            {gameState === 'playing' && (
              <Controls>
                <SearchInput
                  query={suggestions.query}
                  matches={suggestions.matches}
                  highlightIndex={suggestions.highlightIndex}
                  isOpen={suggestions.isOpen}
                  onInputChange={suggestions.updateQuery}
                  onKeyDown={handleKeyDown}
                  onSelect={handleSuggestionSelect}
                  onClose={suggestions.close}
                />
                <SkipBtn onClick={handleSkip}>Skip</SkipBtn>
              </Controls>
            )}
          </>
        )}
      </Body>
    </Screen>
  );
}
