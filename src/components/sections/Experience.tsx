import { useLocale, useTranslations } from 'next-intl';
import { timeline } from '@/content/experience';
import { profile } from '@/content/profile';
import { publishable } from '@/content/verification';
import type { Locale } from '@/i18n/routing';
import type { TimelineKind } from '@/content/types';
import { Icon, type IconName } from '@/components/ui/Icon';
import { VerifyBadge } from '@/components/ui/VerifyBadge';

const kindIcon: Record<TimelineKind, IconName> = {
  internship: 'briefcase',
  education: 'graduation',
  diploma: 'book',
};

export function Experience() {
  const t = useTranslations('experience');
  const tAbout = useTranslations('about');
  const locale = useLocale() as Locale;
  const items = publishable(timeline);

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container-x experience-grid">
        <div className="experience-head" data-reveal>
          <p className="eyebrow m-0">{t('index')}</p>
          <h2 id="experience-title" className="display-title mt-4 mb-0">
            {t('title')}
          </h2>
        </div>

        {items.length === 0 ? (
          <p className="mt-8" style={{ color: 'var(--muted)' }}>
            {t('empty')}
          </p>
        ) : (
          <div className="timeline" data-timeline>
            <span className="timeline__rail" aria-hidden="true">
              <span className="timeline__progress" />
            </span>
            <ol className="m-0 list-none p-0">
              {items.map((item) => (
                <li key={item.id} className="timeline__item" data-reveal>
                  <span className="timeline__node" aria-hidden="true" />
                  <div className="timeline__card glass">
                    <div className="timeline__meta">
                      <span className="timeline__icon" aria-hidden="true">
                        <Icon name={kindIcon[item.kind]} size={22} />
                      </span>
                      <span className="timeline__date">{item.period ? item.period[locale] : t(`kinds.${item.kind}`)}</span>
                      {item.period && <span className="sr-only"> — {t(`kinds.${item.kind}`)}</span>}
                    </div>
                    <h3 className="timeline__title">
                      {item.title[locale]}
                      <VerifyBadge item={item} />
                    </h3>
                    {item.organisation && <p className="timeline__org">{item.organisation}</p>}
                    {item.detail && <p className="timeline__detail">{item.detail[locale]}</p>}
                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="timeline__highlights" aria-label={t('highlights')}>
                        {item.highlights.map((h) => (
                          <li key={h.en}>{h[locale]}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {/* phones only: the timeline closes with a glass card (certifications from the CV) */}
            <div className="timeline-extra glass" data-reveal>
              <span className="timeline-extra__icon" aria-hidden="true">
                <Icon name="star" size={22} />
              </span>
              <span>
                <span className="timeline-extra__title">{tAbout('certificationsLabel')}</span>
                <span className="timeline-extra__text">{profile.certifications.map((c) => c[locale]).join(' · ')}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
