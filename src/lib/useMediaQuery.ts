'use client';

import { useSyncExternalStore } from 'react';

/** Phones: the layouts of the approved mobile reference apply below this width. */
export const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Live media-query match. The server snapshot is `false`, so the first client render matches
 * the server HTML (no hydration mismatch); the real value follows right after.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
