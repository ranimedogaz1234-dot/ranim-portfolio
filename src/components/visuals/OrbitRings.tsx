'use client';

import { useId } from 'react';

/**
 * Orbit lines + light platform around the hero butterfly.
 *
 * Both are laid out from the butterfly's real body position, written by ButterflyScene as CSS
 * variables on the stage (--bf-cx / --bf-cy thorax, --bf-tail abdomen tip, --bf-w wingspan,
 * --bf-lift hover). Drawing coordinates are relative to the body, so the effects stay aligned at
 * every screen size and while the butterfly hovers. Colours come from theme variables, so the
 * soft and dark themes show the same composition with adapted contrast.
 */

// orbits in a body-centred space where 1000 units = the SVG width (= 1.5 × wingspan)
const rings = [
  { rx: 455, ry: 92, rot: -17, dur: 15 },
  { rx: 360, ry: 70, rot: -29, dur: 11 },
  { rx: 410, ry: 118, rot: 8, dur: 19, faint: true },
];
const ringPoint = (r: (typeof rings)[number], f: number) => {
  const a = f * Math.PI * 2;
  const x = r.rx * Math.cos(a);
  const y = r.ry * Math.sin(a);
  const c = Math.cos((r.rot * Math.PI) / 180);
  const s = Math.sin((r.rot * Math.PI) / 180);
  return [x * c - y * s, x * s + y * c] as const;
};
const sparkles: [number, number, number][] = [
  [-430, 150, 1],
  [400, 60, 0.8],
  [250, -230, 0.9],
  [-300, -180, 0.65],
  [470, -60, 0.7],
  [-120, 250, 0.55],
];

export function OrbitRings({ animate }: { animate: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <>
      <svg className="orbit" viewBox="-500 -375 1000 750" aria-hidden="true">
        <defs>
          <linearGradient id={`ring-${id}`} x1="0" x2="1">
            <stop offset="0" className="orbit__stop orbit__stop--a" />
            <stop offset="0.3" className="orbit__stop orbit__stop--b" />
            <stop offset="0.65" className="orbit__stop orbit__stop--c" />
            <stop offset="1" className="orbit__stop orbit__stop--a" />
          </linearGradient>
          <radialGradient id={`spark-${id}`}>
            <stop offset="0" className="orbit__stop orbit__stop--core" />
            <stop offset="0.35" className="orbit__stop orbit__stop--halo" />
            <stop offset="1" className="orbit__stop orbit__stop--fade" />
          </radialGradient>
          <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {rings.map((r, i) => {
          const pathId = `orbit-${id}-${i}`;
          const d = `M ${-r.rx} 0 a ${r.rx} ${r.ry} 0 1 0 ${r.rx * 2} 0 a ${r.rx} ${r.ry} 0 1 0 ${-r.rx * 2} 0`;
          return (
            <g key={pathId} className={r.faint ? 'orbit__ring orbit__ring--faint' : 'orbit__ring'}>
              <path id={pathId} d={d} transform={`rotate(${r.rot})`} fill="none" stroke={`url(#ring-${id})`} strokeWidth={1.6} filter={`url(#glow-${id})`} />
              {[0.12, 0.48, 0.81].map((f) => {
                const [x, y] = ringPoint(r, f);
                return <circle key={f} cx={x} cy={y} r={5} fill={`url(#spark-${id})`} />;
              })}
              <g transform={`rotate(${r.rot})`}>
                <circle r={4.5} fill={`url(#spark-${id})`} filter={`url(#glow-${id})`}>
                  {animate && (
                    <animateMotion dur={`${r.dur}s`} repeatCount="indefinite">
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  )}
                </circle>
              </g>
            </g>
          );
        })}

        {sparkles.map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path
              className="orbit__sparkle"
              d="M0 -14 C1.2 -3 3 -1.2 14 0 C3 1.2 1.2 3 0 14 C-1.2 3 -3 1.2 -14 0 C-3 -1.2 -1.2 -3 0 -14Z"
              filter={`url(#glow-${id})`}
            >
              {animate && <animate attributeName="opacity" values="0.25;1;0.25" dur={`${2.6 + i * 0.7}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />}
            </path>
          </g>
        ))}
      </svg>

      {/* light platform: a soft reflection under the abdomen tip; it follows the hover only
          partly (like light on a surface) and shrinks / fades a little as the butterfly rises */}
      <svg className="orbit-platform" viewBox="-300 -60 600 120" aria-hidden="true">
        <defs>
          <radialGradient id={`pool-${id}`}>
            <stop offset="0" className="orbit__stop orbit__stop--pool-core" />
            <stop offset="0.35" className="orbit__stop orbit__stop--pool-mid" />
            <stop offset="1" className="orbit__stop orbit__stop--pool-fade" />
          </radialGradient>
          <filter id={`pglow-${id}`} x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <ellipse cx={0} cy={0} rx={280} ry={46} fill={`url(#pool-${id})`} />
        <ellipse className="orbit-platform__core" cx={0} cy={0} rx={92} ry={11} filter={`url(#pglow-${id})`} />
        {[64, 112, 164, 222].map((rx, i) => (
          <ellipse key={rx} className="orbit-platform__ripple" cx={0} cy={0} rx={rx} ry={rx * 0.165} fill="none" strokeWidth={1.3} style={{ opacity: 0.85 - i * 0.17 }}>
            {animate && <animate attributeName="rx" values={`${rx};${rx + 16};${rx}`} dur={`${5 + i}s`} repeatCount="indefinite" />}
          </ellipse>
        ))}
      </svg>
    </>
  );
}
