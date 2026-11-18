import type { CaseStudyTheme } from '@/content/types';

/**
 * Abstract decoration behind each case-study title, giving every project page its own
 * personality. Purely ornamental: no numbers, no fake UI, no invented content.
 */
export function VariantArt({ variant }: { variant: CaseStudyTheme['variant'] }) {
  return (
    <div className="cs-art" aria-hidden="true">
      {variant === 'analytics' && (
        <svg viewBox="0 0 800 400" preserveAspectRatio="none">
          <path d="M0 330 C 90 300 140 250 210 262 S 330 170 400 190 S 520 90 600 120 S 720 60 800 40" />
          <path className="soft" d="M0 360 C 120 340 180 310 260 318 S 380 260 460 270 S 600 210 800 190" />
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={30 + i * 55} width="22" y={400 - (40 + ((i * 37) % 120))} height={40 + ((i * 37) % 120)} rx="4" />
          ))}
        </svg>
      )}
      {variant === 'calm' && (
        <svg viewBox="0 0 800 400">
          {[60, 110, 160, 210, 260].map((r) => (
            <circle key={r} cx="620" cy="160" r={r} />
          ))}
        </svg>
      )}
      {variant === 'playful' && (
        <svg viewBox="0 0 800 400">
          <path className="blob-a" d="M560 70c70-40 170 0 190 80s-40 160-120 170-150-40-160-110 20-110 90-140z" />
          <path className="blob-b" d="M690 250c40-20 90 10 90 55s-50 70-90 60-50-90 0-115z" />
          <circle className="blob-c" cx="500" cy="300" r="34" />
        </svg>
      )}
      {variant === 'luxury' && (
        <svg viewBox="0 0 800 400" preserveAspectRatio="none">
          <path d="M0 300 C 200 280 420 220 800 120" />
          <path className="soft" d="M0 330 C 220 310 460 260 800 170" />
          <path className="soft" d="M0 360 C 240 345 500 300 800 220" />
        </svg>
      )}
      {variant === 'travel' && (
        <svg viewBox="0 0 800 400">
          <path className="route" d="M380 320 C 470 140 640 90 760 150" />
          <circle cx="380" cy="320" r="7" />
          <circle cx="760" cy="150" r="7" />
          <path className="sun" d="M520 400 a160 160 0 0 1 320 0z" />
        </svg>
      )}
      {variant === 'editorial' && (
        <svg viewBox="0 0 800 400" preserveAspectRatio="none">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="480" x2="800" y1={40 + i * 28} y2={40 + i * 28} />
          ))}
        </svg>
      )}
      {(variant === 'retail' || variant === 'clinical' || variant === 'fintech') && (
        <svg viewBox="0 0 800 400">
          <defs>
            <pattern id={`grid-${variant}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" />
            </pattern>
          </defs>
          <rect x="420" y="0" width="380" height="400" fill={`url(#grid-${variant})`} />
        </svg>
      )}
    </div>
  );
}
