import type { CaseStudyTheme, Project, ProjectScreenshot } from './types';
import { asset } from '@/lib/asset';

/**
 * HOW TO ADD A PROJECT
 * 1. Copy one entry below and give it a unique `slug` (used in /[locale]/projects/[slug]).
 * 2. Put real screenshots in /public/projects/<slug>/ and reference them in `cover` / `gallery`
 *    with their real pixel size (`device: 'mobile'` for phone screenshots). Never recoloured.
 * 3. Fill `repoUrl` / `demoUrl` only with real links. Leave null otherwise — the buttons
 *    are then replaced by a "pending" note, never by a broken link.
 * 4. Set `reviewed: true` once tagline, stack and case-study text are checked against the repo.
 *
 * Case-study text below only restates what Ranim supplied in the portfolio brief (project
 * purpose, stack and main features). Everything else stays empty and is shown as "pending".
 * `theme` is a provisional identity for each case-study site, to align with real screenshots.
 */

const theme = (t: CaseStudyTheme) => t;

/** A real screenshot stored in /public/projects/<slug>/<name>.webp (sizes are the file's real pixels). */
const shot = (
  slug: string,
  name: string,
  width: number,
  height: number,
  en: string,
  fr: string,
  device: ProjectScreenshot['device'] = 'desktop',
): ProjectScreenshot => ({ src: asset(`/projects/${slug}/${name}.webp`), width, height, alt: { en, fr }, device });

const GITHUB = 'https://github.com/ranimedogaz1234-dot';

