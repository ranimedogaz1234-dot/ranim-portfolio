'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { rememberLocale } from '@/components/nav/LanguageSwitcher';

/** Minimal EN | FR switch styled by the project's own identity. */
export function CaseStudyLangSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('a11y');
  return (
    <nav className="cs-lang" aria-label={t('language')}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l}
          hrefLang={l}
          aria-current={l === locale ? 'true' : undefined}
          onClick={() => rememberLocale(l)}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
