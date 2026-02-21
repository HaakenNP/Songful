import { useRef, useCallback } from 'react';
import { normalizeSearch } from '../utils/normalize';

interface DeezerTrack {
  title: string;
  preview: string | null;
  artist?: { name: string };
}

interface DeezerResponse {
  data?: DeezerTrack[];
}

const CORS_PROXIES: Array<(url: string) => string> = [
  url => url,
  url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

export function useDeezer() {
  const proxyIdx = useRef(0);

  const fetchWithRetry = useCallback(async (url: string): Promise<DeezerResponse | null> => {
    const order = [
      proxyIdx.current,
      ...Array.from({ length: CORS_PROXIES.length }, (_, i) => i).filter(i => i !== proxyIdx.current),
    ];
    for (const idx of order) {
      try {
        const proxiedUrl = CORS_PROXIES[idx](url);
        const resp = await fetch(proxiedUrl);
        if (resp.ok) {
          proxyIdx.current = idx;
          return (await resp.json()) as DeezerResponse;
        }
      } catch (e) { /* try next */ }
    }
    return null;
  }, []);

  const fetchPreview = useCallback(async (title: string, artist: string): Promise<string | null> => {
    try {
      const q = encodeURIComponent(`${title} ${artist}`.trim());
      const data = await fetchWithRetry(`https://api.deezer.com/search?q=${q}&limit=5`);
      if (data?.data && data.data.length > 0) {
        const target = normalizeSearch(title);
        const artistNorm = normalizeSearch(artist);

        for (const track of data.data) {
          if (!track.preview) continue;
          const tt = normalizeSearch(track.title);
          const ta = normalizeSearch(track.artist?.name || '');
          if ((tt.includes(target) || target.includes(tt)) &&
              (ta.includes(artistNorm) || artistNorm.includes(ta))) {
            return track.preview;
          }
        }
        for (const track of data.data) {
          if (!track.preview) continue;
          const tt = normalizeSearch(track.title);
          if (tt.includes(target) || target.includes(tt)) {
            return track.preview;
          }
        }
        const withPreview = data.data.find(t => t.preview);
        if (withPreview) return withPreview.preview;
      }
      return null;
    } catch (e) {
      console.error('Deezer fetch failed:', e);
      return null;
    }
  }, [fetchWithRetry]);

  return { fetchPreview };
}
