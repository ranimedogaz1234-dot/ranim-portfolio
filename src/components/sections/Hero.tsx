import { useLocale, useTranslations } from 'next-intl';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';
import { timeline } from '@/content/experience';
import { publishable } from '@/content/verification';
import type { Locale } from '@/i18n/routing';
import { HeroButterfly } from '@/components/visuals/HeroButterfly';
import { HeroCompanions } from '@/components/visuals/HeroCompanions';
import { AmbientToggle } from './AmbientToggle';
import { HeroEffect } from './HeroEffect';
import { Icon } from '@/components/ui/Icon';

const pad = (n: number) => String(n).padStart(2, '0');

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale() as Locale;

  // Counts come from the content files, so they stay true as content changes.
  const projectCount = projects.length;
  const techCount = publishable(skills).length;
  const internships = publishable(timeline).filter((item) => item.kind === 'internship').length;
  const techRounded = techCount >= 10 ? Math.floor(techCount / 10) * 10 : techCount;

  const stats = [
    { value: pad(projectCount), plus: false, label: t('statProjects') },
    { value: pad(techRounded), plus: techCount > techRounded, label: t('statTech') },
    ...(internships > 0 ? [{ value: pad(internships), plus: false, label: t('statInternship', { count: internships }) }] : []),
  ];

  return (
    <section id="home" className="hero" aria-labelledby="hero-name">
      <div className="hero__art">
        <HeroButterfly />
      </div>
      <HeroCompanions />

      <div className="container-x hero__grid">
        <div className="hero__copy">
          <p className="eyebrow m-0" data-hero-in>
            {t('eyebrow')}
          </p>

          <h1 id="hero-name" className="m-0">
            <span className="hero__name" data-hero-in>
              <span className="hero__name-line">{profile.firstName}</span>{' '}
              <span className="hero__name-line hero__name-line--last">
                {profile.lastName}
                <svg className="hero__flourish" viewBox="0 0 200 120" aria-hidden="true">
                  <defs>
                    <linearGradient id="flourish" x1="0" x2="1">
                      <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
                      <stop offset="1" stopColor="#d9c2ff" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M2 96 C 40 128, 92 112, 132 70 C 150 52, 170 40, 198 42"
                    fill="none"
                    stroke="url(#flourish)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    style={{ color: 'var(--accent)' }}
                  />
                </svg>
              </span>
            </span>
            <span className="sr-only">, </span>
            <span className="hero__role block" data-hero-in>
              {profile.title[locale]}
            </span>
          </h1>

          <p className="hero__intro" data-hero-in>
            {profile.intro[locale]}
          </p>

          <div className="hero__actions" data-hero-in>
            <a href="#projects" className="btn btn--primary">
              {t('explore')} <Icon name="arrowUpRight" size={18} />
            </a>
            <a href="#about" className="btn btn--outline">
              {t('about')}
            </a>
            <AmbientToggle />
          </div>

          <dl className="hero__stats m-0" data-hero-in>
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="m-0">
                  <div className="stat__value">
                    {s.value}
                    <span className="stat__plus">{s.plus ? '+' : ''}</span>
                  </div>
                  <div className="stat__label" aria-hidden="true">
                    {s.label}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="hero__effect-wrap container-x">
        <HeroEffect />
      </div>

      {/* phones only: scroll cue at the foot of the screen (approved mobile design) */}
      <a href="#about" className="hero__cue" aria-label={t('about')}>
        <Icon name="chevronDown" size={22} />
        <Icon name="chevronDown" size={22} />
      </a>
    </section>
  );
}
