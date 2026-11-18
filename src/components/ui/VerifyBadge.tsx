import { useTranslations } from 'next-intl';
import type { Verifiable } from '@/content/types';

/** Shown next to unverified content while developing. Never rendered for verified items. */
export function VerifyBadge({ item }: { item: Verifiable }) {
  const t = useTranslations('a11y');
  if (item.verified) return null;
  return (
    <span className="verify-badge" title={item.source}>
      ⚑ {t('needsVerification')}
    </span>
  );
}
