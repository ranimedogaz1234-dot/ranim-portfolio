import type { Skill, SkillCategory, L10n } from './types';

export const skillCategories: SkillCategory[] = [
  'languages',
  'frontend',
  'backend',
  'databases',
  'auth',
  'tools',
  'design',
  'security',
  'other',
];

/** Accent per category, used for the tile's corner marker. */
export const categoryHue: Record<SkillCategory, string> = {
  languages: '#b38cff',
  frontend: '#7fc8ff',
  backend: '#9b8cff',
  databases: '#6ee7d0',
  auth: '#ffb86b',
  tools: '#c9b8ff',
  design: '#ff9ad5',
  security: '#ff7a9a',
  other: '#e2d4ff',
};

const SOURCE = 'Skills list supplied by Ranim in the portfolio brief and her CV (Nov 2026).';

function s(
  id: string,
  name: string,
  symbol: string,
  category: SkillCategory,
  icon: string | undefined,
  description: L10n,
  mono = false,
): Skill {
  return { id, name, symbol, category, icon, description, mono, verified: true, source: SOURCE };
}

/** Present in the previous build but not in Ranim's skills list: kept for review, hidden in production. */
function unlisted(...args: Parameters<typeof s>): Skill {
  return { ...s(...args), verified: false, source: 'Added by the previous build; not in Ranim’s skills list — confirm or delete.' };
}

/**
 * Technologies Ranim has studied, used or worked with. Descriptions describe the
 * technology itself — no proficiency levels, durations or certifications.
 * Set `verified: false` on any item that should stay unpublished until confirmed.
 */
