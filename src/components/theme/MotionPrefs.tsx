'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface MotionPrefsValue {
  /** OS-level "reduce motion" preference. */
  reduced: boolean;
  /** Visitor paused ambient animation with the hero play/pause button. */
  paused: boolean;
  /** Decorative animation should run. */
  animate: boolean;
  togglePaused: () => void;
}

const MotionPrefsContext = createContext<MotionPrefsValue | null>(null);
/**
 * Legacy key: the pause used to be saved permanently, so a single (even accidental) click froze
 * every animation on all later visits. Pausing now lasts for the current page view only, and
 * the old saved flag is removed.
 */
const LEGACY_KEY = 'ranim-ambient-paused';

export function MotionPrefsProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignore */
    }
    return () => mq.removeEventListener('change', update);
  }, []);

  const togglePaused = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  const value = useMemo(
    () => ({ reduced, paused, animate: !reduced && !paused, togglePaused }),
    [reduced, paused, togglePaused],
  );

  return <MotionPrefsContext.Provider value={value}>{children}</MotionPrefsContext.Provider>;
}

export function useMotionPrefs(): MotionPrefsValue {
  const ctx = useContext(MotionPrefsContext);
  if (!ctx) throw new Error('useMotionPrefs must be used inside <MotionPrefsProvider>');
  return ctx;
}
