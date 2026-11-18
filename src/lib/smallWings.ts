import { useSyncExternalStore } from 'react';

/**
 * True once the shared WebGL overlay draws the small butterflies (companions + travellers).
 * Their CSS fallbacks stop rendering (and stop their own animation loops) at that point.
 */
let ready = false;
const listeners = new Set<() => void>();

export function setSmallWingsReady(value: boolean) {
  if (ready === value) return;
  ready = value;
  listeners.forEach((l) => l());
}

export function useSmallWingsReady(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ready,
    () => false,
  );
}
