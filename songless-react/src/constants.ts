// Cumulative time milestones — how much total audio is revealed at each step
export const CUM_DURATIONS: number[] = [0.1, 0.5, 2, 4, 8, 15];

// Per-step play durations (deltas) — how much NEW audio each step adds
export const DURATIONS: number[] = CUM_DURATIONS.map((t, i) =>
  i === 0 ? t : t - CUM_DURATIONS[i - 1]
); // → [0.1, 0.4, 1.5, 2, 4, 7]

export const MAX_DURATION = 15;
export const MAX_STEPS = 6;

// Proportional fill — each segment's width reflects its actual duration (hourglass style)
export const CUM_FILL: number[] = CUM_DURATIONS.map(t => t / MAX_DURATION);

export const LS_STATS_KEY = 'songless_stats';
export const LS_DAILY_KEY = 'songless_daily';
