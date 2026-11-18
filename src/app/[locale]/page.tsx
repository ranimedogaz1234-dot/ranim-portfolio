import { use } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { SiteNav } from '@/components/nav/SiteNav';
import { Backdrop } from '@/components/visuals/Backdrop';
import { ScrollEffects } from '@/components/visuals/ScrollEffects';
import { TravellingButterfly } from '@/components/visuals/TravellingButterfly';
import { SmallButterfliesHost } from '@/components/visuals/SmallButterfliesHost';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations();

  return (
    <>
      <a href="#main" className="skip-link">
        {t('a11y.skipToContent')}
      </a>
      <Backdrop />
      <SiteNav />
      <main id="main" className="page" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container-x">{t('footer.rights', { year: new Date().getFullYear() })}</div>
      </footer>
      <TravellingButterfly />
      <SmallButterfliesHost />
      <ScrollEffects />
    </>
  );
}
