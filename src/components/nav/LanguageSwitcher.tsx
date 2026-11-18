'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { Link, usePathname } from '@/i18n/navigation';
import { LOCALE_COOKIE, routing, type Locale } from '@/i18n/routing';
import { Icon } from '@/components/ui/Icon';

const labels: Record<Locale, string> = { en: 'English', fr: 'Français' };

export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('a11y');
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="lang-btn"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t('chooseLanguage')} (${labels[locale]})`}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="globe" size={18} />
        <span>{locale.toUpperCase()}</span>
        <Icon name="chevronDown" size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            className="lang-menu glass"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <ul className="m-0 list-none p-0" aria-label={t('language')}>
              {routing.locales.map((l) => (
                <li key={l}>
                  <Link
                    href={pathname}
                    locale={l}
                    lang={l}
                    hrefLang={l}
                    aria-current={l === locale ? 'true' : undefined}
                    onClick={() => {
                      rememberLocale(l);
                      setOpen(false);
                    }}
                  >
                    <span>{labels[l]}</span>
                    <span className="opacity-60">{l.toUpperCase()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
