'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { BUTTERFLY_ASPECT, POSE, WING_TEXTURE, createFlapState, stepFlap } from './butterflyRig';
import { scrollState } from '@/lib/scrollState';
import { heroIntro } from '@/lib/heroIntro';
import { useTheme } from '@/components/theme/ThemeProvider';

interface Props {
  size?: 'hero' | 'small';
  animate: boolean;
  /** Fraction of the container the butterfly may fill. */
  fit?: number;
  /** Multiplies flap speed (the small butterfly beats faster). */
  speed?: number;
  /** Follow the hero entrance (extra flap energy and 3D turn while flying in). */
  intro?: boolean;
  /** Phase offset in radians so several butterflies never beat in sync. */
  phase?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Two real 3D-transformed wing planes (CSS 3D). Used as:
 *  - the instant poster before the WebGL butterfly loads,
 *  - the fallback when WebGL is unavailable,
 *  - the small travelling butterfly (cheaper than a second WebGL context).
 */
export function ButterflyCSS({ size = 'hero', animate, fit = 0.84, speed = 1, intro = false, phase = 0, className = '', style }: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const rigRef = useRef<HTMLSpanElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const pearl = useTheme().theme === 'light';
  const small = size === 'small';
  const left = small
    ? pearl ? WING_TEXTURE.smallPearlLeft : WING_TEXTURE.smallLeft
    : pearl ? WING_TEXTURE.pearlLeft : WING_TEXTURE.left;
  const right = small
    ? pearl ? WING_TEXTURE.smallPearlRight : WING_TEXTURE.smallRight
    : pearl ? WING_TEXTURE.pearlRight : WING_TEXTURE.right;

  // Size the rig to fit its container while keeping the texture aspect.
  useEffect(() => {
    const root = rootRef.current;
    const rig = rigRef.current;
    if (!root || !rig) return;
    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      const w = Math.min(width * fit, height * fit * BUTTERFLY_ASPECT);
      const h = w / BUTTERFLY_ASPECT;
      rig.style.width = `${w}px`;
      rig.style.height = `${h}px`;
      rig.style.marginLeft = `${-w / 2}px`;
      rig.style.marginTop = `${-h / 2}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit]);

  // Flap loop (paused offscreen and when animation is off).
  useEffect(() => {
    const root = rootRef.current;
    const l = leftRef.current;
    const r = rightRef.current;
    if (!root || !l || !r) return;
    const state = createFlapState();
    state.phase = phase;
    const rig = rigRef.current;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const apply = (deg: number) => {
      l.style.transform = `rotateY(${deg}deg)`;
      r.style.transform = `rotateY(${-deg}deg)`;
    };
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      apply(stepFlap(state, dt, scrollState.velocity, animate, speed, intro ? heroIntro.boost : 0));
      if (intro && rig) {
        rig.style.transform = `rotateX(${POSE.pitchDeg + heroIntro.pitch}deg) rotateY(${POSE.yawDeg + heroIntro.yaw}deg) rotateZ(${POSE.bankDeg + heroIntro.bank}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      if (animate && visible) raf = requestAnimationFrame(tick);
      else apply(POSE.restDeg);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      start();
    });
    io.observe(root);
    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [animate, speed, intro, phase]);

  return (
    <span ref={rootRef} className={`css-butterfly ${className}`} style={style} aria-hidden="true">
      <span
        ref={rigRef}
        className="css-butterfly__rig"
        style={{ transform: `rotateX(${POSE.pitchDeg}deg) rotateY(${POSE.yawDeg}deg) rotateZ(${POSE.bankDeg}deg)` }}
      >
        <span
          ref={leftRef}
          className="css-butterfly__wing css-butterfly__wing--left"
          style={{ width: '50%', backgroundImage: `url(${left})` }}
        />
        <span
          ref={rightRef}
          className="css-butterfly__wing css-butterfly__wing--right"
          style={{ width: '50%', backgroundImage: `url(${right})` }}
        />
      </span>
    </span>
  );
}
