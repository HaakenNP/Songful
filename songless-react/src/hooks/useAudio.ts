import { useRef, useState, useCallback, useEffect } from 'react';
import { DURATIONS, MAX_STEPS, CUM_FILL } from '../constants';
import type { GameStateValue } from '../types';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fillWidth, setFillWidth] = useState(0);
  const [animating, setAnimating] = useState(false);

  const clearTimers = useCallback(() => {
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    clearTimers();
    setIsPlaying(false);
    setAnimating(false);
  }, [clearTimers]);

  const pause = useCallback(() => {
    audioRef.current.pause();
    clearTimers();
    setIsPlaying(false);
    setAnimating(false);
  }, [clearTimers]);

  const loadSrc = useCallback((url: string) => {
    if (url) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, []);

  const play = useCallback((step: number) => {
    const dur = DURATIONS[Math.min(step, MAX_STEPS - 1)];
    const startPct = step === 0 ? 0 : CUM_FILL[step - 1] * 100;
    const endPct = CUM_FILL[step] * 100;

    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setAnimating(true);

      const startTime = Date.now();
      const ms = dur * 1000;

      clearTimers();

      playTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / ms, 1);
        setFillWidth(startPct + (endPct - startPct) * progress);
        if (progress >= 1) {
          clearInterval(playTimerRef.current!);
          playTimerRef.current = null;
        }
      }, 20);

      stopTimeoutRef.current = setTimeout(() => {
        audioRef.current.pause();
        setIsPlaying(false);
        setAnimating(false);
        if (playTimerRef.current) {
          clearInterval(playTimerRef.current);
          playTimerRef.current = null;
        }
        setFillWidth(endPct);
        stopTimeoutRef.current = null;
      }, ms);
    }).catch(e => {
      console.error('Play failed:', e);
      setIsPlaying(false);
    });
  }, [clearTimers]);

  const playFull = useCallback(() => {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  const setProgressForStep = useCallback((step: number, gameState: GameStateValue) => {
    setAnimating(false);
    if (gameState !== 'playing') {
      setFillWidth(100);
    } else if (step === 0) {
      setFillWidth(0);
    } else {
      setFillWidth(CUM_FILL[step - 1] * 100);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        pause();
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [pause]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearTimers();
    };
  }, [clearTimers]);

  return {
    isPlaying,
    fillWidth,
    animating,
    play,
    pause,
    stop,
    playFull,
    loadSrc,
    setProgressForStep,
  };
}
