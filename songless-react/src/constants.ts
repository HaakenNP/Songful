export const DURATIONS: number[] = [0.1, 0.25, 0.5, 1, 2, 4];
export const MAX_DURATION = 16;
export const MAX_STEPS = 6;

export const CUM_FILL: number[] = DURATIONS.map((_, i) =>
  DURATIONS.slice(0, i + 1).reduce((a, b) => a + b, 0) / MAX_DURATION
);

export const LS_STATS_KEY = 'songless_stats';
export const LS_DAILY_KEY = 'songless_daily';
