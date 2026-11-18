'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { getGsap } from '@/lib/gsap';
import { onSettled } from '@/lib/heroIntro';

/**
 * "The Butterfly Effect" — revealed only after the hero butterfly has settled:
 * a thin luminous line draws itself, the small heading appears, the quote unveils word by
 * word, the supporting sentence fades in, then a delicate shimmer runs along the line.
 */
export function HeroEffect() {
  const t = useTranslations('hero.effect');
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const entrance = document.documentElement.dataset.entrance;
    const willAnimate = entrance === 'pending' || entrance === 'running';
    const line = root.querySelector('.hero-effect__line');
    const kicker = root.querySelector('.hero-effect__kicker');
    const words = root.querySelectorAll('.hero-effect__word');
    const body = root.querySelector('.hero-effect__body');
    const { gsap } = getGsap();

    if (!willAnimate) {
      line?.classList.add('is-lit');
      return;
    }
    // hold everything hidden inline (the CSS rule only covers the time before hydration)
    gsap.set(line, { scaleX: 0 });
    gsap.set(kicker, { opacity: 0, letterSpacing: '0.6em' });
    gsap.set(words, { opacity: 0, y: '0.35em', filter: 'blur(6px)' });
    gsap.set(body, { opacity: 0, y: 10 });

    let tl: gsap.core.Timeline | null = null;
    const off = onSettled(() => {
      tl = gsap.timeline({ delay: 0.15, onComplete: () => line?.classList.add('is-lit') });
      tl.to(line, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' })
        .to(kicker, { opacity: 1, letterSpacing: '0.32em', duration: 0.9, ease: 'power2.out' }, '-=0.45')
        .to(words, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.06 }, '-=0.45')
        .to(body, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.45');
    });
    return () => {
      off();
      tl?.progress(1).kill();
    };
  }, []);

  const quote = t('quote');
  return (
    <aside ref={ref} className="hero-effect" aria-label={t('kicker')}>
      <span className="hero-effect__line" aria-hidden="true" />
      <p className="hero-effect__kicker">{t('kicker')}</p>
      <blockquote className="hero-effect__quote">
        <p>
          {quote.split(' ').map((word, i) => (
            <span className="hero-effect__word" key={`${word}-${i}`}>
              {word}{' '}
            </span>
          ))}
        </p>
      </blockquote>
      <p className="hero-effect__body">{t('body')}</p>
    </aside>
  );
}
