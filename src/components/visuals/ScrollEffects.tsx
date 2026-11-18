'use client';

import { useEffect } from 'react';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { getGsap } from '@/lib/gsap';
import { scrollState } from '@/lib/scrollState';

/**
 * Page-level scroll choreography for the portfolio home page:
 *  - tracks a smoothed scroll velocity (butterflies flap with it),
 *  - reveals `[data-reveal]` / `[data-reveal-stagger]` content,
 *  - draws the experience timeline as it scrolls into view,
 *  - plays the hero entrance.
 */
export function ScrollEffects() {
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      // velocity — decays every tick so the butterflies settle when scrolling stops
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          scrollState.velocity = self.getVelocity();
        },
      });

      if (reduced) return;

      // hero entrance
      gsap.from('[data-hero-in]', {
        opacity: 0,
        y: 26,
        filter: 'blur(6px)',
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 0.1,
        clearProps: 'filter',
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          y: 24,
          scale: 0.97,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.035,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-timeline]').forEach((tl) => {
        gsap.fromTo(
          tl,
          { '--tl-progress': 0 },
          {
            '--tl-progress': 1,
            ease: 'none',
            scrollTrigger: { trigger: tl, start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
          },
        );
      });
    });

    const decay = () => {
      scrollState.velocity *= 0.9;
      if (Math.abs(scrollState.velocity) < 1) scrollState.velocity = 0;
    };
    gsap.ticker.add(decay);

    // fonts and images change layout height: recompute trigger positions once settled
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);
    window.addEventListener('load', refresh);

    return () => {
      gsap.ticker.remove(decay);
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [reduced]);

  return null;
}
