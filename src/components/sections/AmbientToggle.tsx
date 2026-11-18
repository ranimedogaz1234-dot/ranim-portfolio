'use client';

import { useTranslations } from 'next-intl';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { Icon } from '@/components/ui/Icon';

/** The round "play" button from the reference: pauses / resumes all ambient animation. */
export function AmbientToggle() {
  const t = useTranslations('a11y');
  const { paused, reduced, togglePaused } = useMotionPrefs();
  const running = !paused && !reduced;
  return (
    <button
      type="button"
      className="btn btn--outline btn--icon"
      onClick={togglePaused}
      aria-pressed={!running}
      aria-label={running ? t('pauseMotion') : t('playMotion')}
      title={running ? t('pauseMotion') : t('playMotion')}
      disabled={reduced}
    >
      <Icon name={running ? 'pause' : 'play'} size={20} />
    </button>
  );
}
