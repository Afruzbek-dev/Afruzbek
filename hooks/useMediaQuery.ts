
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const isSsr = typeof window === 'undefined';

  const [matches, setMatches] = useState(
    isSsr ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    if (isSsr) return;

    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener); 
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query, isSsr]);

  return matches;
}
