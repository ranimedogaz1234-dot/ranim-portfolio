/**
 * Prefixes a file from /public with the site's base path.
 *
 * Vercel serves the site from the domain root, so the prefix is empty and paths are unchanged.
 * The GitHub Pages build (npm run build:pages) serves it under /ranim-portfolio and sets
 * NEXT_PUBLIC_BASE_PATH accordingly; next/link adds the base path itself, but plain <img>,
 * <a download>, Three.js texture URLs and unoptimized next/image sources do not.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
