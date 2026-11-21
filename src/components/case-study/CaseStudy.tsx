import type { CSSProperties, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { projects } from '@/content/projects';
import { skillById } from '@/content/skills';
import type { L10n, Project, Skill } from '@/content/types';
import { SHOW_UNVERIFIED } from '@/content/verification';
import { Icon } from '@/components/ui/Icon';
import { TechIcon } from '@/components/ui/TechIcon';
import { CaseStudyLangSwitch } from './CaseStudyLangSwitch';
import { ScreenGallery } from './ScreenGallery';
import { VariantArt } from './VariantArt';

const fontVar: Record<Project['theme']['font'], string> = {
  serif: 'var(--font-playfair), Georgia, serif',
  sans: 'var(--font-inter), system-ui, sans-serif',
  grotesk: 'var(--font-grotesk), system-ui, sans-serif',
  rounded: 'var(--font-nunito), system-ui, sans-serif',
};

type T = ReturnType<typeof useTranslations<'caseStudy'>>;

function Pending({ t, text }: { t: T; text?: string }) {
  return (
    <div className="cs-placeholder">
      <strong>{t('pending')}</strong>
      <span>{text ?? t('pendingText')}</span>
    </div>
  );
}

function Section({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section className="cs-section" aria-labelledby={`cs-${id}`}>
      <div className="cs-wrap cs-grid">
        <div>
          <span className="cs-index" aria-hidden="true">
            {String(n).padStart(2, '0')}
          </span>
          <h2 id={`cs-${id}`} className="cs-h2">
            {title}
          </h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function List({ items, locale }: { items: L10n[]; locale: Locale }) {
  return (
    <ul className="cs-list">
      {items.map((item) => (
        <li key={item.en}>{item[locale]}</li>
      ))}
    </ul>
  );
}

/**
 * A project case study rendered as its own small website: no butterflies, no liquid glass,
 * no portfolio chrome — only the project's identity (colours, type, radius and a decorative
 * personality from `project.theme`).
 */
export function CaseStudy({ project, locale }: { project: Project; locale: Locale }) {
  const t = useTranslations('caseStudy');
  const tp = useTranslations('projects');
  const ta = useTranslations('a11y');
  const { colors } = project.theme;
  const style = {
    '--cs-bg': colors.bg,
    '--cs-surface': colors.surface,
    '--cs-text': colors.text,
    '--cs-muted': colors.muted,
    '--cs-accent': colors.accent,
    '--cs-accent-contrast': colors.accentContrast,
    '--cs-line': colors.line,
    '--cs-radius': project.theme.radius,
    '--cs-font': fontVar[project.theme.font],
  } as CSSProperties;
  const stack = project.stack.map(skillById).filter((s): s is Skill => !!s);
  const cs = project.caseStudy;
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length]!;
  const prev = projects[(index - 1 + projects.length) % projects.length]!;
  const categories = project.categories.map((c) => tp(`filters.${c}`)).join(' · ');
  const hasChallenges = (cs.challenges?.length ?? 0) > 0;
  let n = 0;

  return (
    <div className="cs" style={style} data-variant={project.theme.variant}>
      <a href="#cs-main" className="skip-link">
        {ta('skipToContent')}
      </a>
      <header className="cs-header">
        <div className="cs-wrap cs-header__inner">
          <Link href={{ pathname: '/', hash: 'projects' }} className="cs-back">
            <Icon name="chevronLeft" size={16} /> {t('back')}
          </Link>
          <span className="cs-wordmark">{project.title}</span>
          <CaseStudyLangSwitch />
        </div>
      </header>

      <main id="cs-main">
        {/* Title + category */}
        <section className="cs-hero" aria-labelledby="cs-title">
          <VariantArt variant={project.theme.variant} />
          <div className="cs-wrap cs-hero__inner">
            <p className="cs-kicker m-0">
              <span className="sr-only">{t('category')}: </span>
              {categories}
            </p>
            <h1 id="cs-title" className="cs-h1">
              {project.title}
            </h1>
            {project.alias && <p className="cs-alias">{t('alias', { name: project.alias })}</p>}
            <p className="cs-lead">{project.tagline[locale]}</p>
            <div className="cs-hero__actions">
              {project.repoUrl && (
                <a className="cs-btn cs-btn--solid" href={project.repoUrl} target="_blank" rel="noreferrer">
                  <Icon name="github" size={16} /> {t('repo')}
                </a>
              )}
              {project.demoUrl && (
                <a className="cs-btn" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  {t('demo')} <Icon name="externalLink" size={16} /> <span className="sr-only">{ta('newTab')}</span>
                </a>
              )}
              {stack.length > 0 && (
                <ul className="cs-hero__stack">
                  {stack.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                </ul>
              )}
            </div>
            {SHOW_UNVERIFIED && !project.reviewed && (
              <p className="cs-note">
                <Icon name="sparkle" size={14} /> {t('draftNote')} {t('identityNote')}: {project.theme.identityNote}
              </p>
            )}
          </div>
        </section>

        <Section id="overview" n={++n} title={t('sections.overview')}>
          {cs.overview ? <p className="cs-lead m-0">{cs.overview[locale]}</p> : <Pending t={t} />}
        </Section>

        <Section id="technologies" n={++n} title={t('sections.technologies')}>
          {stack.length > 0 ? (
            <ul className="cs-tech">
              {stack.map((s) => (
                <li key={s.id} className="cs-card cs-tech__item">
                  <TechIcon skill={s} size={28} />
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Pending t={t} text={t('pendingStack')} />
          )}
        </Section>

        <Section id="features" n={++n} title={t('sections.features')}>
          {cs.features && cs.features.length > 0 ? <List items={cs.features} locale={locale} /> : <Pending t={t} />}
        </Section>

        <section className="cs-section" aria-labelledby="cs-screens">
          <div className="cs-wrap">
            <span className="cs-index" aria-hidden="true">
              {String(++n).padStart(2, '0')}
            </span>
            <h2 id="cs-screens" className="cs-h2 mb-8">
              {t('sections.screens')}
            </h2>
            <ScreenGallery shots={project.cover ? [project.cover, ...project.gallery] : project.gallery} title={project.title} locale={locale} />
          </div>
        </section>

        <Section id="implementation" n={++n} title={t('sections.implementation')}>
          {cs.architecture ? <p className="cs-lead m-0">{cs.architecture[locale]}</p> : <Pending t={t} />}
        </Section>

        {cs.status && (
          <Section id="status" n={++n} title={t('sections.status')}>
            <p className="cs-lead m-0">{cs.status[locale]}</p>
          </Section>
        )}

        {/* Challenges & solutions: only when verified content exists */}
        {hasChallenges && (
          <Section id="challenges" n={++n} title={t('sections.challenges')}>
            <div className="grid gap-5">
              {cs.challenges!.map((c, i) => (
                <div key={c.en} className="cs-card cs-challenge">
                  <p className="cs-challenge__label">{t('sections.challengesLabel')}</p>
                  <p className="m-0">{c[locale]}</p>
                  {cs.solutions?.[i] && (
                    <>
                      <p className="cs-challenge__label">{t('sections.solutionsLabel')}</p>
                      <p className="m-0">{cs.solutions[i]![locale]}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section id="repository" n={++n} title={t('sections.repository')}>
          {project.repoUrl ? (
            <a className="cs-btn cs-btn--solid" href={project.repoUrl} target="_blank" rel="noreferrer">
              <Icon name="github" size={16} /> {t('repo')} <span className="sr-only">{ta('newTab')}</span>
            </a>
          ) : (
            <p className="cs-muted m-0">
              <Icon name="github" size={16} /> {t('repoPending')}
            </p>
          )}
        </Section>
      </main>

      <footer className="cs-next">
        <nav className="cs-wrap cs-next__inner" aria-label={`${t('previous')} / ${t('next')}`}>
          <Link href={`/projects/${prev.slug}`} className="cs-next__link cs-next__link--prev">
            <span className="cs-next__label">
              <Icon name="chevronLeft" size={16} /> {t('previous')}
            </span>
            <span className="cs-next__title">{prev.title}</span>
          </Link>
          <Link href={`/projects/${next.slug}`} className="cs-next__link cs-next__link--next">
            <span className="cs-next__label">
              {t('next')} <Icon name="chevronRight" size={16} />
            </span>
            <span className="cs-next__title">{next.title}</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
