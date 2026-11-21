'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { projectCategories, projects } from '@/content/projects';
import { skillById } from '@/content/skills';
import type { Project, ProjectCategory, Skill } from '@/content/types';
import { SHOW_UNVERIFIED } from '@/content/verification';
import { Icon, type IconName } from '@/components/ui/Icon';
import { TechIcon } from '@/components/ui/TechIcon';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';

type Filter = 'all' | ProjectCategory;
const filterIcon: Partial<Record<Filter, IconName>> = {
  web: 'web',
  mobile: 'mobile',
  desktop: 'desktop',
  data: 'chart',
  security: 'shield',
};

/** Signed distance from the active card on a circular track. */
function offsetOf(i: number, active: number, n: number) {
  let d = i - active;
  if (n > 2) {
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
  }
  return d;
}

/**
 * Perspective placement of a card `d` steps from the centre (the reference fan).
 * Each card carries its own perspective (no shared 3D scene), so the stacking order is decided
 * by z-index alone and a rotated side card can never slice through the featured card.
 */
function placement(d: number, cardWidth: number, compact: boolean) {
  const a = Math.abs(d);
  const s = Math.sign(d);
  if (a === 0) return { x: 0, rotateY: 0, scale: 1, opacity: 1 };
  if (compact) {
    // phones (approved mobile design): a flat row — one card, the neighbours peeking at the edges
    const step = cardWidth * 0.95 + 14;
    if (a === 1) return { x: s * step, rotateY: 0, scale: 0.9, opacity: 0.8 };
    return { x: s * step * 2, rotateY: 0, scale: 0.86, opacity: 0 };
  }
  if (a === 1) return { x: s * cardWidth * 0.78, rotateY: -s * 34, scale: 0.84, opacity: 1 };
  if (a === 2) return { x: s * cardWidth * 1.3, rotateY: -s * 40, scale: 0.7, opacity: 0.92 };
  return { x: s * cardWidth * 1.6, rotateY: -s * 44, scale: 0.58, opacity: 0 };
}

function stackOf(project: Project): Skill[] {
  return project.stack.map(skillById).filter((s): s is Skill => !!s);
}