export const skills: Skill[] = [
  // Programming languages
  s('java', 'Java', 'Ja', 'languages', 'java/java-original', { en: 'Object-oriented language for backend and desktop applications.', fr: 'Langage orienté objet pour le backend et les applications de bureau.' }),
  s('python', 'Python', 'Py', 'languages', 'python/python-original', { en: 'Versatile language for APIs, data analysis and machine learning.', fr: 'Langage polyvalent pour les API, l’analyse de données et le machine learning.' }),
  s('javascript', 'JavaScript', 'Js', 'languages', 'javascript/javascript-original', { en: 'The language of the web, in the browser and on the server.', fr: 'Le langage du web, côté navigateur comme côté serveur.' }),
  s('typescript', 'TypeScript', 'Ts', 'languages', 'typescript/typescript-original', { en: 'JavaScript with static types for safer, maintainable code.', fr: 'JavaScript typé statiquement pour un code plus sûr et maintenable.' }),
  s('php', 'PHP', 'Php', 'languages', 'php/php-original', { en: 'Server-side language behind Symfony and WordPress.', fr: 'Langage serveur utilisé par Symfony et WordPress.' }),
  s('c', 'C', 'C', 'languages', 'c/c-original', { en: 'Low-level language for systems programming fundamentals.', fr: 'Langage bas niveau pour les fondamentaux de la programmation système.' }),
  s('kotlin', 'Kotlin', 'Kt', 'languages', 'kotlin/kotlin-original', { en: 'Modern JVM language, widely used for Android apps.', fr: 'Langage moderne pour la JVM, très utilisé pour Android.' }),
  s('csharp', 'C#', 'Cs#', 'languages', 'csharp/csharp-original', { en: 'Typed object-oriented language of the .NET platform.', fr: 'Langage orienté objet typé de la plateforme .NET.' }),
  s('sql', 'SQL', 'Sq', 'languages', undefined, { en: 'Query language for relational databases.', fr: 'Langage de requête pour les bases de données relationnelles.' }),

  // Frontend
  s('html5', 'HTML', 'Ht', 'frontend', 'html5/html5-original', { en: 'Semantic markup for accessible web pages.', fr: 'Balisage sémantique pour des pages web accessibles.' }),
  s('css3', 'CSS', 'Cs', 'frontend', 'css3/css3-original', { en: 'Styling, layout and animation for the web.', fr: 'Mise en forme, mise en page et animation pour le web.' }),
  s('react', 'React', 'Re', 'frontend', 'react/react-original', { en: 'Component-based library for building user interfaces.', fr: 'Bibliothèque à composants pour construire des interfaces.' }),
  s('nextjs', 'Next.js', 'Nx', 'frontend', 'nextjs/nextjs-original', { en: 'React framework with routing, rendering and APIs.', fr: 'Framework React avec routage, rendu et API.' }, true),
  s('angular', 'Angular', 'Ng', 'frontend', 'angular/angular-original', { en: 'TypeScript framework for structured single-page apps.', fr: 'Framework TypeScript pour des applications monopage structurées.' }),
  s('tailwind', 'Tailwind CSS', 'Tw', 'frontend', 'tailwindcss/tailwindcss-original', { en: 'Utility-first CSS framework.', fr: 'Framework CSS orienté utilitaires.' }),
  s('bootstrap', 'Bootstrap', 'Bs', 'frontend', 'bootstrap/bootstrap-original', { en: 'Component CSS framework for responsive layouts.', fr: 'Framework CSS à composants pour des mises en page adaptatives.' }),
  s('responsive', 'Responsive Web Design', 'Rw', 'frontend', undefined, { en: 'Layouts that adapt from phones to large screens.', fr: 'Des mises en page qui s’adaptent du mobile au grand écran.' }),
  unlisted('gsap', 'GSAP + ScrollTrigger', 'Gs', 'frontend', undefined, { en: 'Timeline and scroll-linked animation toolkit.', fr: 'Outils d’animation par timeline et liée au défilement.' }),

  // Backend
  s('nodejs', 'Node.js', 'No', 'backend', 'nodejs/nodejs-original', { en: 'JavaScript runtime for servers and tooling.', fr: 'Environnement d’exécution JavaScript pour serveurs et outils.' }),
  s('express', 'Express.js', 'Ex', 'backend', 'express/express-original', { en: 'Minimal web framework for Node.js APIs.', fr: 'Framework web minimal pour les API Node.js.' }, true),
  s('springboot', 'Spring Boot', 'Sb', 'backend', 'spring/spring-original', { en: 'Java framework for production-ready services.', fr: 'Framework Java pour des services prêts pour la production.' }),
  s('symfony', 'Symfony', 'Sy', 'backend', 'symfony/symfony-original', { en: 'PHP framework for structured web applications.', fr: 'Framework PHP pour des applications web structurées.' }, true),
  s('dotnet', '.NET 8', 'Nt', 'backend', 'dotnetcore/dotnetcore-original', { en: 'Microsoft’s cross-platform runtime and libraries for C#.', fr: 'Environnement d’exécution et bibliothèques multiplateformes de Microsoft pour C#.' }),
  s('fastapi', 'FastAPI', 'Fa', 'backend', 'fastapi/fastapi-original', { en: 'High-performance Python framework for APIs.', fr: 'Framework Python performant pour les API.' }),
  s('rest', 'REST APIs', 'Ap', 'backend', undefined, { en: 'Resource-oriented HTTP interfaces between systems.', fr: 'Interfaces HTTP orientées ressources entre systèmes.' }),

  // Databases
  s('mysql', 'MySQL', 'My', 'databases', 'mysql/mysql-original', { en: 'Widely used open-source relational database.', fr: 'Base de données relationnelle open source très répandue.' }),
  s('mongodb', 'MongoDB', 'Mg', 'databases', 'mongodb/mongodb-original', { en: 'Document-oriented NoSQL database.', fr: 'Base de données NoSQL orientée documents.' }),
  s('oracle', 'Oracle Database', 'Or', 'databases', 'oracle/oracle-original', { en: 'Enterprise relational database system.', fr: 'Système de base de données relationnelle d’entreprise.' }),
  s('firestore', 'Firebase Firestore', 'Fs', 'databases', 'firebase/firebase-plain', { en: 'Real-time document database from Firebase.', fr: 'Base de données documentaire temps réel de Firebase.' }),
  s('sqlserver', 'SQL Server', 'Ss', 'databases', 'microsoftsqlserver/microsoftsqlserver-original', { en: 'Microsoft’s relational database platform.', fr: 'Plateforme de base de données relationnelle de Microsoft.' }),

  // Authentication & cloud
  s('firebase-auth', 'Firebase Authentication', 'Au', 'auth', 'firebase/firebase-original', { en: 'Managed sign-in and identity for apps.', fr: 'Authentification et gestion d’identité managées.' }),
  s('firebase', 'Firebase', 'Fb', 'auth', 'firebase/firebase-original', { en: 'Google’s app platform: hosting, data and auth.', fr: 'Plateforme applicative de Google : hébergement, données et authentification.' }),
  s('google-signin', 'Google Sign-In', 'Gg', 'auth', 'google/google-original', { en: 'OAuth sign-in with Google accounts.', fr: 'Connexion OAuth avec un compte Google.' }),
  unlisted('env-config', 'Environment-based configuration', 'En', 'auth', undefined, { en: 'Keeping secrets and settings out of source code.', fr: 'Garder secrets et paramètres hors du code source.' }),

  // Development tools
  s('android-studio', 'Android Studio', 'As', 'tools', 'androidstudio/androidstudio-original', { en: 'Official IDE for building Android applications.', fr: 'IDE officiel pour développer des applications Android.' }),
  s('linux', 'Linux (Ubuntu)', 'Lx', 'tools', 'ubuntu/ubuntu-plain', { en: 'Open-source operating system for development and servers.', fr: 'Système d’exploitation open source pour le développement et les serveurs.' }),
  s('windows', 'Windows', 'Wn', 'tools', 'windows11/windows11-original', { en: 'Microsoft’s desktop operating system.', fr: 'Système d’exploitation de bureau de Microsoft.' }),
  s('git', 'Git', 'Gi', 'tools', 'git/git-original', { en: 'Distributed version control.', fr: 'Gestion de versions distribuée.' }),
  s('github', 'GitHub', 'Gh', 'tools', 'github/github-original', { en: 'Hosting, reviews and collaboration for Git projects.', fr: 'Hébergement, revues et collaboration pour les projets Git.' }, true),
  s('github-actions', 'GitHub Actions', 'Ga', 'tools', 'githubactions/githubactions-original', { en: 'CI/CD workflows inside GitHub.', fr: 'Workflows CI/CD intégrés à GitHub.' }),
  s('xunit', 'xUnit (unit testing)', 'Xu', 'tools', undefined, { en: 'Unit-testing framework for .NET.', fr: 'Framework de tests unitaires pour .NET.' }),
  s('postman', 'Postman', 'Pm', 'tools', 'postman/postman-original', { en: 'Designing and testing HTTP APIs.', fr: 'Conception et test d’API HTTP.' }),
  s('vscode', 'Visual Studio Code', 'Vs', 'tools', 'vscode/vscode-original', { en: 'Extensible code editor.', fr: 'Éditeur de code extensible.' }),
  s('vite', 'Vite', 'Vi', 'tools', 'vitejs/vitejs-original', { en: 'Fast frontend build tool and dev server.', fr: 'Outil de build et serveur de développement rapide.' }),
  s('docker', 'Docker', 'Dk', 'tools', 'docker/docker-original', { en: 'Containers for reproducible environments.', fr: 'Conteneurs pour des environnements reproductibles.' }),
  s('wsl', 'WSL', 'Ws', 'tools', 'linux/linux-original', { en: 'Linux environment running on Windows.', fr: 'Environnement Linux exécuté sous Windows.' }),

  // UI/UX & design
  s('figma', 'Figma', 'Fg', 'design', 'figma/figma-original', { en: 'Collaborative interface design and prototyping.', fr: 'Conception d’interfaces et prototypage collaboratifs.' }),
  s('uiux', 'UI/UX Design', 'Ux', 'design', undefined, { en: 'Designing clear, usable product experiences.', fr: 'Concevoir des expériences produit claires et utilisables.' }),
  unlisted('css-animations', 'CSS Animations', 'An', 'design', undefined, { en: 'Transitions and keyframe motion in CSS.', fr: 'Transitions et animations par keyframes en CSS.' }),
  unlisted('a11y', 'Web Accessibility', 'A11', 'design', undefined, { en: 'Interfaces usable by everyone, including assistive tech.', fr: 'Des interfaces utilisables par tous, technologies d’assistance comprises.' }),

  // Cybersecurity & networking
  s('kali', 'Kali Linux', 'Ka', 'security', undefined, { en: 'Linux distribution for security testing.', fr: 'Distribution Linux dédiée aux tests de sécurité.' }),
  s('burp', 'Burp Suite', 'Bu', 'security', undefined, { en: 'Toolkit for web application security testing.', fr: 'Suite d’outils pour tester la sécurité des applications web.' }),
  s('nmap', 'Nmap', 'Nm', 'security', undefined, { en: 'Network discovery and port scanning.', fr: 'Découverte réseau et scan de ports.' }),
  s('wireshark', 'Wireshark', 'Wi', 'security', undefined, { en: 'Network traffic capture and analysis.', fr: 'Capture et analyse du trafic réseau.' }),
  s('netsec', 'Network Security', 'Ns', 'security', undefined, { en: 'Protecting networks and the data that crosses them.', fr: 'Protéger les réseaux et les données qui y circulent.' }),
  s('ccna', 'CCNA 3', 'Cc', 'security', undefined, { en: 'Cisco networking curriculum (level 3).', fr: 'Cursus réseau Cisco (niveau 3).' }),
  s('ospf', 'OSPF', 'Os', 'security', undefined, { en: 'Link-state routing protocol for IP networks.', fr: 'Protocole de routage à état de liens pour les réseaux IP.' }),
  s('subfinder', 'Subfinder', 'Sf', 'security', undefined, { en: 'Passive subdomain discovery for reconnaissance.', fr: 'Découverte passive de sous-domaines pour la reconnaissance.' }),
  s('packet-tracer', 'Cisco Packet Tracer', 'Pt', 'security', undefined, { en: 'Network simulation for designing and testing topologies.', fr: 'Simulation réseau pour concevoir et tester des topologies.' }),
  s('fraud-rules', 'Fraud detection rules', 'Fd', 'security', undefined, { en: 'Explainable rules that flag duplicate or suspicious invoices.', fr: 'Règles explicables qui signalent les factures en double ou suspectes.' }),
  s('appsec', 'Web Application Security', 'Wa', 'security', undefined, { en: 'Finding and preventing vulnerabilities in web apps.', fr: 'Détecter et prévenir les vulnérabilités des applications web.' }),

  // Other
  s('javafx', 'JavaFX', 'Jf', 'other', undefined, { en: 'Java toolkit for desktop user interfaces.', fr: 'Boîte à outils Java pour les interfaces de bureau.' }),
  s('wordpress', 'WordPress', 'Wp', 'other', 'wordpress/wordpress-plain', { en: 'Content management system for websites.', fr: 'Système de gestion de contenu pour sites web.' }),
  s('pandas', 'Pandas', 'Pd', 'other', 'pandas/pandas-original', { en: 'Python library for data manipulation and analysis.', fr: 'Bibliothèque Python de manipulation et d’analyse de données.' }, true),
  s('bi', 'Business Intelligence', 'Bi', 'other', undefined, { en: 'Turning business data into insight and decisions.', fr: 'Transformer les données métier en informations et en décisions.' }),
  s('ml', 'Machine Learning', 'Ml', 'other', undefined, { en: 'Models that learn patterns from data.', fr: 'Des modèles qui apprennent des motifs à partir des données.' }),
  s('ai', 'Artificial Intelligence', 'Ai', 'other', undefined, { en: 'Systems that reason, predict and assist.', fr: 'Des systèmes qui raisonnent, prédisent et assistent.' }),
];

