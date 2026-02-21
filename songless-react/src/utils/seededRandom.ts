import { SONG_DB } from '../data/songs';
import type { Genre, Song } from '../types';

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function pickSong(genre: Genre, seed: number): Song {
  const rng = seededRandom(seed + genre.charCodeAt(0) * 137);
  const pool = SONG_DB[genre];
  return { ...pool[Math.floor(rng() * pool.length)] };
}

export function getDailyKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
