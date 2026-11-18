# Ranim Doggaz — Portfolio

Personal portfolio of **Ranim Doggaz**, full-stack developer and final-year Software Engineering & Information Systems (GLSI) student at Leaders University, Tunisia.

The site presents who I am, the technologies I work with, my projects and my experience. It is built around an iridescent-butterfly identity: a 3D butterfly, liquid-glass waves and glass interface panels, in both light and dark themes.

### 🌐 Live Portfolio: [Visit My Website](https://ranim-portfolio-delta.vercel.app)

---

## Highlights

- **Animated hero.** A WebGL butterfly (Three.js / React Three Fiber) flies in, settles on its platform and flaps its wings. Smaller butterflies drift across the page, and the background is a slowly moving liquid-glass wave.
- **About.** A glass developer ID card with my photo that swings, tilts and flips to show education, interests and languages.
- **Skills.** A periodic-table layout of 63 technologies with category filters and a detail panel.
- **Projects.** A 3D carousel of eight projects with category filters, real screenshots and GitHub links. Each project has its own case-study page with an identity based on the real application.
- **Experience and contact.** A timeline of education and internship, plus email, LinkedIn, GitHub and a downloadable CV.
- **Responsive design.** A desktop layout and a dedicated phone layout: compact navigation with a full-screen menu, a swipeable project carousel, a still ID card that flips on tap, and a 3×3 skills grid that expands with “View more”.
- **English and French.** Every text exists in both languages; the chosen language is remembered.
- **Light and dark themes.** Pearl-lavender light mode and deep-violet dark mode.
- **Accessibility.** Keyboard navigation, focus management in the menu and image viewer, and a reduced-motion mode. If WebGL isn't available, the site falls back to still images and CSS butterflies.

## Featured projects

| Project | Summary | Technologies |
|---|---|---|
| [MindMirror](https://github.com/ranimedogaz1234-dot/MindMirror) | Trilingual (EN / FR / AR) personality-type assessment with transparent scoring | React, TypeScript, Firebase, Tailwind CSS, Vite |
| PetParadise | E-commerce platform for pet products (in development) | Next.js, TypeScript |
| Sephora Business Insight | Business-intelligence platform for products and customer reviews (in development) | Next.js, FastAPI, Python |
| [Travel-TR](https://github.com/ranimedogaz1234-dot/Travel-Tr) | Full-stack travel booking app with filterable destinations and reservations | Angular, TypeScript, Node.js, Express |
| [CarRent2 / Sayara](https://github.com/ranimedogaz1234-dot/Sayara) | Luxury car rental platform with booking and an admin dashboard | Symfony, PHP, Bootstrap, GitHub Actions |
| [Tech Store](https://github.com/ranimedogaz1234-dot/tech-store) | PHP and MySQL storefront with Cash on Delivery checkout | PHP, MySQL, JavaScript, HTML, CSS |
| [Medicare Hospital Management](https://github.com/ranimedogaz1234-dot/medicare-hospital-manager) | JavaFX desktop app for patients, appointments and medical records | Java, JavaFX, MySQL |
| FinGuard AI | Financial-controls platform in development: explainable invoice verification and supplier risk scoring | C#, .NET 8, xUnit, GitHub Actions |

Screenshots come from each project's repository or from running the real application with demo or synthetic data.

## Technologies

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS 4 with custom CSS |
| 3D and animation | Three.js, React Three Fiber, GSAP with ScrollTrigger, Motion |
| Internationalisation | next-intl (English and French) |
| Images | next/image with AVIF and WebP |

## Getting started

**Requirements:** Node.js 20 or later and npm.

```bash
git clone https://github.com/ranimedogaz1234-dot/ranim-portfolio.git
cd ranim-portfolio
npm install
```

### Local development

```bash
npm run dev
```

Open <http://localhost:3000>. The site redirects to `/en`, or to the language the visitor chose last.

### Checks

```bash
npm run typecheck    # strict TypeScript
npm run check:i18n   # English and French message files have the same keys
```

### Production build

```bash
npm run build
npm start            # serves the production build on http://localhost:3000
```

The site uses Next.js server features (locale redirects in `src/proxy.ts` and image optimisation), so it should be deployed on a platform that runs Next.js, such as Vercel. It isn't a static export.

## Project structure

```
messages/                 interface text (en.json, fr.json)
public/
  visuals/                butterfly wings and liquid-glass wave images
  projects/<slug>/        project screenshots
  profile/                portrait
  cv/                     downloadable CV (PDF)
  icons/                  self-hosted technology logos
src/
  app/                    routes, global styles (globals.css) and phone layout (mobile.css)
  components/
    sections/             Hero, About (ID card), Skills, Projects, Experience, Contact
    case-study/           project case-study pages and screenshot gallery
    visuals/              WebGL butterfly, wave shader, small butterflies, effects
    nav/ theme/ ui/       navigation, theme and language controls, shared UI
  content/                profile, skills, projects, experience (all site content)
  i18n/                   locale routing and messages loading
  proxy.ts                locale redirects
```

To change the content, edit the files in `src/content/` and `messages/`. To add a project, follow the guide at the top of `src/content/projects.ts`.

## Contact

- Email: [ranimedogaz1234@gmail.com](mailto:ranimedogaz1234@gmail.com)
- LinkedIn: [ranim-d-9384673a6](https://www.linkedin.com/in/ranim-d-9384673a6/)
- GitHub: [@ranimedogaz1234-dot](https://github.com/ranimedogaz1234-dot)

---

© 2026 Ranim Doggaz. All rights reserved.
