/**
 * Shared geometry + motion model for every butterfly (Three.js and CSS versions), so the
 * WebGL butterfly can replace the CSS poster without any jump.
 *
 * The wing textures were cut from Ranim's reference renders along the body axis: the hinge
 * is the inner edge of each texture. Each wing is a real separate plane that rotates in 3D
 * around that hinge — the material is the reference artwork, the articulation is live.
 */
export const WING_TEXTURE = {
  /** Midnight (dark theme) wings — from the dark reference render. */
  left: '/visuals/butterfly-left.webp',
  right: '/visuals/butterfly-right.webp',
  /** Pearl (soft theme) wings — same artwork, lifted toward white like the soft reference. */
  pearlLeft: '/visuals/butterfly-pearl-left.webp',
  pearlRight: '/visuals/butterfly-pearl-right.webp',
  smallLeft: '/visuals/butterfly-small-left.webp',
  smallRight: '/visuals/butterfly-small-right.webp',
  smallPearlLeft: '/visuals/butterfly-small-pearl-left.webp',
  smallPearlRight: '/visuals/butterfly-small-pearl-right.webp',
  /** Pixel size of one wing texture. */
  width: 425,
  height: 614,
} as const;

/** Full butterfly aspect (both wings side by side). */
export const BUTTERFLY_ASPECT = (WING_TEXTURE.width * 2) / WING_TEXTURE.height;

/** Resting pose: slight bank like the reference, wings a little raised — ready to take off. */
export const POSE = {
  bankDeg: 6,
  pitchDeg: 14,
  yawDeg: 6,
  restDeg: 9,
} as const;

export interface FlapState {
  phase: number;
  boost: number;
  /** Current beat amplitude in degrees (0 when animation is off). */
  amp: number;
  /** Running time (s) for the rhythm drift. */
  time: number;
  /** Per-butterfly seed: each one beats with its own rhythm. */
  seed: number;
}

export function createFlapState(seed = 0): FlapState {
  return { phase: seed * 1.7, boost: 0, amp: 0, time: 0, seed };
}

/**
 * Organic rhythm: the beat never runs at a perfectly constant speed or height — two slow,
 * incommensurate drifts per butterfly (seeded) vary both, so nothing looks looped.
 */
export function rhythm(t: number, seed: number) {
  return {
    speed: 1 + 0.07 * Math.sin(t * 0.53 + seed) + 0.05 * Math.sin(t * 1.31 + seed * 2.3),
    amp: 1 + 0.08 * Math.sin(t * 0.71 + seed * 1.7) + 0.04 * Math.sin(t * 1.9 + seed),
  };
}

/**
 * Smooth, asymmetric wing-beat curve, 0 (wings low) … 1 (wings high): the downstroke is a
 * little quicker than the upstroke, like a real butterfly, with no abrupt turnaround.
 */
export function beat(phase: number): number {
  return 0.5 - 0.5 * Math.cos(phase + 0.35 * Math.sin(phase));
}

/**
 * Advances the flap and returns the root wing angle in degrees (0 = flat).
 * `velocity` is the smoothed scroll velocity in px/s; `extra` adds energy (the hero entrance).
 * Idle: slow, gentle beat. Flight: faster and wider. Changes are eased, never abrupt.
 */
export function stepFlap(state: FlapState, dt: number, velocity: number, animate: boolean, scale = 1, extra = 0): number {
  const target = Math.min(Math.max(Math.abs(velocity) / 1600, extra), 1);
  // quick to start flapping, slow to settle back to rest
  const rate = target > state.boost ? 4 : 1.2;
  state.boost += (target - state.boost) * (1 - Math.exp(-dt * rate));
  if (!animate) {
    state.amp = 0;
    return POSE.restDeg;
  }
  state.time += dt;
  const r = rhythm(state.time, state.seed);
  const speed = (1.9 + state.boost * 6.2) * scale * r.speed; // rad/s: ~0.3 Hz idle → ~1.3 Hz in flight
  state.phase += dt * speed;
  const targetAmp = (16 + state.boost * 30) * r.amp;
  state.amp += (targetAmp - state.amp) * (1 - Math.exp(-dt * 3));
  return POSE.restDeg + state.amp * beat(state.phase);
}
