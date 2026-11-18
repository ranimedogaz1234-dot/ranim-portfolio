import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <main className="page grid min-h-[100dvh] place-items-center px-6 text-center">
      <div>
        <p className="display-title m-0" style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}>
          404
        </p>
        <h1 className="mt-2 text-2xl font-medium">{t('title')}</h1>
        <p className="mt-2" style={{ color: 'var(--muted)' }}>
          {t('body')}
        </p>
        <Link href="/" className="btn btn--primary mt-8">
          {t('home')}
        </Link>
      </div>
    </main>
  );
}
