/**
 * Shared state of the hero butterfly's one-time entrance.
 *
 * HeroButterfly drives it with a GSAP timeline; the WebGL / CSS butterflies read it every frame
 * (extra flap energy, 3D yaw and bank while flying in); the butterfly-effect message and the
 * companion butterflies wait for `settled`.
 */
export const heroIntro = {
  /** 'pending' → waiting to start · 'flying' → entrance running · 'settled' → hovering in place */
  phase: 'pending' as 'pending' | 'flying' | 'settled',
  /** 0 → 1 over the flight. */
  progress: 0,
  /** Extra wing-beat energy (0 = idle beat, 1 = fast flight beat). */
  boost: 0,
  /** Extra rotation (degrees) layered on the resting pose during the flight. */
  yaw: 0,
  bank: 0,
  pitch: 0,
};

/** True once the entrance has played in this browser tab (client navigations don't replay it). */
let played = false;
export const entrancePlayed = () => played;

export const HERO_SETTLED_EVENT = 'hero:settled';

export function markSettled() {
  played = true;
  heroIntro.phase = 'settled';
  heroIntro.progress = 1;
  heroIntro.boost = 0;
  heroIntro.yaw = heroIntro.bank = heroIntro.pitch = 0;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.entrance = 'done';
    window.dispatchEvent(new Event(HERO_SETTLED_EVENT));
  }
}

export function isSettled() {
  return heroIntro.phase === 'settled';
}

/** Runs `cb` once the hero butterfly has settled (immediately if it already has). */
export function onSettled(cb: () => void): () => void {
  if (isSettled()) {
    cb();
    return () => undefined;
  }
  window.addEventListener(HERO_SETTLED_EVENT, cb, { once: true });
  return () => window.removeEventListener(HERO_SETTLED_EVENT, cb);
}
