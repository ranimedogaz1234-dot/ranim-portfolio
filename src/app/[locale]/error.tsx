'use client';

import { useTranslations } from 'next-intl';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error');
  return (
    <main className="page grid min-h-[100dvh] place-items-center px-6 text-center">
      <div>
        <h1 className="display-title m-0">{t('title')}</h1>
        <p className="mt-4" style={{ color: 'var(--muted)' }}>
          {t('body')}
        </p>
        <button type="button" className="btn btn--primary mt-8" onClick={reset}>
          {t('retry')}
        </button>
      </div>
    </main>
  );
}
