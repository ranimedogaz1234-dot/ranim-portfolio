'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { hasWebGL } from '@/lib/webgl';
import { GLASS_BG } from './wavesAssets';

const WavesGL = dynamic(() => import('./WavesGL'), { ssr: false, loading: () => null });

/**
 * Fixed full-viewport background: the reference colour field, the liquid-glass ribbons
 * around the edges (static image first, then the animated WebGL version), and grain.
 *
 * One composition for the whole page. The earlier cross-fade to a second "projects" ribbon
 * layer was removed: that layer had been cut out with rectangular masks and exposed hard
 * image boundaries (the "cracked" background) while scrolling.
 */
export function Backdrop() {
  const { theme } = useTheme();
  const { animate } = useMotionPrefs();
  // null = not checked yet; the static image is only for browsers without WebGL (the animated
  // version shows the waves compressed toward the bottom edge, so showing the raw image first
  // made the waves jump in size during the first second)
  const [gl, setGl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const start = () => setGl(hasWebGL());
    if (ric) ric(start);
    else setTimeout(start, 400);
  }, []);

  const dark = theme === 'dark';
  return (
    <div className="backdrop" data-gl={ready ? 'ready' : 'pending'} aria-hidden="true">
      <div className="backdrop__plate backdrop__plate--light" />
      <div className="backdrop__plate backdrop__plate--dark" />
      <div className="backdrop__glow" />
      {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed decorative layer, sized by CSS */}
      {gl === false && <img className="backdrop__waves" src={dark ? GLASS_BG.dark : GLASS_BG.light} alt="" decoding="async" />}
      {gl && <WavesGL dark={dark} animate={animate} onReady={() => setReady(true)} />}
      <div className="backdrop__grain" />
    </div>
  );
}
