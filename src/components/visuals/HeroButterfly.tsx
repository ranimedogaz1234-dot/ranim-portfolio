'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ButterflyCSS } from './ButterflyCSS';
import { OrbitRings } from './OrbitRings';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { hasWebGL } from '@/lib/webgl';
import { getGsap } from '@/lib/gsap';
import { entrancePlayed, heroIntro, markSettled } from '@/lib/heroIntro';
import { MOBILE_QUERY, useMediaQuery } from '@/lib/useMediaQuery';

const ButterflyScene = dynamic(() => import('./ButterflyScene'), { ssr: false, loading: () => null });

/** The flyer box is 1.28× the stage height: 0.77 of it ≈ the previous 0.98 of the stage. */
const FIT = 0.775;
/** Longest wait for the WebGL butterfly before flying in with the CSS one instead. */
const MAX_WAIT_MS = 1200;

/**
 * The large glass butterfly. On first load it flies in from beyond the right edge along a
 * curved path, slows down, turns to show both wings and settles beside the name; afterwards it
 * keeps hovering, beating its wings and reacting to scroll speed.
 */
export function HeroButterfly() {
  const t = useTranslations('a11y');
  const { theme } = useTheme();
  const { animate } = useMotionPrefs();
  const stageRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [settled, setSettled] = useState(false);
  // phones (approved mobile design): no large butterfly — only the small companions
  const mobile = useMediaQuery(MOBILE_QUERY);

  useEffect(() => {
    if (mobile) return; // the 3D bundle is never loaded on phones
    // Defer the 3D bundle until the browser is idle so it never competes with first paint.
    const start = () => setGl(hasWebGL());
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (ric) ric(start, { timeout: 600 } as never);
    else setTimeout(start, 200);
  }, [mobile]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── One-time entrance ───────────────────────────────────────────────────────────────────
  const readyRef = useRef(false);
  readyRef.current = ready;
  useEffect(() => {
    const flyer = flyerRef.current;
    const stage = stageRef.current;
    if (!flyer || !stage) return;
    const root = document.documentElement;
    // `data-entrance="pending"` is set before first paint by the inline head script, only on a
    // full page load of the home page and only when motion is allowed (OS reduced-motion
    // preference and the visitor's pause button are checked there).
    const skip = entrancePlayed() || root.dataset.entrance !== 'pending';
    if (skip) {
      flyer.style.opacity = '';
      markSettled();
      setSettled(true);
      return;
    }
    root.dataset.entrance = 'running'; // disables the CSS fail-safe reveal
    if (window.matchMedia(MOBILE_QUERY).matches) {
      // phones: nothing flies in — after a short beat the butterfly-effect message unveils and
      // the companions fade in, exactly as after the desktop entrance
      const timer = window.setTimeout(() => {
        markSettled();
        setSettled(true);
      }, 650);
      return () => {
        if (!entrancePlayed()) {
          window.clearTimeout(timer);
          root.dataset.entrance = 'pending';
        }
      };
    }
    const { gsap } = getGsap();
    // stay hidden while waiting for take-off ("running" lifts the CSS rule that hid it)
    gsap.set(flyer, { opacity: 0 });
    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    const fly = () => {
      if (cancelled || tl) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = stage.getBoundingClientRect();
      const mobile = vw < 768;
      // start completely beyond the right edge, a little above the final position, at full size
      // (no scale animation: the butterfly keeps its final size for the whole flight)
      const startX = vw - r.left + 24;
      const startY = -vh * (mobile ? 0.06 : 0.16);
      heroIntro.phase = 'flying';
      heroIntro.boost = 1;
      // a mild 3D turn for depth — kept small so the butterfly doesn't visibly shrink
      heroIntro.yaw = 18;
      heroIntro.bank = -12;
      heroIntro.pitch = 8;
      gsap.set(flyer, { x: startX, y: startY, scale: 1, rotation: -6, opacity: 1 });

      tl = gsap.timeline({
        onComplete: () => {
          gsap.set(flyer, { clearProps: 'transform' });
          markSettled();
          setSettled(true);
        },
      });
      // Phase 1–2: curved flight in, decelerating — swoops below the final spot then rises
      tl.to(
        flyer,
        {
          duration: mobile ? 2.6 : 3.3,
          ease: 'power2.out',
          motionPath: {
            path: [
              { x: startX, y: startY },
              { x: r.width * (mobile ? 0.45 : 0.55), y: vh * 0.02 },
              { x: -r.width * 0.06, y: vh * 0.07 },
              { x: 0, y: -vh * 0.012 },
            ],
            curviness: 1.35,
          },
          rotation: 0,
        },
        0,
      );
      // the body turns toward the viewer so both wings open up; wing beats soften
      tl.to(heroIntro, { duration: mobile ? 2.4 : 3.0, ease: 'power2.inOut', yaw: 0, bank: 0, pitch: 0 }, 0);
      tl.to(heroIntro, { duration: mobile ? 2.6 : 3.3, ease: 'power1.in', boost: 0, progress: 1 }, 0);
      // Phase 3: settle — a last soft dip into the hovering position
      tl.to(flyer, { y: 0, duration: 0.9, ease: 'sine.inOut' });
    };

    // wait for the WebGL butterfly (it looks best), but never for long
    const started = performance.now();
    const poll = window.setInterval(() => {
      if (readyRef.current || performance.now() - started > MAX_WAIT_MS) {
        window.clearInterval(poll);
        fly();
      }
    }, 60);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      if (!tl) {
        root.dataset.entrance = 'pending'; // unmounted before take-off (e.g. StrictMode re-run)
        flyer.style.opacity = '';
        return;
      }
      if (tl.progress() < 1) {
        tl.progress(1); // finish instantly instead of leaving the butterfly mid-air
      }
      tl.kill();
    };
    // run once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={stageRef} className="butterfly-stage" role="img" aria-label={t('butterfly')}>
      <div className="hero__orbits" data-settled={settled}>
        <OrbitRings animate={animate && visible} />
      </div>
      <div ref={flyerRef} className="hero__flyer">
        <ButterflyCSS
          animate={animate && !ready}
          intro
          fit={FIT}
          // no cross-fade while flying: the two renderers' perspectives differ slightly and a
          // fading poster would trail the WebGL butterfly as a ghost
          style={{ opacity: ready ? 0 : 1, transition: settled ? 'opacity 0.6s ease' : 'none' }}
        />
        {gl && !mobile && (
          <ButterflyScene
            animate={animate}
            visible={visible}
            light={theme === 'light'}
            fit={FIT}
            onReady={() => setReady(true)}
            anchor={stageRef}
          />
        )}
      </div>
    </div>
  );
}
