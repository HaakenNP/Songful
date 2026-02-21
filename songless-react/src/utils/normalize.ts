export function normalizeGuess(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

export function normalizeSearch(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}
