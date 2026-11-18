import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, routing, type Locale } from '@/i18n/routing';
import { projectBySlug, projectSlugAliases, projects } from '@/content/projects';
import { CaseStudy } from '@/components/case-study/CaseStudy';

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : routing.defaultLocale) as Locale;
  const project = projectBySlug(slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('caseStudyTitle', { project: project.title }),
    description: project.tagline[locale],
    alternates: { languages: { en: `/en/projects/${slug}`, fr: `/fr/projects/${slug}` } },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);
  const renamed = projectSlugAliases[slug];
  if (renamed) redirect(`/${locale}/projects/${renamed}`);
  const project = projectBySlug(slug);
  if (!project) notFound();
  return <CaseStudy project={project} locale={locale} />;
}