/**
 * Technologies used inside a project (verified in that project's source) that are not part of
 * Ranim's Skills section. They only appear as technology badges on project cards and case studies,
 * so the Skills grid and its counts stay exactly as she listed them.
 */
const PROJECT_TECH = 'Verified in the project source (finguard-ai, Nov 2026).';
const SBI_TECH = 'Verified in the project source (sephora-business-insight1: package.json, requirements.txt, backend/app), Nov 2026.';
const projectOnlyTech: Skill[] = [
  { ...s('aspnetcore', 'ASP.NET Core 10', 'As', 'backend', 'dotnetcore/dotnetcore-original', { en: 'Microsoft’s framework for web APIs in C#.', fr: 'Framework de Microsoft pour les API web en C#.' }), source: PROJECT_TECH },
  { ...s('efcore', 'Entity Framework Core', 'Ef', 'databases', undefined, { en: 'Object-relational mapper for .NET.', fr: 'Mappage objet-relationnel pour .NET.' }), source: PROJECT_TECH },
  { ...s('sqlite', 'SQLite', 'Sl', 'databases', 'sqlite/sqlite-original', { en: 'Embedded, file-based SQL database.', fr: 'Base de données SQL embarquée, dans un fichier.' }), source: PROJECT_TECH },
  { ...s('vitest', 'Vitest', 'Vt', 'tools', 'vitest/vitest-original', { en: 'Unit-testing framework for Vite projects.', fr: 'Framework de tests unitaires pour les projets Vite.' }), source: PROJECT_TECH },
  { ...s('playwright', 'Playwright', 'Pw', 'tools', 'playwright/playwright-original', { en: 'End-to-end browser testing.', fr: 'Tests de bout en bout dans le navigateur.' }), source: PROJECT_TECH },
  { ...s('recharts', 'Recharts', 'Rc', 'frontend', undefined, { en: 'Composable charting library for React.', fr: 'Bibliothèque de graphiques composables pour React.' }), source: SBI_TECH },
  { ...s('parquet', 'Apache Parquet', 'Pq', 'databases', undefined, { en: 'Columnar file format for fast analytical reads.', fr: 'Format de fichier en colonnes pour des lectures analytiques rapides.' }), source: SBI_TECH },
  { ...s('pytest', 'pytest', 'Pt', 'tools', undefined, { en: 'Testing framework for Python.', fr: 'Framework de tests pour Python.' }), source: SBI_TECH },
  { ...s('claude-api', 'Claude API', 'Cl', 'other', undefined, { en: 'Anthropic’s API for Claude models.', fr: 'L’API d’Anthropic pour les modèles Claude.' }), source: SBI_TECH },
];

export function skillById(id: string): Skill | undefined {
  return skills.find((skill) => skill.id === id) ?? projectOnlyTech.find((skill) => skill.id === id);
}
