import { useState, useCallback, useMemo } from 'react';
import { ALL_SONGS_FLAT } from '../data/songs';
import type { Song } from '../types';

export function useSuggestions() {
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const matches: Song[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const seen = new Set<string>();
    const results: Song[] = [];
    for (const s of ALL_SONGS_FLAT) {
      const key = s.title.toLowerCase() + '|' + s.artist.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      if (s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)) {
        results.push(s);
        if (results.length >= 10) break;
      }
    }
    return results;
  }, [query]);

  const updateQuery = useCallback((value: string) => {
    setQuery(value);
    setHighlightIndex(-1);
    setIsOpen(value.trim().length > 0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightIndex(-1);
  }, []);

  const handleKeyDown = useCallback((
    e: React.KeyboardEvent,
    onSelect: (title: string) => void,
    onSubmitRaw: (text: string) => void
  ) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (matches.length > 0) {
        setHighlightIndex(prev => Math.min(prev + 1, matches.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (matches.length > 0) {
        setHighlightIndex(prev => Math.max(prev - 1, 0));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < matches.length) {
        onSelect(matches[highlightIndex].title);
      } else if (query.trim()) {
        onSubmitRaw(query);
      }
    } else if (e.key === 'Escape') {
      close();
    }
  }, [matches, highlightIndex, query, close]);

  return {
    query,
    matches,
    highlightIndex,
    isOpen: isOpen && matches.length > 0,
    updateQuery,
    close,
    handleKeyDown,
    setQuery,
  };
}
