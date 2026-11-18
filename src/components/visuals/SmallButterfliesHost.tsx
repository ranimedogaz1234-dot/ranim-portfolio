'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { hasWebGL } from '@/lib/webgl';

const SmallButterflies = dynamic(() => import('./SmallButterflies'), { ssr: false, loading: () => null });

/** Mounts the shared small-butterfly overlay once the browser is idle and WebGL is available. */
export function SmallButterfliesHost() {
  const { theme } = useTheme();
  const { animate } = useMotionPrefs();
  const [gl, setGl] = useState(false);
  useEffect(() => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const start = () => setGl(hasWebGL());
    if (ric) ric(start, { timeout: 1500 });
    else setTimeout(start, 600);
  }, []);
  if (!gl) return null;
  return (
    <div className="small-butterflies" aria-hidden="true">
      <SmallButterflies animate={animate} light={theme === 'light'} />
    </div>
  );
}
