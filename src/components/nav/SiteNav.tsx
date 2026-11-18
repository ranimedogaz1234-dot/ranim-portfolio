'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { profile } from '@/content/profile';
import type { Locale } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Icon, type IconName } from '@/components/ui/Icon';
import { AmbientToggle } from '@/components/sections/AmbientToggle';

export const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'contact'] as const;
export type SectionId = (typeof sectionIds)[number];
const sectionIcon: Record<SectionId, IconName> = {
  home: 'home',
  about: 'user',
  skills: 'code',
  projects: 'briefcase',
  experience: 'star',
  contact: 'mail',
};

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('home');
  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.intersectionRatio);
        let best: SectionId = active;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const r = visible.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7], rootMargin: '-20% 0px -35% 0px' },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}

export function SiteNav() {
  const t = useTranslations('nav');
  const a = useTranslations('a11y');
  const locale = useLocale() as Locale;
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const opener = menuBtnRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      // keep keyboard focus inside the open menu
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last?.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first?.focus();
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  return (
    <header className="site-nav" data-scrolled={scrolled}>
      <div className="site-nav__inner">
        <a href="#home" className="brand" aria-label={a('home')}>
          <span className="brand__mono" aria-hidden="true">
            {profile.monogram}
          </span>
          <span className="brand__text">
            <span className="brand__name">{profile.shortName}</span>
            <span className="brand__role">{profile.title[locale]}</span>
          </span>
        </a>

        <nav aria-label={a('mainNav')}>
          <ul className="nav-links m-0 list-none">
            {sectionIds.map((id) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-tools">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            ref={menuBtnRef}
            type="button"
            className="menu-btn"
            aria-label={a('openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={panelRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={a('mainNav')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="mobile-menu__panel"
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <button
                type="button"
                className="mobile-menu__close"
                aria-label={a('closeMenu')}
                onClick={() => setMenuOpen(false)}
                autoFocus
              >
                <Icon name="close" size={26} />
              </button>
              <div className="mobile-menu__brand" aria-hidden="true">
                <span className="brand__mono mobile-menu__mono">{profile.monogram}</span>
                <span className="mobile-menu__id">
                  <span className="mobile-menu__name">{profile.name}</span>
                  <span className="mobile-menu__role">{profile.title[locale]}</span>
                </span>
              </div>
              <nav aria-label={a('mainNav')} className="mobile-menu__nav">
                {sectionIds.map((id, i) => (
                  <motion.a
                    key={id}
                    href={`#${id}`}
                    aria-current={active === id ? 'true' : undefined}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + 0.04 * i, duration: 0.3 }}
                  >
                    <Icon name={sectionIcon[id]} size={22} />
                    {t(id)}
                  </motion.a>
                ))}
              </nav>
              <div className="mobile-menu__foot">
                <LanguageSwitcher className="mobile-menu__lang" />
                <ThemeToggle />
                <AmbientToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
