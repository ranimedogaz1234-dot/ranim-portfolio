'use client';

import { useEffect, useRef } from 'react';
import { ButterflyCSS } from './ButterflyCSS';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { getGsap } from '@/lib/gsap';
import { onSettled } from '@/lib/heroIntro';
import { useSmallWingsReady } from '@/lib/smallWings';

/**
 * Loops are drawn relative to each butterfly's anchor (set in CSS per breakpoint, inside the
 * decorative zones of the hero), as fractions of the hero size. Each loop is a closed, gently
 * curving figure — different shapes and timings so the two never move in step.
 */
const LOOPS = {
  a: { points: [[0, 0], [0.03, -0.04], [0.06, -0.01], [0.035, 0.035], [0.0, 0.025], [-0.02, -0.005], [0, 0]], duration: 15 },
  b: { points: [[0, 0], [-0.03, 0.03], [-0.055, -0.005], [-0.03, -0.045], [0.01, -0.035], [0.015, 0.01], [0, 0]], duration: 18 },
} as const;

/**
 * Two small glass butterflies accompanying the hero butterfly — identical size, continuous
 * wing beats, slow curved flights in the empty zones beside the content. They fade in once the
 * main butterfly has settled and pause when the hero is off-screen.
 */
export function HeroCompanions() {
  const { animate } = useMotionPrefs();
  // once the WebGL overlay draws them (same articulated wings as the hero butterfly),
  // these elements are only anchors and the CSS fallback stops rendering
  const glWings = useSmallWingsReady();
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    const hero = document.getElementById('home');
    if (!a || !b || !hero) return;
    const { gsap } = getGsap();
    const loops: gsap.core.Timeline[] = [];
    let io: IntersectionObserver | null = null;

    const build = () => {
      loops.forEach((l) => l.kill());
      loops.length = 0;
      if (!animate) {
        gsap.set([a, b], { x: 0, y: 0, rotation: 0 });
        return;
      }
      const w = hero.offsetWidth;
      const h = hero.offsetHeight;
      const mobile = window.innerWidth < 768;
      const scale = mobile ? 0.55 : 1;
      ([
        [a, LOOPS.a],
        [b, LOOPS.b],
      ] as const).forEach(([el, loop], i) => {
        const path = loop.points.map(([px, py]) => ({ x: px * w * scale, y: py * h * scale }));
        const tl = gsap.timeline({ repeat: -1, delay: i * 0.8 });
        tl.to(el, { motionPath: { path, curviness: 1.6 }, duration: loop.duration, ease: 'none' }, 0);
        // a little banking that follows the turns
        tl.to(el, { rotation: i ? -9 : 9, duration: loop.duration / 4, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0);
        loops.push(tl);
      });
      io?.disconnect();
      io = new IntersectionObserver(([entry]) => loops.forEach((l) => (entry?.isIntersecting ? l.play() : l.pause())));
      io.observe(hero);
    };

    // they fade in through CSS once the entrance flag flips to "done" (see .companion)
    const off = onSettled(build);
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 250);
    };
    window.addEventListener('resize', onResize);
    return () => {
      off();
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
      io?.disconnect();
      loops.forEach((l) => l.kill());
    };
  }, [animate]);

  return (
    <div className="companions" aria-hidden="true">
      <div ref={aRef} className="companion companion--a" data-wing-anchor data-wing-speed="1.45">
        {!glWings && <ButterflyCSS size="small" animate={animate} fit={1} speed={1.45} phase={0} />}
      </div>
      <div ref={bRef} className="companion companion--b" data-wing-anchor data-wing-speed="1.22">
        {!glWings && <ButterflyCSS size="small" animate={animate} fit={1} speed={1.25} phase={2.1} />}
      </div>
    </div>
  );
}
