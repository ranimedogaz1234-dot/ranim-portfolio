'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import type { ProjectScreenshot } from '@/content/types';
import { Icon } from '@/components/ui/Icon';

function BrowserFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="cs-browser">
      <div className="cs-browser__bar" aria-hidden="true">
        <span className="cs-browser__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="cs-browser__url">{label}</span>
      </div>
      <div className="cs-browser__view">{children}</div>
    </div>
  );
}

/** Desktop-application window (title bar + window controls) for desktop apps such as JavaFX. */
function AppFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="cs-browser cs-appwin">
      <div className="cs-browser__bar cs-appwin__bar" aria-hidden="true">
        <span className="cs-appwin__title">{label}</span>
        <span className="cs-appwin__controls">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="cs-browser__view">{children}</div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="cs-phone">
      <span className="cs-phone__notch" aria-hidden="true" />
      <div className="cs-phone__view">{children}</div>
    </div>
  );
}

/**
 * Real screenshots in browser-window / phone mock-ups. Each opens in a large viewer
 * (native <dialog>: Esc closes, ← → browse, focus returns to the thumbnail).
 * With no screenshots yet, it shows empty frames marked "pending" — never invented images.
 */
export function ScreenGallery({ shots, title, locale }: { shots: ProjectScreenshot[]; title: string; locale: Locale }) {
  const t = useTranslations('caseStudy');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const host = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.app`;

  const show = useCallback((i: number) => {
    setOpen(i);
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setOpen(null);
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  if (shots.length === 0) {
    return (
      <div className="cs-shots cs-shots--pending">
        <BrowserFrame label={host}>
          <div className="cs-placeholder cs-placeholder--frame">
            <strong>{t('pending')}</strong>
            <span>{t('pendingScreens')}</span>
          </div>
        </BrowserFrame>
        <PhoneFrame>
          <div className="cs-placeholder cs-placeholder--frame">
            <Icon name="mobile" size={22} />
            <strong>{t('pending')}</strong>
          </div>
        </PhoneFrame>
      </div>
    );
  }

  const current = open !== null ? shots[open] : undefined;
  const step = (dir: number) => setOpen((i) => (i === null ? i : (i + dir + shots.length) % shots.length));

  return (
    <>
      <ul className="cs-shots">
        {shots.map((shot, i) => {
          const img = (
            <Image src={shot.src} width={shot.width} height={shot.height} alt={shot.alt[locale]} sizes="(max-width: 800px) 100vw, 60vw" />
          );
          return (
            <li key={shot.src} className={shot.device === 'mobile' ? 'cs-shots__item cs-shots__item--mobile' : 'cs-shots__item'}>
              <button type="button" className="cs-shots__open" onClick={() => show(i)} aria-label={t('enlarge', { alt: shot.alt[locale] })}>
                {shot.device === 'mobile' ? (
                  <PhoneFrame>{img}</PhoneFrame>
                ) : shot.device === 'app' ? (
                  <AppFrame label={title}>{img}</AppFrame>
                ) : (
                  // real screenshots: the bar shows the project name, never an invented domain
                  <BrowserFrame label={title}>{img}</BrowserFrame>
                )}
              </button>
              <p className="cs-shots__caption">
                {shot.alt[locale]} · {shot.device === 'mobile' ? t('mobile') : shot.device === 'app' ? t('desktopApp') : t('desktop')}
              </p>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className="cs-lightbox"
        aria-label={current?.alt[locale]}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      >
        {current && (
          <figure className="cs-lightbox__figure">
            <Image src={current.src} width={current.width} height={current.height} alt={current.alt[locale]} sizes="92vw" />
            <figcaption>{current.alt[locale]}</figcaption>
          </figure>
        )}
        <form method="dialog">
          <button className="cs-lightbox__close" aria-label={t('close')}>
            <Icon name="close" size={20} />
          </button>
        </form>
        {shots.length > 1 && (
          <>
            <button type="button" className="cs-lightbox__nav cs-lightbox__nav--prev" onClick={() => step(-1)} aria-label={t('previous')}>
              <Icon name="chevronLeft" size={22} />
            </button>
            <button type="button" className="cs-lightbox__nav cs-lightbox__nav--next" onClick={() => step(1)} aria-label={t('next')}>
              <Icon name="chevronRight" size={22} />
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
