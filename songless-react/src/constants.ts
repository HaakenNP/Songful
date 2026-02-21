export const DURATIONS: number[] = [0.1, 0.25, 0.5, 1, 2, 4];
export const MAX_DURATION = 16;
export const MAX_STEPS = 6;

// Evenly spaced markers — each step fills 1/6 of the bar regardless of actual duration
export const CUM_FILL: number[] = DURATIONS.map((_, i) => (i + 1) / MAX_STEPS);

export const LS_STATS_KEY = 'songless_stats';
export const LS_DAILY_KEY = 'songless_daily';
