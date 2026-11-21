import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Inter, Nunito, Playfair_Display, Space_Grotesk } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import { ThemeProvider, themeInitScript } from '@/components/theme/ThemeProvider';
import { MotionPrefsProvider } from '@/components/theme/MotionPrefs';
import { asset } from '@/lib/asset';
import '../globals.css';
import '../mobile.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  variable: '--font-playfair',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Absolute origin for Open Graph images and alternate links: GitHub Pages for the static build,
 * the Vercel production domain on Vercel, localhost in development.
 */
const siteOrigin =
  process.env.GITHUB_PAGES === 'true'
    ? 'https://ranimedogaz1234-dot.github.io'
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale: locale as Locale, namespace: 'meta' });
  return {
    metadataBase: new URL(siteOrigin),
    title: t('title'),
    description: t('description'),
    alternates: { languages: { en: asset('/en'), fr: asset('/fr') } },
    openGraph: { title: t('title'), description: t('description'), locale: locale === 'fr' ? 'fr_FR' : 'en_US' },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0c0a12' },
    { media: '(prefers-color-scheme: light)', color: '#e3d6fb' },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${grotesk.variable} ${nunito.variable}`}
    >
      <body>
        {/* First thing in <body>, not in a hand-written <head>: the framework inserts preload
            links into <head> while streaming, and a manual head <script> made React's <head>
            intermittently mismatch (React error #418). It still runs before anything paints. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} suppressHydrationWarning />
        <NextIntlClientProvider>
          <ThemeProvider>
            <MotionPrefsProvider>{children}</MotionPrefsProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
