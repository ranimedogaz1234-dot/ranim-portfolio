import type { Locale } from '@/i18n/routing';

/** A string written in both supported languages. */
export type L10n = Record<Locale, string>;

export function l(text: L10n, locale: Locale): string {
  return text[locale];
}

/**
 * Anything shown publicly must be confirmed by Ranim (CV, repositories, certificates).
 * `verified: false` items appear only in development (with a visible badge) and are
 * removed from production builds — see `src/content/verification.ts`.
 */
export interface Verifiable {
  verified: boolean;
  /** Where the information came from, for whoever reviews it. Never rendered. */
  source?: string;
}

export type SkillCategory =
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'databases'
  | 'auth'
  | 'tools'
  | 'design'
  | 'security'
  | 'other';

export interface Skill extends Verifiable {
  id: string;
  name: string;
  /** Periodic-table style symbol (1–3 chars). */
  symbol: string;
  category: SkillCategory;
  /** Devicon slug + variant, e.g. "react/react-original". Missing icons fall back to the symbol. */
  icon?: string;
  /** Monochrome logo that needs inverting on the dark theme. */
  mono?: boolean;
  /** Neutral description of the technology (not a proficiency claim). */
  description: L10n;
}

export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'data' | 'security' | 'ai';

export interface ProjectScreenshot {
  /** Path under /public, e.g. "/projects/sayara/home.webp". Real screenshots only. */
  src: string;
  width: number;
  height: number;
  alt: L10n;
  /**
   * Desktop screenshots are framed in a browser window, mobile ones in a phone frame,
   * and `app` ones (desktop applications) in an application window.
   */
  device?: 'desktop' | 'mobile' | 'app';
}

export interface CaseStudyTheme {
  /** Free-text note on where the identity comes from. */
  identityNote: string;
  colors: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentContrast: string;
    line: string;
  };
  font: 'serif' | 'sans' | 'grotesk' | 'rounded';
  radius: string;
  /**
   * Page personality for the case-study site (decorative only — never fake content):
   * analytics · calm · playful · luxury · travel · editorial · retail · clinical · fintech
   */
  variant: 'analytics' | 'calm' | 'playful' | 'luxury' | 'travel' | 'editorial' | 'retail' | 'clinical' | 'fintech';
}

export interface CaseStudySectionContent {
  overview?: L10n;
  features?: L10n[];
  /** Technical implementation. */
  architecture?: L10n;
  challenges?: L10n[];
  solutions?: L10n[];
  contributions?: L10n[];
  /** Only measurable, verified results. */
  results?: L10n[];
  /** Current development status, when the project is still in progress. */
  status?: L10n;
  /** Measured performance work. Say where the numbers come from (e.g. synthetic data). */
  performance?: L10n[];
  /** Automated tests and CI, with counts checked against the repository. */
  testing?: L10n[];
  /** Security measures verified in the source — never a claim of invulnerability. */
  security?: L10n[];
}

export interface Project {
  slug: string;
  title: string;
  /** Other name the project is known by (e.g. the app's in-product name). */
  alias?: string;
  categories: ProjectCategory[];
  featured?: boolean;
  tagline: L10n;
  /** Skill ids from skills.ts — shown as technology icons. Empty until confirmed. */
  stack: string[];
  /** Repo / demo URLs: null until Ranim provides them. Never guessed. */
  repoUrl: string | null;
  demoUrl: string | null;
  cover: ProjectScreenshot | null;
  gallery: ProjectScreenshot[];
  caseStudy: CaseStudySectionContent;
  theme: CaseStudyTheme;
  /** Set to true once Ranim has checked the tagline/stack against the repository. */
  reviewed: boolean;
}

export type TimelineKind = 'internship' | 'education' | 'diploma';

export interface TimelineItem extends Verifiable {
  id: string;
  kind: TimelineKind;
  /** Only confirmed dates. Omit until verified — the entry then shows its kind instead. */
  period?: L10n;
  title: L10n;
  organisation?: string;
  detail?: L10n;
  /** What was done there (from the CV). */
  highlights?: L10n[];
}

export interface ContactLink extends Verifiable {
  kind: 'github' | 'linkedin' | 'email' | 'cv';
  label: string;
  href: string;
}
