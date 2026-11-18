'use client';

import { useEffect, useRef } from 'react';
import { ButterflyCSS } from './ButterflyCSS';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { getGsap } from '@/lib/gsap';
import { scrollState } from '@/lib/scrollState';
import { useSmallWingsReady } from '@/lib/smallWings';

type Spot = [number, number];
type Spots = Record<string, { desktop: Spot; mobile: Spot }>;

/**
 * Resting spots (fractions of the viewport) for each section. Butterfly A keeps to the left
 * margin and the empty left areas, butterfly B to the right — they never share a side, so they
 * can't overlap each other, and every spot is clear of headings, text, buttons and the nav.
 * At the top of the page both are invisible (the hero has its own three butterflies); they
 * fade in near the hero butterfly as the visitor scrolls away.
 */
const SPOTS: Record<'a' | 'b', Spots> = {
  a: {
    home: { desktop: [0.3, 0.62], mobile: [0.2, 0.55] },
    about: { desktop: [0.032, 0.86], mobile: [0.1, 0.9] },
    skills: { desktop: [0.032, 0.62], mobile: [0.1, 0.9] },
    projects: { desktop: [0.032, 0.3], mobile: [0.1, 0.9] },
    experience: { desktop: [0.032, 0.5], mobile: [0.1, 0.9] },
    contact: { desktop: [0.032, 0.86], mobile: [0.1, 0.9] },
  },
  b: {
    home: { desktop: [0.74, 0.5], mobile: [0.8, 0.3] },
    about: { desktop: [0.9, 0.16], mobile: [0.88, 0.16] },
    // right margin: the sticky inspector occupies the top-right of this section
    skills: { desktop: [0.968, 0.58], mobile: [0.88, 0.16] },
    projects: { desktop: [0.9, 0.17], mobile: [0.88, 0.16] },
    experience: { desktop: [0.968, 0.78], mobile: [0.88, 0.16] },
    // right margin: the contact form fills the right column
    contact: { desktop: [0.968, 0.6], mobile: [0.88, 0.16] },
  },
};
const ORDER = ['home', 'about', 'skills', 'projects', 'experience', 'contact'] as const;

/** One scroll-driven travelling butterfly. */
function Traveller({ side }: { side: 'a' | 'b' }) {
  const ref = useRef<HTMLDivElement>(null);
  const { animate } = useMotionPrefs();
  const glWings = useSmallWingsReady();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { gsap, ScrollTrigger } = getGsap();
    const spots = SPOTS[side];
    const dir = side === 'a' ? 1 : -1; // arcs bow toward the centre, then back to its own side
    let tl: gsap.core.Timeline | null = null;
    let fade: gsap.core.Tween | null = null;
    let tilt = 0;

    const build = () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      fade?.scrollTrigger?.kill();
      fade?.kill();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const spot = (id: string) => {
        const [fx, fy] = mobile ? spots[id]!.mobile : spots[id]!.desktop;
        return { x: fx * vw - w / 2, y: fy * vh - h / 2 };
      };
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const sections = ORDER.map((id) => {
        const node = document.getElementById(id);
        const top = node ? node.getBoundingClientRect().top + window.scrollY : 0;
        const height = node?.offsetHeight ?? vh;
        return {
          id,
          arrive: Math.min(maxScroll, Math.max(0, top - vh * 0.2)),
          leave: Math.min(maxScroll, Math.max(0, top + height - vh * 0.8)),
        };
      });

      gsap.set(el, { ...spot('home'), rotation: 0 });
      tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { start: 0, end: maxScroll, scrub: side === 'a' ? 1.6 : 1.2 } });
      for (let i = 1; i < sections.length; i++) {
        const prev = sections[i - 1]!;
        const next = sections[i]!;
        const from = spot(prev.id);
        const to = spot(next.id);
        const span = Math.max(1, next.arrive - prev.leave);
        // B leaves a little earlier than A, so the two never move in lockstep
        const start = Math.max(prev.leave, prev.arrive) + (side === 'a' ? span * 0.12 : 0);
        const end = Math.max(next.arrive, start + 1);
        // a gentle arc that stays near its own side and never rises under the navigation bar
        const navBottom = document.querySelector('.site-nav')?.getBoundingClientRect().bottom ?? 80;
        const ctrl = {
          x: (from.x + to.x) / 2 + dir * vw * (mobile ? 0.08 : 0.05) * (i % 2 ? 1 : 0.6),
          y: Math.max(navBottom + 12, Math.min(from.y, to.y) - vh * (side === 'a' ? 0.08 : 0.11)),
        };
        tl.to(el, { motionPath: { path: [from, ctrl, to], curviness: side === 'a' ? 1.3 : 1.15 }, duration: end - start }, start);
      }
      tl.set({}, {}, maxScroll);
      fade = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { start: vh * 0.25, end: vh * 0.7, scrub: 0.6 } });
    };

    build();
    const onRefreshInit = () => build();
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit);
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener('resize', onResize);

    // bank with scroll speed, eased back to level when scrolling stops
    const setRot = gsap.quickSetter(el, 'rotation', 'deg');
    const k = side === 'a' ? 0.008 : -0.007;
    const bank = () => {
      const target = Math.max(-16, Math.min(16, scrollState.velocity * k));
      tilt += (target - tilt) * 0.08;
      setRot(tilt);
    };
    gsap.ticker.add(bank);

    return () => {
      gsap.ticker.remove(bank);
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      tl?.scrollTrigger?.kill();
      tl?.kill();
      fade?.scrollTrigger?.kill();
      fade?.kill();
    };
  }, [side]);

  return (
    <div ref={ref} className={`traveller traveller--${side}`} aria-hidden="true">
      <div className="traveller__hover" data-wing-anchor data-wing-host="parent" data-wing-speed={side === 'a' ? '1.36' : '1.18'}>
        {!glWings && <ButterflyCSS size="small" animate={animate} fit={1} speed={side === 'a' ? 1.5 : 1.3} phase={side === 'a' ? 0 : 2.4} />}
      </div>
    </div>
  );
}

/**
 * Two equally sized glass butterflies that accompany the visitor through the main portfolio
 * (never on case-study pages, which don't render this component). Scroll-driven only — they
 * never follow the cursor. Each rests on its own side while a section is in view and travels
 * on its own curved path between sections; wing beats follow scroll speed.
 */
export function TravellingButterfly() {
  const { reduced } = useMotionPrefs();
  // scroll-linked flight is decorative: skipped entirely for reduced-motion visitors
  if (reduced) return null;
  return (
    <>
      <Traveller side="a" />
      <Traveller side="b" />
    </>
  );
}
