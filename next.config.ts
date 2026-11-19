import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Two hosting targets share this config:
 * - Vercel (default `npm run build`): the regular Next.js server build, unchanged.
 * - GitHub Pages (`npm run build:pages`, which sets GITHUB_PAGES=true): a static export served
 *   under /ranim-portfolio. Pages has no server, so images are served unoptimized.
 */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const pagesBasePath = '/ranim-portfolio';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // a stray package-lock.json in the user's home folder made Next infer the wrong workspace root
  turbopack: { root: process.cwd() },
  transpilePackages: ['three'],
  images: {
    formats: ['image/avif', 'image/webp'],
    ...(isGitHubPages ? { unoptimized: true } : {}),
  },
  ...(isGitHubPages
    ? {
        output: 'export' as const,
        basePath: pagesBasePath,
        trailingSlash: true,
        env: { NEXT_PUBLIC_BASE_PATH: pagesBasePath },
      }
    : {}),
};

export default withNextIntl(nextConfig);
