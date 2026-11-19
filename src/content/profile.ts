import type { ContactLink, L10n } from './types';
import { asset } from '@/lib/asset';

export const profile = {
  name: 'Ranim Doggaz',
  shortName: 'Ranim',
  firstName: 'Ranim',
  lastName: 'Doggaz',
  monogram: 'R/',
  title: { en: 'Full-Stack Developer', fr: 'Développeuse Full-Stack' } satisfies L10n,
  intro: {
    en: 'I build modern, secure and intelligent web experiences that transform ideas into meaningful digital products.',
    fr: 'Je conçois des expériences web modernes, sécurisées et intelligentes qui transforment les idées en produits numériques porteurs de sens.',
  } satisfies L10n,
  education: {
    en: 'Final-year IT bachelor’s student — Software Engineering & Information Systems (GLSI), Leaders University',
    fr: 'Étudiante en dernière année de licence en informatique — Génie Logiciel et Systèmes d’Information (GLSI), Leaders University',
  } satisfies L10n,
  /** Compact version for the back of the ID card. */
  educationShort: {
    en: 'Software Engineering & Information Systems (GLSI) · Leaders University · 2024 – 2027',
    fr: 'Génie Logiciel et Systèmes d’Information (GLSI) · Leaders University · 2024 – 2027',
  } satisfies L10n,
  /** Spoken languages, as on the CV. */
  languages: [
    { en: 'Arabic — native', fr: 'Arabe — langue maternelle' },
    { en: 'English — C1', fr: 'Anglais — C1' },
    { en: 'French — B2', fr: 'Français — B2' },
    { en: 'Korean — A2', fr: 'Coréen — A2' },
    { en: 'Italian — A1', fr: 'Italien — A1' },
  ] satisfies L10n[],
  /** Certifications listed on the CV (no issuer or date given there). */
  certifications: [
    { en: 'Python Certificate', fr: 'Certificat Python' },
    { en: 'Soft Skills Certificate', fr: 'Certificat en compétences comportementales' },
  ] satisfies L10n[],
  /** Personal skills listed on the CV. */
  strengths: [
    { en: 'Problem-solving', fr: 'Résolution de problèmes' },
    { en: 'Teamwork & collaboration', fr: 'Travail d’équipe & collaboration' },
    { en: 'Adaptability', fr: 'Adaptabilité' },
    { en: 'Communication', fr: 'Communication' },
    { en: 'Critical thinking', fr: 'Esprit critique' },
    { en: 'Self-learning', fr: 'Autoformation' },
    { en: 'Creativity', fr: 'Créativité' },
    { en: 'Flexibility', fr: 'Flexibilité' },
    { en: 'Attention to detail', fr: 'Souci du détail' },
  ] satisfies L10n[],
  /** Public location, as on the CV. */
  location: { en: 'Nabeul, Tunisia', fr: 'Nabeul, Tunisie' } satisfies L10n,
  interests: [
    { en: 'Full-stack web development', fr: 'Développement web full-stack' },
    { en: 'Software engineering', fr: 'Génie logiciel' },
    { en: 'Cybersecurity & ethical hacking', fr: 'Cybersécurité & hacking éthique' },
    { en: 'Artificial intelligence & machine learning', fr: 'Intelligence artificielle & machine learning' },
    { en: 'Modern user interfaces', fr: 'Interfaces utilisateur modernes' },
    { en: 'Secure application architecture', fr: 'Architecture applicative sécurisée' },
  ] satisfies L10n[],
  /**
   * Put the real PDF in /public/cv/ and set the path here, e.g. '/cv/ranim-doggaz-cv.pdf'.
   * While null, every "Download CV" control is hidden.
   * Public copy of the 16 Nov 2026 CV, which has no phone number (verified: text layer, annotations
   * and metadata contain no phone). Ranim's original file is left untouched outside the project.
   */
  cvUrl: asset('/cv/ranim-doggaz-cv.pdf') as string | null,
  /**
   * Ranim's own portrait for the About ID card. Put the photo in /public/profile/ and set e.g.
   * { src: '/profile/ranim.jpg', width: 1200, height: 1500 }. While null, a neutral portrait
   * placeholder is shown (never a generated face).
   */
  photo: { src: asset('/profile/ranim-doggaz.webp'), width: 1000, height: 1000 } as { src: string; width: number; height: number } | null,
};

/**
 * Contact links. Only add links Ranim has confirmed; unverified ones never reach production.
 */
export const contactLinks: ContactLink[] = [
  {
    kind: 'email',
    label: 'ranimedogaz1234@gmail.com',
    href: 'mailto:ranimedogaz1234@gmail.com',
    verified: true,
    source: 'CV; Ranim approved publishing it.',
  },
  {
    kind: 'linkedin',
    label: 'in/ranim-d-9384673a6',
    href: 'https://www.linkedin.com/in/ranim-d-9384673a6/',
    verified: true,
    source: 'CV (embedded link); Ranim approved publishing it.',
  },
  {
    kind: 'github',
    label: 'ranimedogaz1234-dot',
    href: 'https://github.com/ranimedogaz1234-dot',
    verified: true,
    source: 'Confirmed by Ranim.',
  },
  // The phone number on the CV stays private (not published).
];
