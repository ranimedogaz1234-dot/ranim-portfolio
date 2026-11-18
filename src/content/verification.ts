import type { Verifiable } from './types';

/**
 * Unverified content is visible while developing (so it can be reviewed in place)
 * and stripped from production unless explicitly enabled.
 */
export const SHOW_UNVERIFIED =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_UNVERIFIED === 'true';

export function publishable<T extends Verifiable>(items: readonly T[]): T[] {
  return items.filter((item) => item.verified || SHOW_UNVERIFIED);
}

export function isPublishable(item: Verifiable | null | undefined): boolean {
  return !!item && (item.verified || SHOW_UNVERIFIED);
}
