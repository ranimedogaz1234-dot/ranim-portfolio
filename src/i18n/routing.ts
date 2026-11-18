import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  // English is the default. The visitor's explicit choice is remembered in the
  // NEXT_LOCALE cookie (set by the language switcher and honoured in proxy.ts),
  // so browser language never overrides it.
  localeDetection: false,
});

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'fr';
}

export const LOCALE_COOKIE = 'NEXT_LOCALE';