const projectList: Project[] = [
  {
    slug: 'sephora-business-insight',
    title: 'Sephora Business Insight',
    categories: ['data', 'web'],
    featured: true,
    tagline: {
      en: 'A business intelligence platform for analyzing Sephora’s products and customer reviews.',
      fr: 'Une plateforme de business intelligence pour analyser les produits et les avis clients de Sephora.',
    },
    stack: ['nextjs', 'fastapi', 'python'],
    repoUrl: `${GITHUB}/sephora-business-insight1`,
    demoUrl: null,
    cover: null,
    gallery: [],
    caseStudy: {
      overview: {
        en: 'Sephora Business Insight is a business intelligence platform built to analyze Sephora’s products and their customer reviews, turning catalogue and review data into visual insight.',
        fr: 'Sephora Business Insight est une plateforme de business intelligence conçue pour analyser les produits de Sephora et leurs avis clients, en transformant les données du catalogue et des avis en informations visuelles.',
      },
      features: [
        { en: 'Data visualization of product and review data', fr: 'Visualisation des données produits et avis' },
        { en: 'Product analysis', fr: 'Analyse des produits' },
        { en: 'Customer review analysis', fr: 'Analyse des avis clients' },
      ],
      architecture: {
        en: 'A Next.js interface backed by a FastAPI service written in Python.',
        fr: 'Une interface Next.js reposant sur un service FastAPI écrit en Python.',
      },
    },
    reviewed: false,
    theme: theme({
      identityNote: 'Analytics dashboard: near-black canvas, violet data accents. Align with real screenshots.',
      colors: { bg: '#0d0c12', surface: '#16141f', text: '#f4f1fb', muted: '#a49fb8', accent: '#a78bfa', accentContrast: '#120e1f', line: '#2a2638' },
      font: 'grotesk',
      radius: '14px',
      variant: 'analytics',
    }),
  },
  {
    slug: 'mindmirror',
    title: 'MindMirror',
    // Verified against github.com/ranimedogaz1234-dot/MindMirror (README + docs/screenshots), Nov 2026.
    categories: ['web', 'mobile'],
    tagline: {
      en: 'A trilingual (EN / FR / AR) personality-type assessment with transparent, explainable scoring.',
      fr: 'Une évaluation trilingue (EN / FR / AR) du type de personnalité, au calcul transparent et expliqué.',
    },
    stack: ['react', 'typescript', 'firebase', 'tailwind', 'vite'],
    repoUrl: `${GITHUB}/MindMirror`,
    demoUrl: null,
    cover: shot('mindmirror', 'home', 1440, 900, 'MindMirror public homepage', 'Page d’accueil publique de MindMirror'),
    gallery: [
      shot('mindmirror', 'results', 1440, 900, 'Personality result with each letter explained', 'Résultat de personnalité avec chaque lettre expliquée'),
      shot('mindmirror', 'preferences', 1440, 900, 'Preference percentages and raw points for all four dimensions', 'Pourcentages de préférence et points bruts des quatre dimensions'),
      shot('mindmirror', 'strengths', 1440, 900, 'Strengths, potential blind spots and tendencies', 'Forces, angles morts possibles et tendances'),
      shot('mindmirror', 'test-en', 1440, 900, 'Personality test question in English', 'Question du test de personnalité en anglais'),
      shot('mindmirror', 'test-ar', 1440, 900, 'The same test in Arabic, right-to-left', 'Le même test en arabe, de droite à gauche'),
      shot('mindmirror', 'dashboard', 1440, 900, 'Personalized dashboard', 'Tableau de bord personnalisé'),
      shot('mindmirror', 'analytics', 1440, 900, 'Personal analytics', 'Statistiques personnelles'),
      shot('mindmirror', 'sign-in', 1440, 900, 'Sign-in with email/password or Google', 'Connexion par e-mail/mot de passe ou Google'),
      shot('mindmirror', 'home-mobile', 780, 1688, 'Homepage on a phone', 'Page d’accueil sur téléphone', 'mobile'),
      shot('mindmirror', 'results-mobile', 780, 1688, 'Results on a phone', 'Résultats sur téléphone', 'mobile'),
    ],
    caseStudy: {
      overview: {
        en: 'MindMirror is a short, honest self-reflection tool. Visitors answer 20 original statements on a four-point scale in English, French or Arabic and receive a personality type whose scoring they can actually follow: both percentages of every preference pair, the raw points behind them, and an explanation of each letter. Signed-in users also get ten short trait quizzes, a daily mood check-in and an analytics dashboard of their own results.',
        fr: 'MindMirror est un outil d’introspection court et honnête. Les visiteurs répondent à 20 affirmations originales sur une échelle à quatre niveaux, en anglais, en français ou en arabe, et obtiennent un type de personnalité dont le calcul est lisible : les deux pourcentages de chaque paire de préférences, les points bruts correspondants et l’explication de chaque lettre. Les utilisateurs connectés disposent aussi de dix quiz de traits, d’un suivi quotidien de l’humeur et d’un tableau de statistiques de leurs propres résultats.',
      },
      features: [
        { en: '20 original statements on a four-point scale, in English, French or Arabic (full right-to-left layout)', fr: '20 affirmations originales sur une échelle à quatre niveaux, en anglais, français ou arabe (mise en page entièrement de droite à gauche)' },
        { en: 'Deterministic, language-independent scoring that shows both percentages of every pair and the raw points', fr: 'Calcul déterministe et indépendant de la langue, qui affiche les deux pourcentages de chaque paire et les points bruts' },
        { en: 'A distinct written profile for each of the 16 types, with every letter explained', fr: 'Un profil rédigé distinct pour chacun des 16 types, avec chaque lettre expliquée' },
        { en: 'Google Sign-In and email/password accounts, email verification and password reset', fr: 'Comptes Google ou e-mail/mot de passe, vérification de l’e-mail et réinitialisation du mot de passe' },
        { en: 'Trait quizzes, a daily mood check-in and a personal analytics dashboard', fr: 'Quiz de traits, suivi quotidien de l’humeur et tableau de statistiques personnelles' },
        { en: 'A results page that states its limits and links to type theory and peer-reviewed research', fr: 'Une page de résultats qui précise ses limites et renvoie à la théorie des types et à la recherche évaluée par les pairs' },
      ],
      architecture: {
        en: 'A client-side React 19 single-page application (TypeScript, Vite, Tailwind CSS 4, Motion and Recharts) with no custom backend: the browser talks directly to Firebase Authentication and Cloud Firestore. The personality engine — statements, scoring, letter explanations and the 16 profiles in three languages — is a UI-independent module, and a small hash router keeps the public homepage, sign-in and private pages apart.',
        fr: 'Une application monopage React 19 côté client (TypeScript, Vite, Tailwind CSS 4, Motion et Recharts) sans backend sur mesure : le navigateur communique directement avec Firebase Authentication et Cloud Firestore. Le moteur de personnalité — affirmations, calcul, explication des lettres et les 16 profils en trois langues — est un module indépendant de l’interface, et un petit routeur par hash sépare la page d’accueil publique, la connexion et les pages privées.',
      },
      challenges: [
        { en: 'Most personality websites hand out a four-letter code without showing where it came from.', fr: 'La plupart des sites de personnalité donnent un code en quatre lettres sans montrer d’où il vient.' },
        { en: 'Protecting each user’s results without a custom backend server.', fr: 'Protéger les résultats de chaque utilisateur sans serveur backend sur mesure.' },
      ],
      solutions: [
        { en: 'Every result shows its percentages and raw points, explains each letter, and the app states plainly that its 20-question instrument is custom and not psychometrically validated.', fr: 'Chaque résultat affiche ses pourcentages et ses points bruts, explique chaque lettre, et l’application indique clairement que son questionnaire de 20 questions est original et non validé psychométriquement.' },
        { en: 'Default-deny Firestore security rules with per-user access and field validation, tested against the Firestore emulator.', fr: 'Des règles de sécurité Firestore refusant tout par défaut, avec accès par utilisateur et validation des champs, testées sur l’émulateur Firestore.' },
      ],
    },
    reviewed: true,
    theme: theme({
      identityNote: 'From the real app: soft lavender canvas, indigo-violet accents, serif headlines.',
      colors: { bg: '#fcfbff', surface: '#ffffff', text: '#0e182b', muted: '#5f6478', accent: '#5552e2', accentContrast: '#ffffff', line: '#e9e6fb' },
      font: 'serif',
      radius: '22px',
      variant: 'calm',
    }),
  },
  {
    slug: 'petparadise',
    title: 'PetParadise',
    categories: ['web'],
    tagline: { en: 'E-commerce platform for pet products.', fr: 'Plateforme e-commerce de produits pour animaux.' },
    stack: ['nextjs', 'typescript'],
    repoUrl: null,
    demoUrl: null,
    cover: null,
    gallery: [],
    caseStudy: {
      overview: {
        en: 'PetParadise is an e-commerce website for pet products, where visitors browse the catalogue and build a shopping cart on any screen size.',
        fr: 'PetParadise est un site e-commerce de produits pour animaux, où les visiteurs parcourent le catalogue et remplissent un panier sur tous les écrans.',
      },
      features: [
        { en: 'Product browsing', fr: 'Navigation dans les produits' },
        { en: 'Shopping cart', fr: 'Panier d’achat' },
        { en: 'Responsive layouts', fr: 'Mises en page adaptatives' },
      ],
      architecture: {
        en: 'Built with Next.js and TypeScript.',
        fr: 'Développé avec Next.js et TypeScript.',
      },
    },
    reviewed: false,
    theme: theme({
      identityNote: 'Pet commerce: warm cream, coral and leaf green, rounded shapes. Align with real screenshots.',
      colors: { bg: '#fff8ef', surface: '#ffffff', text: '#2b2118', muted: '#76665a', accent: '#e8603f', accentContrast: '#ffffff', line: '#f1e3d3' },
      font: 'rounded',
      radius: '26px',
      variant: 'playful',
    }),
  },
  {
    // Shown as "CarRent2" in Ranim's reference designs; the previous build called it "Sayara".
    slug: 'carrent2',
    title: 'CarRent2',
    alias: 'Sayara',
    // Verified against github.com/ranimedogaz1234-dot/Sayara (README + docs/screenshots), Nov 2026.
    categories: ['web', 'mobile'],
    tagline: {
      en: 'A luxury car rental platform with fleet search, date-based booking and an admin dashboard.',
      fr: 'Une plateforme de location de voitures de luxe : recherche dans la flotte, réservation par dates et tableau de bord d’administration.',
    },
    stack: ['symfony', 'php', 'bootstrap', 'github-actions'],
    repoUrl: `${GITHUB}/Sayara`,
    demoUrl: null,
    cover: shot('carrent2', 'home', 1440, 900, 'Sayara homepage with the vehicle search bar', 'Page d’accueil de Sayara avec la barre de recherche de véhicules'),
    gallery: [
      shot('carrent2', 'catalogue', 1440, 985, 'Vehicle catalogue with search, make, sort and price filters', 'Catalogue des véhicules avec recherche, marque, tri et filtre de prix'),
      shot('carrent2', 'vehicle', 1440, 965, 'Vehicle details with daily rate and date picker', 'Fiche véhicule avec tarif journalier et sélection des dates'),
      shot('carrent2', 'booking', 1440, 900, 'Booking form with rental dates and estimated total', 'Formulaire de réservation avec dates et total estimé'),
      shot('carrent2', 'checkout', 1440, 1350, 'Demonstration checkout with booking summary (no real payment)', 'Paiement de démonstration avec récapitulatif (aucun paiement réel)'),
      shot('carrent2', 'sign-in', 1440, 900, 'Sign-in page', 'Page de connexion'),
      shot('carrent2', 'register', 1440, 900, 'Registration page', 'Page d’inscription'),
      shot('carrent2', 'home-mobile', 577, 1266, 'Homepage on a phone', 'Page d’accueil sur téléphone', 'mobile'),
    ],
    caseStudy: {
      overview: {
        en: 'Sayara (CarRent2) is a full-stack car rental web application built with Symfony 7.4 and PHP 8.4. Customers browse a curated fleet of luxury, exotic and prestige vehicles, compare daily rates, reserve a car for specific dates and complete a demonstration checkout. Administrators manage the fleet, customers and bookings from a dedicated dashboard. The checkout is a simulation: no payment provider is connected and card details are never stored or transmitted.',
        fr: 'Sayara (CarRent2) est une application web complète de location de voitures développée avec Symfony 7.4 et PHP 8.4. Les clients parcourent une flotte de véhicules de luxe, d’exception et de prestige, comparent les tarifs journaliers, réservent une voiture pour des dates précises et passent par un paiement de démonstration. Les administrateurs gèrent la flotte, les clients et les réservations depuis un tableau de bord dédié. Le paiement est une simulation : aucun prestataire de paiement n’est connecté et aucune donnée de carte n’est stockée ni transmise.',
      },
      features: [
        { en: 'Homepage search by make, model, maximum daily price and pick-up date', fr: 'Recherche depuis l’accueil par marque, modèle, prix journalier maximal et date de prise en charge' },
        { en: 'Vehicle catalogue with free-text search, make filter, price limit and sorting', fr: 'Catalogue avec recherche libre, filtre par marque, prix maximal et tri' },
        { en: 'Vehicle details with a date picker showing the number of days and an estimated total', fr: 'Fiche véhicule avec sélection des dates, nombre de jours et total estimé' },
        { en: 'Accounts: registration, sign-in with optional “keep me signed in”, profile and booking history', fr: 'Comptes : inscription, connexion avec option « rester connecté », profil et historique des réservations' },
        { en: 'Create, edit and cancel your own reservations, with totals calculated from the rental dates', fr: 'Création, modification et annulation de ses réservations, avec un total calculé à partir des dates' },
        { en: 'Admin dashboard with Chart.js statistics, plus fleet, customer and reservation management', fr: 'Tableau de bord d’administration avec statistiques Chart.js et gestion de la flotte, des clients et des réservations' },
      ],
      architecture: {
        en: 'A conventional Symfony architecture: Doctrine ORM 3 entities and migrations (SQLite by default, MySQL supported), form-based validation, Twig templates with AssetMapper and Bootstrap 4, and role-based access control. A PHPUnit 12 suite runs against an isolated SQLite test database, and GitHub Actions validates Composer files, lints YAML, Twig and the service container, runs the tests and audits dependencies on every pull request.',
        fr: 'Une architecture Symfony classique : entités et migrations Doctrine ORM 3 (SQLite par défaut, MySQL pris en charge), validation par formulaires, templates Twig avec AssetMapper et Bootstrap 4, et contrôle d’accès par rôles. Une suite PHPUnit 12 s’exécute sur une base SQLite de test isolée, et GitHub Actions valide les fichiers Composer, vérifie YAML, Twig et le conteneur de services, lance les tests et audite les dépendances à chaque pull request.',
      },
      challenges: [
        { en: 'A customer must never be able to view, edit or pay for someone else’s booking.', fr: 'Un client ne doit jamais pouvoir consulter, modifier ou payer la réservation d’un autre.' },
        { en: 'Showing a realistic payment step without handling real card data.', fr: 'Montrer une étape de paiement réaliste sans manipuler de vraies données de carte.' },
      ],
      solutions: [
        { en: 'Ownership checks on every reservation action (IDOR prevention) covered by tests, with role-based access control keeping the dashboard and management pages admin-only.', fr: 'Des contrôles de propriété sur chaque action de réservation (prévention IDOR) couverts par des tests, et un contrôle d’accès par rôles qui réserve le tableau de bord et la gestion aux administrateurs.' },
        { en: 'An explicit demonstration checkout that never stores or forwards card details, with CSRF protection on every state-changing form and login throttling after five failed attempts.', fr: 'Un paiement de démonstration explicite qui ne stocke ni ne transmet aucune donnée de carte, avec une protection CSRF sur chaque formulaire et un blocage temporaire après cinq échecs de connexion.' },
      ],
    },
    reviewed: true,
    theme: theme({
      identityNote: 'From the real app: graphite black, champagne gold, editorial serif.',
      colors: { bg: '#0b0b0c', surface: '#141416', text: '#f3efe6', muted: '#a39d90', accent: '#c8a45d', accentContrast: '#0b0b0c', line: '#2a2824' },
      font: 'serif',
      radius: '4px',
      variant: 'luxury',
    }),
  },
  {
    slug: 'travel-tr',
    title: 'Travel-TR',
    // Verified against github.com/ranimedogaz1234-dot/Travel-Tr (README, its attached screenshots and docs/screenshots), Nov 2026.
    categories: ['web', 'mobile'],
    tagline: {
      en: 'A full-stack travel booking app with filterable destinations, secure accounts and reservation management.',
      fr: 'Une application complète de réservation de voyages : destinations filtrables, comptes sécurisés et gestion des réservations.',
    },
    stack: ['angular', 'typescript', 'nodejs', 'express'],
    repoUrl: `${GITHUB}/Travel-Tr`,
    demoUrl: null,
    cover: shot('travel-tr', 'home', 950, 1235, 'Travel TR homepage with destination, travel-type and budget search', 'Page d’accueil de Travel TR avec recherche par destination, type de voyage et budget'),
    gallery: [
      shot('travel-tr', 'home-sections', 950, 1235, 'Homepage: travel categories, budget offers and benefits', 'Accueil : catégories de voyage, offres petit budget et avantages'),
      shot('travel-tr', 'destinations', 1280, 1397, 'Destination catalogue with filters and sorting', 'Catalogue des destinations avec filtres et tri'),
      shot('travel-tr', 'destinations-grid', 1280, 1397, 'Destination cards with prices and ratings', 'Cartes de destinations avec prix et notes'),
      shot('travel-tr', 'destination-detail', 1013, 1317, 'Destination page with gallery, activities and departures', 'Page destination avec galerie, activités et départs'),
      shot('travel-tr', 'booking', 1440, 1808, 'Three-step booking with summary and total price', 'Réservation en trois étapes avec récapitulatif et prix total'),
      shot('travel-tr', 'my-bookings', 1440, 1185, 'My bookings: status, edit and cancel', 'Mes réservations : statut, modification et annulation'),
      shot('travel-tr', 'sign-in', 1144, 1279, 'Sign-in page', 'Page de connexion'),
      shot('travel-tr', 'home-mobile', 390, 844, 'Homepage on a phone', 'Page d’accueil sur téléphone', 'mobile'),
    ],
    caseStudy: {
      overview: {
        en: 'Travel TR is a full-stack travel booking web application with a destination catalogue, search and filters, detailed destination pages, user accounts and reservation management. The interface is in French, with a responsive blue, white and light-blue design for desktop, tablet and mobile. It is a portfolio demo: destinations, prices and dates are fictional and no payment is processed — bookings stay “pending” and “unpaid”.',
        fr: 'Travel TR est une application web complète de réservation de voyages : catalogue de destinations, recherche et filtres, pages détaillées, comptes utilisateurs et gestion des réservations. L’interface est en français, avec un design adaptatif bleu, blanc et bleu clair pour ordinateur, tablette et mobile. C’est une démo de portfolio : destinations, prix et dates sont fictifs et aucun paiement n’est traité — les réservations restent « en attente » et « non payées ».',
      },
      features: [
        { en: 'Homepage search by destination, travel type and budget, with featured destinations and budget offers', fr: 'Recherche depuis l’accueil par destination, type de voyage et budget, avec destinations à la une et offres petit budget' },
        { en: 'Catalogue filterable by country, budget and travel type, with text search, sorting and filters kept in the URL', fr: 'Catalogue filtrable par pays, budget et type de voyage, avec recherche, tri et filtres conservés dans l’URL' },
        { en: 'Destination pages with photo gallery, highlights, activities, departure dates, remaining seats and prices', fr: 'Pages destination avec galerie photo, points forts, activités, dates de départ, places restantes et prix' },
        { en: 'Three-step booking (destination → departure → travellers) with a summary and total price', fr: 'Réservation en trois étapes (destination → départ → voyageurs) avec récapitulatif et prix total' },
        { en: '“My bookings”: filter, edit traveller details and notes, and cancel according to the booking rules', fr: '« Mes réservations » : filtrer, modifier les voyageurs et les remarques, et annuler selon les règles de réservation' },
        { en: 'Accounts with client- and server-side validation, profile and password updates, and a working contact form', fr: 'Comptes avec validation côté client et serveur, mise à jour du profil et du mot de passe, et formulaire de contact fonctionnel' },
      ],
      architecture: {
        en: 'An Angular 22 frontend (standalone components, signals, reactive forms, lazy-loaded routes, route guards and an HTTP interceptor) talks to an Express 5 REST API on Node.js. Data lives in SQLite through the built-in node:sqlite module with prepared statements, and inputs are validated with Zod. In production the API also serves the compiled Angular app from the same origin, which keeps cookie and CSRF handling simple.',
        fr: 'Un frontend Angular 22 (composants standalone, signals, formulaires réactifs, routes chargées à la demande, guards et intercepteur HTTP) communique avec une API REST Express 5 sous Node.js. Les données sont stockées dans SQLite via le module intégré node:sqlite avec des requêtes préparées, et les entrées sont validées avec Zod. En production, l’API sert aussi l’application Angular compilée depuis la même origine, ce qui simplifie la gestion des cookies et du CSRF.',
      },
      challenges: [
        { en: 'Keeping accounts and bookings secure in a session-based app.', fr: 'Sécuriser les comptes et les réservations dans une application à sessions.' },
        { en: 'Booking rules have to hold even if someone bypasses the interface.', fr: 'Les règles de réservation doivent tenir même si l’interface est contournée.' },
      ],
      solutions: [
        { en: 'Argon2id password hashing, HttpOnly SameSite session cookies whose tokens are stored only as hashes, CSRF tokens integrated with Angular, login rate limiting, owner-only access to reservations and helmet security headers.', fr: 'Hachage des mots de passe avec Argon2id, cookies de session HttpOnly SameSite dont les jetons ne sont stockés que hachés, jetons CSRF intégrés à Angular, limitation des tentatives de connexion, accès aux réservations réservé à leur propriétaire et en-têtes de sécurité helmet.' },
        { en: 'The API enforces them: bookings close 3 days before departure, one active booking per departure, changes until 7 days before and online cancellation until 48 hours before, with cancelled seats released.', fr: 'L’API les applique : réservation jusqu’à 3 jours avant le départ, une seule réservation active par départ, modification jusqu’à 7 jours avant et annulation en ligne jusqu’à 48 heures avant, avec remise en vente des places annulées.' },
      ],
    },
    reviewed: true,
    theme: theme({
      identityNote: 'From the real app: deep travel blue, white and light blue, clean sans-serif.',
      colors: { bg: '#f4f7fd', surface: '#ffffff', text: '#0c1f3f', muted: '#52637f', accent: '#1f419c', accentContrast: '#ffffff', line: '#dbe5f6' },
      font: 'sans',
      radius: '14px',
      variant: 'travel',
    }),
  },
  {
    slug: 'tech-store',
    title: 'Tech Store',
    // Verified against github.com/ranimedogaz1234-dot/tech-store (the latest version; older local copies exist).
    // Screens captured from that latest version served locally (storefront only, using the app's built-in catalogue).
    categories: ['web'],
    tagline: {
      en: 'A PHP and MySQL storefront with a cart, Cash on Delivery checkout and order management.',
      fr: 'Une boutique en ligne PHP et MySQL avec panier, paiement à la livraison et gestion des commandes.',
    },
    stack: ['php', 'mysql', 'javascript', 'html5', 'css3'],
    repoUrl: `${GITHUB}/tech-store`,
    demoUrl: null,
    cover: shot('tech-store', 'storefront', 1240, 640, 'Tech Store homepage', 'Page d’accueil de Tech Store'),
    gallery: [
      shot('tech-store', 'best-sellers', 1440, 900, 'Best-selling products with prices and add-to-basket buttons', 'Meilleures ventes avec prix et boutons d’ajout au panier'),
      shot('tech-store', 'category', 1440, 900, 'Laptop category with search, price filter and sorting', 'Catégorie ordinateurs portables avec recherche, filtre de prix et tri'),
      shot('tech-store', 'product', 1440, 900, 'Product page with colour choice and image gallery', 'Fiche produit avec choix de couleur et galerie d’images'),
      shot('tech-store', 'product-colours', 1440, 900, 'Product page with three colour variants', 'Fiche produit avec trois variantes de couleur'),
    ],
    caseStudy: {
      overview: {
        en: 'Tech Store is a PHP and MySQL storefront for computers and accessories, with a French interface. Shoppers browse the catalogue by category, choose a product colour, fill a cart and place a Cash on Delivery order; an administrator workspace manages catalogue products, users and order status. No bank or card details are requested and no online charge is made.',
        fr: 'Tech Store est une boutique en ligne PHP et MySQL d’ordinateurs et d’accessoires, à l’interface en français. Les clients parcourent le catalogue par catégorie, choisissent une couleur, remplissent un panier et passent une commande payable à la livraison ; un espace administrateur gère les produits, les utilisateurs et le statut des commandes. Aucune donnée bancaire n’est demandée et aucun paiement en ligne n’est effectué.',
      },
      features: [
        { en: 'Product catalogue by category, product pages with colour variants and a browser shopping cart', fr: 'Catalogue par catégorie, fiches produit avec variantes de couleur et panier dans le navigateur' },
        { en: 'Customer registration, sign-in and order history', fr: 'Inscription, connexion et historique des commandes' },
        { en: 'Cash on Delivery checkout with server-calculated totals, shipping, coupon and stock checks', fr: 'Paiement à la livraison avec totaux, livraison, coupon et stock vérifiés côté serveur' },
        { en: 'Order confirmation with retry protection and customer-scoped receipts', fr: 'Confirmation de commande protégée contre les doubles envois, avec reçus limités au client' },
        { en: 'Administrator tools for products, users and order status', fr: 'Outils d’administration pour les produits, les utilisateurs et le statut des commandes' },
      ],
      architecture: {
        en: 'Plain PHP with PDO on MySQL behind HTML, CSS and JavaScript pages. Checkout runs in a database transaction that takes prices and stock from the database rather than the browser. CSRF tokens protect form and API changes, the session ID is regenerated on login, protected requests re-check account status and role, and login attempts are throttled.',
        fr: 'Du PHP natif avec PDO sur MySQL derrière des pages HTML, CSS et JavaScript. Le paiement s’exécute dans une transaction qui reprend les prix et le stock depuis la base plutôt que depuis le navigateur. Des jetons CSRF protègent les formulaires et l’API, l’identifiant de session est régénéré à la connexion, les requêtes protégées revérifient le statut et le rôle du compte, et les tentatives de connexion sont limitées.',
      },
      challenges: [
        { en: 'A retried or double-submitted checkout must not create a second order or reserve stock twice.', fr: 'Un paiement relancé ou envoyé deux fois ne doit ni créer une seconde commande ni réserver le stock deux fois.' },
      ],
      solutions: [
        { en: 'Each checkout attempt carries a session-bound checkout token; reusing it returns the saved order through the unique order number instead of reserving stock again, and the cart is cleared only after a successful save.', fr: 'Chaque tentative de paiement porte un jeton lié à la session ; sa réutilisation renvoie la commande déjà enregistrée grâce au numéro de commande unique au lieu de réserver à nouveau le stock, et le panier n’est vidé qu’après un enregistrement réussi.' },
      ],
    },
    reviewed: true,
    theme: theme({
      identityNote: 'From the real app: white storefront, deep burgundy accents.',
      colors: { bg: '#ffffff', surface: '#faf7f7', text: '#211416', muted: '#6b5d60', accent: '#5c1f27', accentContrast: '#ffffff', line: '#eadfe0' },
      font: 'sans',
      radius: '8px',
      variant: 'retail',
    }),
  },
  {
    slug: 'medicare-hospital-management',
    title: 'Medicare Hospital Management',
    alias: 'MediCare HMS',
    // Verified against github.com/ranimedogaz1234-dot/medicare-hospital-manager (the latest version; an older local copy exists).
    // Screens rendered from that latest version (real FXML + CSS) against a throwaway database of synthetic records.
    categories: ['desktop'],
    tagline: {
      en: 'A JavaFX desktop app where doctors manage patients, appointments and medical records.',
      fr: 'Une application de bureau JavaFX où les médecins gèrent patients, rendez-vous et dossiers médicaux.',
    },
    stack: ['java', 'javafx', 'mysql'],
    repoUrl: `${GITHUB}/medicare-hospital-manager`,
    demoUrl: null,
    cover: shot('medicare-hospital-management', 'dashboard', 1600, 1000, 'Doctor dashboard with counters and charts (synthetic data)', 'Tableau de bord du médecin avec compteurs et graphiques (données fictives)', 'app'),
    gallery: [
      shot('medicare-hospital-management', 'appointments', 1600, 1000, 'Appointments list with status (synthetic data)', 'Liste des rendez-vous avec statut (données fictives)', 'app'),
      shot('medicare-hospital-management', 'records', 1600, 1000, 'Medical records per patient (synthetic data)', 'Dossiers médicaux par patient (données fictives)', 'app'),
      shot('medicare-hospital-management', 'patients', 1600, 1000, 'The doctor’s patients (synthetic data)', 'Les patients du médecin (données fictives)', 'app'),
      shot('medicare-hospital-management', 'assistant', 1600, 1000, 'MediBot, the local rule-based assistant', 'MediBot, l’assistant local à base de règles', 'app'),
      shot('medicare-hospital-management', 'login', 1350, 900, 'Sign-in window', 'Fenêtre de connexion', 'app'),
      shot('medicare-hospital-management', 'register', 1350, 960, 'Doctor account creation', 'Création d’un compte médecin', 'app'),
      shot('medicare-hospital-management', 'dashboard-repo', 970, 1261, 'Full dashboard, from the repository’s documentation (synthetic data)', 'Tableau de bord complet, tiré de la documentation du dépôt (données fictives)', 'app'),
    ],
    caseStudy: {
      overview: {
        en: 'MediCare Hospital Manager is a JavaFX desktop application, with a French interface, that demonstrates how doctors can manage patients, appointments and medical records in a MySQL-backed workspace. It is an academic demonstration that uses synthetic data only — not a production-ready medical system.',
        fr: 'MediCare Hospital Manager est une application de bureau JavaFX, à l’interface en français, qui montre comment des médecins peuvent gérer patients, rendez-vous et dossiers médicaux dans un espace de travail reposant sur MySQL. C’est une démonstration académique qui n’utilise que des données fictives — pas un système médical prêt pour la production.',
      },
      features: [
        { en: 'Doctor self-registration and immediate sign-in (patients have no login accounts)', fr: 'Inscription autonome des médecins et connexion immédiate (les patients n’ont pas de compte)' },
        { en: 'Patient creation and access scoped to the doctor’s assignments', fr: 'Création de patients et accès limité aux patients assignés au médecin' },
        { en: 'Medical records with diagnoses, history, treatments, notes and a declared category', fr: 'Dossiers médicaux avec diagnostics, antécédents, traitements, notes et catégorie déclarée' },
        { en: 'Appointment scheduling, rescheduling and cancellation history, with conflict checks', fr: 'Planification, reprogrammation et historique des annulations de rendez-vous, avec détection des conflits' },
        { en: 'Dashboard with appointment and record counters, status and category charts, and upcoming appointments', fr: 'Tableau de bord avec compteurs de rendez-vous et de dossiers, graphiques par statut et par catégorie, et prochains rendez-vous' },
        { en: 'A local, rule-based assistant (MediBot) and a separate administrator workspace', fr: 'Un assistant local à base de règles (MediBot) et un espace administrateur séparé' },
      ],
      architecture: {
        en: 'Java with JavaFX and FXML views, built with Maven, with a DAO layer that talks to MySQL through JDBC. Passwords are hashed with salted PBKDF2-HMAC-SHA256. No external AI service or API key is needed: the assistant runs locally on rules.',
        fr: 'Java avec JavaFX et des vues FXML, construit avec Maven, avec une couche DAO qui accède à MySQL via JDBC. Les mots de passe sont hachés avec PBKDF2-HMAC-SHA256 salé. Aucun service d’IA externe ni clé d’API n’est nécessaire : l’assistant fonctionne localement à partir de règles.',
      },
      challenges: [
        { en: 'Two appointments must never overlap for the same doctor, even when both are saved at the same moment.', fr: 'Deux rendez-vous ne doivent jamais se chevaucher pour un même médecin, même s’ils sont enregistrés au même instant.' },
      ],
      solutions: [
        { en: 'Fixed 30-minute slots with conflict checks (including across midnight); every write locks the doctor’s row in a transaction before checking the slot, and a concurrent-overlap test confirms that only one booking succeeds.', fr: 'Des créneaux fixes de 30 minutes avec contrôle des conflits (y compris autour de minuit) ; chaque écriture verrouille la ligne du médecin dans une transaction avant de vérifier le créneau, et un test de chevauchement concurrent confirme qu’une seule réservation aboutit.' },
      ],
    },
    reviewed: true,
    theme: theme({
      identityNote: 'From the real app: navy sidebar, calm grey canvas, green action buttons.',
      colors: { bg: '#f5f6fa', surface: '#ffffff', text: '#1b2a3a', muted: '#5d6b7a', accent: '#1a5276', accentContrast: '#ffffff', line: '#dfe5ec' },
      font: 'sans',
      radius: '10px',
      variant: 'clinical',
    }),
  },
  {
    slug: 'finguard-ai',
    title: 'FinGuard AI',
    // Verified against the public repository github.com/ranimedogaz1234-dot/finguard-ai (README, docs/SECURITY.md,
    // CI workflow, package.json) and its docs/screenshots, 19 Nov 2026. Detection is rule-based; the assistant uses an external model only when
    // one is configured on the server, otherwise a labelled local demonstration mode.
    categories: ['security', 'web', 'data', 'ai'],
    featured: true,
    tagline: {
      en: 'Full-stack financial-security platform: explainable invoice checks, supplier risk scoring and fraud alerts.',
      fr: 'Plateforme full-stack de sécurité financière : contrôle explicable des factures, risque fournisseur et alertes de fraude.',
    },
    stack: ['csharp', 'aspnetcore', 'react', 'typescript', 'efcore', 'sqlite', 'rest', 'xunit', 'vitest', 'playwright', 'github-actions'],
    repoUrl: `${GITHUB}/finguard-ai`,
    demoUrl: null,
    cover: shot('finguard-ai', 'overview', 1440, 900, 'Financial overview: KPIs, 12-month invoice trend and supplier risk distribution (fictional data)', 'Vue financière : indicateurs, tendance des factures sur 12 mois et répartition du risque fournisseur (données fictives)'),
    gallery: [
      shot('finguard-ai', 'supplier', 1440, 900, 'Supplier risk assessment: every point of the 0–100 score attributed to a documented factor', 'Évaluation du risque fournisseur : chaque point du score de 0 à 100 attribué à un facteur documenté'),
      shot('finguard-ai', 'invoice', 1440, 900, 'Invoice verification: a resubmitted invoice rejected as a duplicate, with explained findings', 'Vérification de facture : une facture resoumise rejetée comme doublon, avec des constats expliqués'),
      shot('finguard-ai', 'alert', 1440, 900, 'Fraud alert investigation: masked IBAN evidence, assignment and timeline — suspicious, not confirmed', 'Investigation d’une alerte de fraude : IBAN masqués en preuve, attribution et chronologie — suspect, non confirmé'),
      shot('finguard-ai', 'assistant', 1440, 900, 'Financial assistant in its labelled local demonstration mode, explaining a supplier’s risk from platform data', 'Assistant financier en mode de démonstration local signalé, expliquant le risque d’un fournisseur à partir des données de la plateforme'),
      shot('finguard-ai', 'overview-light', 1440, 900, 'Financial overview in the light theme', 'Vue financière en thème clair'),
      shot('finguard-ai', 'overview-mobile', 780, 1587, 'Financial overview on a phone', 'Vue financière sur téléphone', 'mobile'),
    ],
    caseStudy: {
      overview: {
        en: 'FinGuard AI is a full-stack financial-security and risk platform for accounts payable. It verifies supplier invoices with explainable rules, scores supplier risk, raises fraud alerts that analysts investigate, and presents financial analytics — with role-based access control and an audit trail, so people stay in charge of every decision. It is a portfolio project: all data is fictional and no money ever moves (“Mark paid” records a simulated payment).',
        fr: 'FinGuard AI est une plateforme full-stack de sécurité financière et de gestion des risques pour la comptabilité fournisseurs. Elle vérifie les factures avec des règles explicables, évalue le risque des fournisseurs, déclenche des alertes de fraude que les analystes instruisent et présente des analyses financières — avec un contrôle d’accès par rôles et un journal d’audit, pour que chaque décision reste humaine. C’est un projet de portfolio : toutes les données sont fictives et aucun argent ne circule (« Marquer payé » enregistre un paiement simulé).',
      },
      features: [
        { en: 'Financial overview computed server-side: KPIs, 12-month invoice trend, risk distribution, alert severity, spend by category and investigation priorities — every KPI links to the list behind it', fr: 'Vue financière calculée côté serveur : indicateurs, tendance des factures sur 12 mois, répartition du risque, gravité des alertes, dépenses par catégorie et priorités d’investigation — chaque indicateur mène à la liste correspondante' },
        { en: 'Supplier risk intelligence: an explainable 0–100 score from 7 capped factors with confidence and a recommendation, plus risk history, a bank-detail change log and side-by-side comparison', fr: 'Risque fournisseur : un score explicable de 0 à 100 issu de 7 facteurs plafonnés, avec niveau de confiance et recommandation, historique du risque, journal des changements bancaires et comparaison côte à côte' },
        { en: 'Invoice verification with 12 rules — duplicates (with normalised invoice numbers), arithmetic, purchase-order match, supplier and currency mismatch, price and quantity increases — plus validated PDF upload with field extraction and a downloadable report', fr: 'Vérification des factures par 12 règles — doublons (numéros normalisés), arithmétique, correspondance au bon de commande, fournisseur et devise, hausses de prix et de quantité — avec import PDF validé, extraction des champs et rapport téléchargeable' },
        { en: '9 rule-based fraud checks — payment-detail mismatch, invalid IBAN, recent bank change, amount outliers, split invoicing, just-below-threshold amounts — with severity, assignment, notes and an investigation timeline', fr: '9 contrôles de fraude à base de règles — coordonnées bancaires divergentes, IBAN invalide, changement bancaire récent, montants atypiques, fractionnement, montants juste sous le seuil — avec gravité, attribution, notes et chronologie d’investigation' },
        { en: 'Approval and payment controls: segregation of duties, admin approval above a threshold, payments only to the supplier’s verified account and blocked while serious alerts are open', fr: 'Contrôles d’approbation et de paiement : séparation des tâches, approbation administrateur au-delà d’un seuil, paiements uniquement vers le compte vérifié du fournisseur et bloqués tant que des alertes graves sont ouvertes' },
        { en: 'Financial assistant grounded in platform data: it calls Anthropic or an OpenAI-compatible model from the backend only when configured, labels live answers as AI-generated, and otherwise runs in a clearly labelled local demonstration mode', fr: 'Assistant financier fondé sur les données de la plateforme : il n’appelle Anthropic ou un modèle compatible OpenAI depuis le backend que s’il est configuré, signale les réponses générées par IA, et fonctionne sinon dans un mode de démonstration local clairement signalé' },
        { en: 'Security: Admin and Analyst roles with deny-by-default and object-level checks, HttpOnly SameSite=Strict sessions with an absolute lifetime, CSRF tokens, PBKDF2, lockout and rate limiting, strict CSP, masked IBANs and an audit log', fr: 'Sécurité : rôles Administrateur et Analyste avec refus par défaut et contrôles par objet, sessions HttpOnly SameSite=Strict à durée absolue, jetons CSRF, PBKDF2, verrouillage et limitation de débit, CSP stricte, IBAN masqués et journal d’audit' },
      ],
      architecture: {
        en: 'A React 19 + TypeScript single-page app (Vite, React Router, TanStack Query, Recharts) talks to an ASP.NET Core 10 REST API in C#. Controllers stay thin; services enforce permissions on the server and write the audit log; Entity Framework Core 10 stores data in SQLite with migrations, keeping money as integer cents. All detection and scoring rules live in a framework-free domain library, so they are unit-tested in isolation. Security includes cookie sessions with antiforgery tokens, SameSite=Strict, PBKDF2 hashing, strict security headers, request-size limits and signature-checked PDF uploads parsed within a time budget. Tests cover the domain (xUnit), the real API through WebApplicationFactory, React components (Vitest) and end-to-end journeys on desktop and mobile (Playwright), with a dependency audit — all run by GitHub Actions.',
        fr: 'Une application monopage React 19 + TypeScript (Vite, React Router, TanStack Query, Recharts) communique avec une API REST ASP.NET Core 10 en C#. Les contrôleurs restent minces ; les services appliquent les permissions côté serveur et alimentent le journal d’audit ; Entity Framework Core 10 stocke les données dans SQLite avec migrations, les montants étant conservés en centimes entiers. Toutes les règles de détection et de notation vivent dans une bibliothèque de domaine sans framework, testée isolément. La sécurité comprend des sessions par cookie avec jetons anti-falsification, SameSite=Strict, le hachage PBKDF2, des en-têtes de sécurité stricts, des limites de taille de requête et des PDF importés vérifiés par signature et analysés dans un temps limité. Les tests couvrent le domaine (xUnit), l’API réelle via WebApplicationFactory, les composants React (Vitest) et des parcours de bout en bout sur ordinateur et mobile (Playwright), plus un audit des dépendances — le tout exécuté par GitHub Actions.',
      },
      challenges: [
        { en: 'A finance team cannot act on a flag it does not understand.', fr: 'Une équipe financière ne peut pas agir sur une alerte qu’elle ne comprend pas.' },
        { en: 'Fraud controls are weak if the same person can create and approve a payment.', fr: 'Les contrôles anti-fraude sont fragiles si la même personne peut créer et approuver un paiement.' },
        { en: 'Adding an AI assistant without exposing API keys or letting it invent figures.', fr: 'Ajouter un assistant IA sans exposer de clés d’API ni le laisser inventer des chiffres.' },
      ],
      solutions: [
        { en: 'Every rule returns a code, a severity, a plain-language explanation and its evidence, and each risk score is the visible sum of documented factors.', fr: 'Chaque règle renvoie un code, une gravité, une explication claire et ses preuves, et chaque score de risque est la somme visible de facteurs documentés.' },
        { en: 'Segregation of duties and admin-only fraud confirmation are enforced by the API, not just hidden in the UI, and sensitive actions are written to an audit log.', fr: 'La séparation des tâches et la confirmation de fraude réservée aux administrateurs sont appliquées par l’API, pas seulement masquées dans l’interface, et les actions sensibles sont inscrites au journal d’audit.' },
        { en: 'The assistant is grounded in live platform data and calls a model only from the backend; without a key it answers in a labelled local mode built from the same rules.', fr: 'L’assistant s’appuie sur les données réelles de la plateforme et n’appelle un modèle que depuis le backend ; sans clé, il répond dans un mode local signalé, construit à partir des mêmes règles.' },
      ],
      status: {
        en: 'Working portfolio application with fictional demo data. Documented limitations: detection is rule-based (no machine-learning model), PDF extraction needs text-based PDFs, payments are simulated, there is no MFA or email delivery yet, rate limiting is in-memory (single instance) and dashboards use one base currency. Roadmap: MFA, email delivery, OCR, configurable rule thresholds and an anomaly-detection model alongside the rules.',
        fr: 'Application de portfolio fonctionnelle avec des données de démonstration fictives. Limites documentées : détection à base de règles (pas de modèle d’apprentissage automatique), extraction réservée aux PDF textuels, paiements simulés, pas encore de MFA ni d’envoi d’e-mails, limitation de débit en mémoire (instance unique) et tableaux de bord en une seule devise. Feuille de route : MFA, envoi d’e-mails, OCR, seuils de règles configurables et un modèle de détection d’anomalies en complément des règles.',
      },
    },
    reviewed: true,
    theme: theme({
      identityNote: 'From the real app: deep navy canvas, glass panels, electric-blue actions.',
      colors: { bg: '#070b18', surface: '#0e1428', text: '#e8ecf8', muted: '#8a93b0', accent: '#3b82f6', accentContrast: '#ffffff', line: '#1c2440' },
      font: 'grotesk',
      radius: '12px',
      variant: 'fintech',
    }),
  },
];

/** Carousel order — the featured project sits in the middle with its neighbours as in the reference. */
const ORDER = [
  'mindmirror',
  'petparadise',
  'sephora-business-insight',
  'travel-tr',
  'carrent2',
  'tech-store',
  'medicare-hospital-management',
  'finguard-ai',
];

export const projects: Project[] = [...projectList].sort(
  (a, b) => (ORDER.indexOf(a.slug) + 1 || 99) - (ORDER.indexOf(b.slug) + 1 || 99),
);

export const projectCategories = ['web', 'mobile', 'desktop', 'data', 'security', 'ai'] as const;

/** Old URLs that must keep working. */
export const projectSlugAliases: Record<string, string> = { sayara: 'carrent2' };

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
