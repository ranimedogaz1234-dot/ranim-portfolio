'use client';

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { categoryHue, skillCategories, skills } from '@/content/skills';
import { publishable } from '@/content/verification';
import type { Skill, SkillCategory } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import { TechIcon } from '@/components/ui/TechIcon';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { Icon } from '@/components/ui/Icon';
import { MOBILE_QUERY, useMediaQuery } from '@/lib/useMediaQuery';

type Filter = 'all' | SkillCategory;

/** Phones show a compact grid: this many tiles until "View more" is tapped. */
const COMPACT = 9;
/** The nine shown first under "All" on phones — core programming, frontend and backend. */
const PRIORITY = ['java', 'python', 'javascript', 'react', 'angular', 'nextjs', 'springboot', 'php', 'c'];

export function Skills() {
  const t = useTranslations('skills');
  const ta = useTranslations('a11y');
  const locale = useLocale() as Locale;
  const { reduced } = useMotionPrefs();
  const visibleSkills = useMemo(() => publishable(skills), []);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const mobile = useMediaQuery(MOBILE_QUERY);
  const [expanded, setExpanded] = useState(false);
  const expandFrom = useRef<number | null>(null);

  const numbered = useMemo(() => visibleSkills.map((s, i) => ({ skill: s, n: i + 1 })), [visibleSkills]);
  const shown = filter === 'all' ? numbered : numbered.filter(({ skill }) => skill.category === filter);
  // the inspector follows hover / keyboard focus, and falls back to the pinned (clicked) tile
  // phones: the first nine (priority list under "All", else the category's first nine)
  const topIds = useMemo(() => {
    const ids = shown.map(({ skill }) => skill.id);
    if (filter !== 'all') return new Set(ids.slice(0, COMPACT));
    const top = PRIORITY.filter((id) => ids.includes(id));
    for (const id of ids) if (top.length < COMPACT && !top.includes(id)) top.push(id);
    return new Set(top);
  }, [shown, filter]);
  const hasMore = shown.length > COMPACT;
  // touch screens have no hover: on phones the inspector shows the tapped tile only
  const inspectedId = mobile ? selectedId : (hoverId ?? selectedId);
  const selected: Skill | undefined = visibleSkills.find((s) => s.id === inspectedId);
  const selectedNumber = numbered.find(({ skill }) => skill.id === inspectedId)?.n;
  const categories = skillCategories.filter((c) => visibleSkills.some((s) => s.category === c));

  const onGridKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key) || !gridRef.current) return;
    const buttons = Array.from(gridRef.current.querySelectorAll<HTMLButtonElement>('button.ptile'));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    const cols = getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length || 1;
    const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols, Home: -index, End: buttons.length } as const;
    const next = Math.max(0, Math.min(buttons.length - 1, index + delta[e.key as keyof typeof delta]));
    buttons[next]?.focus();
    e.preventDefault();
  };

  const chooseFilter = (c: Filter) => {
    setFilter(c);
    setExpanded(false);
    if (mobile) setSelectedId(null); // the inspector panel would otherwise point off-grid
  };

  // smooth expand / collapse: the grid's wrapper animates between the two measured heights
  const animateHeight = (from: number, to: number, done?: () => void) => {
    const el = wrapRef.current;
    if (!el || reduced || from === to) return done?.();
    el.style.overflow = 'hidden';
    const anim = el.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 520, easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)' });
    anim.onfinish = anim.oncancel = () => {
      el.style.overflow = '';
      done?.();
    };
  };
  const toggleMore = () => {
    const el = wrapRef.current;
    const grid = gridRef.current;
    if (!el || !grid) return;
    if (!expanded) {
      expandFrom.current = el.offsetHeight;
      setExpanded(true);
      return;
    }
    const from = el.offsetHeight;
    grid.setAttribute('data-collapsed', '');
    const to = el.offsetHeight;
    grid.removeAttribute('data-collapsed');
    const collapse = () =>
      animateHeight(from, to, () => {
        setExpanded(false);
        requestAnimationFrame(() => moreRef.current?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }));
      });
    // a long list: go back to the top of the grid first, so the collapse happens in view
    const top = el.getBoundingClientRect().top;
    if (top < 0) {
      window.scrollTo({ top: window.scrollY + top - 140, behavior: reduced ? 'auto' : 'smooth' });
      window.setTimeout(collapse, reduced ? 0 : 480);
    } else collapse();
  };
  useLayoutEffect(() => {
    if (!expanded || expandFrom.current == null || !wrapRef.current) return;
    animateHeight(expandFrom.current, wrapRef.current.offsetHeight);
    expandFrom.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container-x">
        <div data-reveal>
          <p className="eyebrow m-0">{t('index')}</p>
          <h2 id="skills-title" className="display-title mt-4 mb-0">
            {t('title')}
          </h2>
          <p className="section-intro">
            {t('intro')}
          </p>
        </div>

        <div className="filters skills-filters" role="group" aria-label={t('filterLabel')} data-reveal>
          {(['all', ...categories] as Filter[]).map((c) => (
            <button
              key={c}
              type="button"
              className="filter-btn"
              aria-pressed={filter === c}
              onClick={() => chooseFilter(c)}
            >
              {c === 'all' ? t('all') : t(`categories.${c}`)}
            </button>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {t('count', { count: shown.length })}
        </p>

        <div className="skills-layout" data-reveal>
          <div ref={wrapRef} className="ptable-wrap">
          <LayoutGroup>
            <ul
              ref={gridRef}
              id="skills-grid"
              className="ptable"
              onKeyDown={onGridKey}
              data-collapsed={hasMore && !expanded ? '' : undefined}
              data-expanded={expanded ? '' : undefined}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map(({ skill, n }) => (
                  <motion.li
                    key={skill.id}
                    data-top={topIds.has(skill.id) ? '' : undefined}
                    layout={!reduced}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: reduced ? 0 : 0.28 }}
                  >
                    <button
                      type="button"
                      className="ptile glass"
                      aria-pressed={selectedId === skill.id}
                      aria-describedby={selectedId === skill.id ? 'skill-detail' : undefined}
                      onClick={() => setSelectedId((id) => (id === skill.id ? null : skill.id))}
                      onPointerMove={onPointerMove}
                      onPointerEnter={(e) => e.pointerType === 'mouse' && setHoverId(skill.id)}
                      onPointerLeave={() => setHoverId(null)}
                      onFocus={() => setHoverId(skill.id)}
                      onBlur={() => setHoverId(null)}
                      style={{ '--hue': categoryHue[skill.category] } as CSSProperties}
                    >
                      <span className="ptile__num" aria-hidden="true">
                        {String(n).padStart(2, '0')}
                      </span>
                      <span className="ptile__sym" aria-hidden="true">
                        {skill.symbol}
                      </span>
                      <span className="ptile__icon" aria-hidden="true">
                        <TechIcon skill={skill} size={44} />
                      </span>
                      <span className="ptile__name">{skill.name}</span>
                      <span className="ptile__cat" aria-hidden="true">
                        {skill.category === 'security' ? t('categoriesShort.security') : t(`categories.${skill.category}`)}
                      </span>
                      {!skill.verified && <span className="sr-only">{ta('needsVerification')}</span>}
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </LayoutGroup>
          </div>

          <aside className="skill-detail glass" id="skill-detail" aria-live="polite" data-empty={selected ? undefined : ''}>
            {/* the inspector follows the pointer instantly: the new entry replaces the old one at
                once and fades in (no exit animation to wait for) */}
            <>
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="skill-detail__head">
                    <span className="skill-detail__num">{selectedNumber ? String(selectedNumber).padStart(2, '0') : ''}</span>
                    <span className="skill-detail__sym" style={{ color: categoryHue[selected.category] }}>
                      {selected.symbol}
                    </span>
                  </div>
                  <span className="skill-detail__icon" aria-hidden="true">
                    <TechIcon skill={selected} size={88} />
                  </span>
                  <h3 className="skill-detail__name">{selected.name}</h3>
                  <p className="skill-detail__cat" style={{ color: categoryHue[selected.category] }}>
                    <span className="skill-detail__swatch" style={{ background: categoryHue[selected.category] }} />
                    {t('category')} · {t(`categories.${selected.category}`)}
                  </p>
                  <p className="skill-detail__desc">{selected.description[locale]}</p>
                </motion.div>
              ) : (
                <motion.p key="empty" className="skill-detail__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {t('detailEmpty')}
                </motion.p>
              )}
            </>
          </aside>
        </div>

        {/* phones only: the compact grid opens and closes here (the category stays selected) */}
        {hasMore && (
          <div className="skills-more">
            <button
              ref={moreRef}
              type="button"
              className="skills-more__btn"
              aria-expanded={expanded}
              aria-controls="skills-grid"
              onClick={toggleMore}
            >
              {expanded ? t('viewLess') : t('viewMore')}
              <Icon name="chevronDown" size={18} className={expanded ? 'skills-more__chev is-up' : 'skills-more__chev'} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
