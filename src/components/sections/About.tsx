import { useLocale, useTranslations } from 'next-intl';
import { profile } from '@/content/profile';
import { timeline } from '@/content/experience';
import { publishable } from '@/content/verification';
import type { Locale } from '@/i18n/routing';
import { Icon } from '@/components/ui/Icon';
import { VerifyBadge } from '@/components/ui/VerifyBadge';
import { IdCard } from './IdCard';

export function About() {
  const t = useTranslations('about');
  const tHero = useTranslations('hero');
  const locale = useLocale() as Locale;
  const internships = publishable(timeline).filter((i) => i.kind === 'internship');

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container-x about-grid">
        <div data-reveal>
          <p className="eyebrow m-0">{t('index')}</p>
          <h2 id="about-title" className="display-title mt-4 mb-0">
            {t('title')}
          </h2>
          {/* phones only (approved mobile design): a short greeting under the ID card */}
          <p className="about-greeting">
            {t('greeting')} <Icon name="heart" size={20} />
          </p>
          <p className="about-body">
            {t('body')}
          </p>

          <ul className="about-facts">
            <li>
              <span className="about-facts__icon"><Icon name="graduation" size={24} /></span>
              <span>
                {profile.education[locale]}
              </span>
            </li>
            <li className="about-facts__mobile">
              <span className="about-facts__icon"><Icon name="mapPin" size={22} /></span>
              <span>{profile.location[locale]}</span>
            </li>
            {internships.map((item) => (
              <li key={item.id}>
                <span className="about-facts__icon"><Icon name="briefcase" size={22} /></span>
                <span>
                  {item.title[locale]}
                  {item.organisation ? ` — ${item.organisation}` : ''}
                  <VerifyBadge item={item} />
                  {item.detail && <small>{item.detail[locale]}</small>}
                </span>
              </li>
            ))}
            <li>
              <span className="about-facts__icon"><Icon name="star" size={20} /></span>
              <span>
                {profile.certifications.map((c) => c[locale]).join(' · ')}
                <small>{t('certificationsLabel')}</small>
              </span>
            </li>
            <li>
              <span className="about-facts__icon"><Icon name="globe" size={22} /></span>
              <span>
                {profile.languages.map((l) => l[locale]).join(' · ')}
                <small>{t('languagesLabel')}</small>
              </span>
            </li>
          </ul>

          <p className="about-strengths__label">{t('strengthsLabel')}</p>
          <ul className="about-strengths">
            {profile.strengths.map((s) => (
              <li key={s.en} className="chip">
                {s[locale]}
              </li>
            ))}
          </ul>

          <a href="#experience" className="btn btn--outline about-journey">
            {t('journey')} <Icon name="arrowUpRight" size={18} />
          </a>
          {profile.cvUrl ? (
            <a href={profile.cvUrl} className="btn btn--primary about-cv" download>
              {tHero('downloadCv')} <Icon name="download" size={18} />
            </a>
          ) : (
            <span className="btn btn--outline" aria-disabled="true">
              {t('cvSoon')}
            </span>
          )}
        </div>

        <div className="about-card" data-reveal>
          <IdCard
            labels={{
              card: t('cardLabel'),
              flip: t('flipHint'),
              idTitle: t('idTitle'),
              education: t('educationLabel'),
              interests: t('interestsLabel'),
              experience: t('experienceLabel'),
              status: t('status'),
              statusValue: t('statusValue'),
              languages: t('languagesLabel'),
              photoPending: t('photoPending'),
              photoAlt: t('photoAlt'),
            }}
            photo={profile.photo}
            name={profile.name}
            title={profile.title[locale]}
            monogram={profile.monogram}
            education={profile.educationShort[locale]}
            interests={profile.interests.map((i) => i[locale])}
            languages={profile.languages.map((l) => l[locale].replace(' — ', ' ')).join(' · ')}
            experience={internships.map((i) => ({
              id: i.id,
              text: `${i.title[locale]}${i.organisation ? ` — ${i.organisation}` : ''}`,
              detail: i.detail?.[locale],
              verified: i.verified,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