export function Projects() {
  const t = useTranslations('projects');
  const ta = useTranslations('a11y');
  const locale = useLocale() as Locale;
  const { reduced } = useMotionPrefs();
  const [filter, setFilter] = useState<Filter>('all');
  const list = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  );
  const [active, setActive] = useState(() => Math.max(0, projects.findIndex((p) => p.featured)));
  const [cardWidth, setCardWidth] = useState(560);
  const [stageHeight, setStageHeight] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const swipedAt = useRef(0);

  useEffect(() => {
    setActive(Math.max(0, list.findIndex((p) => p.featured)));
  }, [list]);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setCardWidth(el.offsetWidth);
      setCompact(window.innerWidth < 768);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // the stage is as tall as the featured card (content length varies per project)
  useEffect(() => {
    const el = centerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, list]);

  const n = list.length;
  const go = useCallback((step: number) => n > 0 && setActive((a) => (a + step + n) % n), [n]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      go(1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      go(-1);
      e.preventDefault();
    }
  };
  const onPointerDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swipedAt.current = performance.now(); // the click that ends a swipe must not open a link
      go(dx < 0 ? 1 : -1);
    }
  };

  const current = list[active];

  return (
    <section id="projects" className="section section--projects" aria-labelledby="projects-title">
      <div className="container-x">
        <div className="projects-head">
          <div data-reveal>
            <p className="eyebrow m-0">{t('index')}</p>
            <h2 id="projects-title" className="display-title projects-title mb-0">
              {t('title')}
            </h2>
            <p className="section-intro">{t('intro')}</p>
          </div>
          <div className="filters projects-filters" role="group" aria-label={t('filterLabel')} data-reveal>
            {(['all', ...projectCategories] as Filter[]).map((c) => (
              <button key={c} type="button" className="filter-btn" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {filterIcon[c] && <Icon name={filterIcon[c]} size={18} />}
                {t(`filters.${c}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label={t('carouselLabel')}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
        onClickCapture={(e) => {
          if (performance.now() - swipedAt.current > 400) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        style={stageHeight ? { height: stageHeight + 40 } : undefined}
        data-reveal
      >
        {/* invisible card used only to measure the responsive card width */}
        <div ref={measureRef} className="pcard pcard--measure" aria-hidden="true" />

        <p className="sr-only" aria-live="polite">
          {current ? `${t('slideOf', { current: active + 1, total: n })}: ${current.title}` : t('empty')}
        </p>

        {n === 0 ? (
          <p className="grid h-full place-items-center" style={{ color: 'var(--muted)' }}>
            {t('empty')}
          </p>
        ) : (
          <div className="carousel__track">
            {list.map((project, i) => {
              const d = offsetOf(i, active, n);
              const p = placement(d, cardWidth, compact);
              const isCenter = d === 0;
              const hidden = p.opacity === 0;
              return (
                <motion.div
                  key={project.slug}
                  ref={isCenter ? centerRef : undefined}
                  className={`pcard glass ${isCenter ? 'pcard--center' : 'pcard--side'}`}
                  style={{
                    zIndex: 20 - Math.abs(d) * 2,
                    marginLeft: -cardWidth / 2,
                    pointerEvents: hidden ? 'none' : 'auto',
                    transformPerspective: 1800,
                  }}
                  initial={false}
                  animate={{ x: p.x, rotateY: p.rotateY, scale: p.scale, opacity: p.opacity }}
                  transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 22, mass: 0.9 }}
                  aria-hidden={hidden || undefined}
                  inert={hidden || undefined}
                >
                  {isCenter ? (
                    <CenterCard project={project} locale={locale} t={t} />
                  ) : (
                    <button
                      type="button"
                      className="pcard__select"
                      onClick={() => setActive(i)}
                      tabIndex={Math.abs(d) === 1 ? 0 : -1}
                      aria-label={`${ta('goToProject', { n: i + 1 })}: ${project.title}`}
                    >
                      <SideCard project={project} locale={locale} t={t} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {n > 1 && (
          <>
            <button type="button" className="carousel__arrow carousel__arrow--prev glass" onClick={() => go(-1)} aria-label={ta('prevProject')}>
              <Icon name="chevronLeft" size={24} />
            </button>
            <button type="button" className="carousel__arrow carousel__arrow--next glass" onClick={() => go(1)} aria-label={ta('nextProject')}>
              <Icon name="chevronRight" size={24} />
            </button>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="carousel__dots">
          {list.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              aria-label={`${ta('goToProject', { n: i + 1 })}: ${project.title}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type T = ReturnType<typeof useTranslations<'projects'>>;

function Shot({ project, locale, t, sizes }: { project: Project; locale: Locale; t: T; sizes: string }) {
  return (
    <div
      className={project.cover ? 'pcard__shot pcard__shot--framed' : 'pcard__shot'}
      data-frame={project.cover ? (project.cover.device === 'app' ? 'app' : 'browser') : undefined}
    >
      {project.cover ? (
        <>
          {/* browser-style bar for web projects, application title bar for desktop apps */}
          <span className="pcard__chrome" aria-hidden="true">
            <span className="pcard__chrome-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="pcard__chrome-label">{project.title}</span>
          </span>
          <Image
            src={project.cover.src}
            width={project.cover.width}
            height={project.cover.height}
            alt={project.cover.alt[locale]}
            sizes={sizes}
          />
        </>
      ) : (
        <div className="shot-placeholder">
          <span className="shot-placeholder__title">{project.title}</span>
          <span className="shot-placeholder__note">
            <Icon name="image" size={18} /> {t('screenshotSoon')}
          </span>
        </div>
      )}
    </div>
  );
}

function CenterCard({ project, locale, t }: { project: Project; locale: Locale; t: T }) {
  const stack = stackOf(project);
  return (
    <article aria-roledescription="slide" aria-label={project.title}>
      {/* over a placeholder the badge floats in the corner; over a real screenshot it moves next to the title */}
      {project.featured && !project.cover && (
        <span className="pcard__featured chip">
          <Icon name="star" size={13} /> {t('featured')}
        </span>
      )}
      {/* phones only: the project's category, as in the approved mobile design */}
      {project.categories[0] && <span className="pcard__badge">{t(`filters.${project.categories[0]}`)}</span>}
      <Shot project={project} locale={locale} t={t} sizes="(max-width: 768px) 86vw, 36vw" />
      <h3 className="pcard__title">
        <Link href={`/projects/${project.slug}`} className="pcard__title-link">
          {project.title}
        </Link>
        <Icon name="arrowUpRight" size={22} />
        {project.featured && project.cover && (
          <span className="pcard__featured pcard__featured--inline chip">
            <Icon name="star" size={13} /> {t('featured')}
          </span>
        )}
      </h3>
      {SHOW_UNVERIFIED && !project.reviewed && <span className="verify-badge mb-2 ml-0">⚑ {t('notReviewed')}</span>}
      <p className="pcard__desc">{project.tagline[locale]}</p>
      <ul className="pcard__stack m-0 list-none p-0">
        {stack.length > 0 ? (
          stack.map((s) => (
            <li key={s.id} className="chip tech-chip">
              <TechIcon skill={s} size={18} />
              {s.name}
            </li>
          ))
        ) : (
          <li className="chip" style={{ color: 'var(--muted)' }}>
            {t('stackSoon')}
          </li>
        )}
      </ul>
      <div className="pcard__actions">
        <Link href={`/projects/${project.slug}`} className="btn btn--primary">
          {t('viewProject')} <Icon name="arrowUpRight" size={18} />
        </Link>
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            className="btn btn--outline btn--icon"
            target="_blank"
            rel="noreferrer"
            aria-label={`${t('github')} — ${project.title}`}
          >
            <Icon name="github" size={22} />
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            className="btn btn--outline btn--icon"
            target="_blank"
            rel="noopener noreferrer"
            title={t('liveDemo')}
            aria-label={`${t('liveDemo')} — ${project.title} ${t('newTab')}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="externalLink" size={22} />
          </a>
        )}
      </div>
    </article>
  );
}

function SideCard({ project, locale, t }: { project: Project; locale: Locale; t: T }) {
  const stack = stackOf(project);
  return (
    <span className="block">
      <Shot project={project} locale={locale} t={t} sizes="24vw" />
      <span className="pcard__title">{project.title}</span>
      <span className="pcard__desc block">{project.tagline[locale]}</span>
      <span className="pcard__stack" aria-hidden="true">
        {stack.slice(0, 3).map((s) => (
          <span key={s.id} className="tech-dot">
            <TechIcon skill={s} size={20} />
          </span>
        ))}
      </span>
    </span>
  );
}
