'use client';

import { useState } from 'react';
import { asset } from '@/lib/asset';
import type { Skill } from '@/content/types';

/**
 * Technology logo, self-hosted from Devicon (public/icons/<name>_<variant>.svg) so logos never
 * depend on a third-party CDN at runtime. Always rendered inside a fixed square box by the
 * caller's CSS (object-fit: contain), so a logo's own aspect ratio can't change the layout.
 * Falls back to the periodic-table symbol if a logo is missing.
 */
export function TechIcon({ skill, size = 24 }: { skill: Skill; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (!skill.icon || failed) {
    return (
      <span className="ptile__symbol tech-icon-fallback" style={{ fontSize: size * 0.62 }} aria-hidden="true">
        {skill.symbol}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos; next/image adds nothing here
    <img
      className="tech-icon"
      src={asset(`/icons/${skill.icon.replace('/', '_')}.svg`)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      data-mono={skill.mono ? 'true' : undefined}
      onError={() => setFailed(true)}
    />
  );
}
