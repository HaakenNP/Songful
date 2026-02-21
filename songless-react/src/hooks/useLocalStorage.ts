import { useState, useCallback } from 'react';
import { LS_STATS_KEY, LS_DAILY_KEY } from '../constants';
import { GENRE_ORDER } from '../data/songs';
import { getDailyKey } from '../utils/seededRandom';
import type { Stats, DailyState, Genre, GameResult } from '../types';

function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch (e) { /* ignore */ }
  return fallback;
}

function saveToLS<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(() => loadFromLS<Stats>(LS_STATS_KEY, { p: 0, w: 0, s: 0 }));

  const updateStats = useCallback((won: boolean) => {
    setStats(prev => {
      const next: Stats = {
        p: prev.p + 1,
        w: won ? prev.w + 1 : prev.w,
        s: won ? prev.s + 1 : 0,
      };
      saveToLS(LS_STATS_KEY, next);
      return next;
    });
  }, []);

  return { stats, updateStats };
}

export function useDailyStorage() {
  const loadDailyState = useCallback((): DailyState | null => {
    const data = loadFromLS<DailyState | null>(LS_DAILY_KEY, null);
    if (data && data.day === getDailyKey()) return data;
    return null;
  }, []);

  const saveDailyState = useCallback((results: Partial<Record<Genre, GameResult>>) => {
    saveToLS<DailyState>(LS_DAILY_KEY, { day: getDailyKey(), results });
  }, []);

  const isDailyComplete = useCallback((): boolean => {
    const state = loadDailyState();
    if (!state) return false;
    return GENRE_ORDER.every(g => state.results[g]);
  }, [loadDailyState]);

  return { loadDailyState, saveDailyState, isDailyComplete };
}
