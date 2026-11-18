import type { TimelineItem } from './types';

/**
 * Timeline — source: Ranim's CV (Nov 2026).
 * The internship's dates are not on the CV, so its `period` is omitted (the entry shows its kind).
 */
export const timeline: TimelineItem[] = [
  {
    id: 'internship-vnt',
    kind: 'internship',
    title: { en: 'Web Development Intern', fr: 'Stagiaire en développement web' },
    organisation: 'VAST New Telecom, Tunis',
    detail: { en: '1 month · Hybrid', fr: '1 mois · Hybride' },
    highlights: [
      { en: 'Learned and applied Bootstrap to web development.', fr: 'Apprentissage et utilisation de Bootstrap en développement web.' },
      { en: 'Redesigned 200 website pages, improving their visual presentation.', fr: 'Refonte de 200 pages du site, avec une présentation visuelle améliorée.' },
      { en: 'Presented design proposals to developers and collaborated on implementing changes.', fr: 'Présentation de propositions de design aux développeurs et collaboration à leur mise en œuvre.' },
    ],
    verified: true,
    source: 'CV.',
  },
  {
    id: 'bachelor-glsi',
    kind: 'education',
    period: { en: '2024 – 2027 (expected)', fr: '2024 – 2027 (prévu)' },
    title: {
      en: 'Bachelor’s Degree in Computer Science — Software Engineering & Information Systems (GLSI)',
      fr: 'Licence en informatique — Génie Logiciel et Systèmes d’Information (GLSI)',
    },
    organisation: 'Leaders University',
    detail: {
      en: 'Final year · Coursework in software engineering, programming, web development, database management, computer networking, operating systems and cybersecurity.',
      fr: 'Dernière année · Cours de génie logiciel, programmation, développement web, gestion de bases de données, réseaux informatiques, systèmes d’exploitation et cybersécurité.',
    },
    verified: true,
    source: 'CV.',
  },
  {
    id: 'high-school',
    kind: 'diploma',
    period: { en: '2020 – 2023', fr: '2020 – 2023' },
    title: { en: 'High School Diploma', fr: 'Baccalauréat' },
    detail: { en: 'Science (Mention Very Good)', fr: 'Sciences (mention Très Bien)' },
    verified: false,
    source: 'Reference mock-up only — hidden in production until confirmed.',
  },
];
