'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from './ThemeProvider';
import { Icon } from '@/components/ui/Icon';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const t = useTranslations('a11y');
  return (
    <button
      type="button"
      className="theme-toggle"
      data-theme-state={theme}
      onClick={toggle}
      aria-label={theme === 'dark' ? t('toLight') : t('toDark')}
      title={theme === 'dark' ? t('toLight') : t('toDark')}
    >
      <span className="theme-toggle__thumb" aria-hidden="true" />
      <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
        <Icon name="sun" size={20} />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
        <Icon name="moon" size={18} />
      </span>
    </button>
  );
}
