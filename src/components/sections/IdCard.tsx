'use client';

import Image from 'next/image';
import { useState, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useMotionPrefs } from '@/components/theme/MotionPrefs';
import { MOBILE_QUERY, useMediaQuery } from '@/lib/useMediaQuery';

interface Props {
  labels: {
    card: string;
    flip: string;
    idTitle: string;
    education: string;
    interests: string;
    experience: string;
    status: string;
    statusValue: string;
    photoPending: string;
    photoAlt: string;
    languages: string;
  };
  name: string;
  title: string;
  monogram: string;
  education: string;
  interests: string[];
  languages: string;
  experience: { id: string; text: string; detail?: string; verified: boolean }[];
  photo: { src: string; width: number; height: number } | null;
}

/** Neutral portrait silhouette shown until Ranim's real photo is added (never a generated face). */
function PortraitPlaceholder({ label }: { label: string }) {
  return (
    <span className="idcard__portrait-empty">
      <svg viewBox="0 0 120 140" aria-hidden="true">
        <circle cx="60" cy="50" r="24" />
        <path d="M14 140c4-30 22-48 46-48s42 18 46 48z" />
      </svg>
      <span>{label}</span>
    </span>
  );
}

/**
 * Glass developer ID card hanging from a lanyard: swings gently, tilts toward the pointer,
 * flips on hover (mouse), on tap (touch) and with Enter / Space (keyboard).
 * Only verified (or, in development, flagged) information is passed in.
 */
export function IdCard({ labels, name, title, monogram, education, interests, languages, experience, photo }: Props) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { animate } = useMotionPrefs();
  const flipped = pinned || hovered;
  // phones: the card hangs still (no continuous swing) and flips on tap
  const mobile = useMediaQuery(MOBILE_QUERY); // always called: hooks must not be conditional
  const swing = animate && !mobile;

  // pointer tilt (springy, subtle)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 120, damping: 14 });
  const rotateY = useSpring(tiltY, { stiffness: 120, damping: 14 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!animate || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 14);
    tiltX.set(-py * 10);
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    tiltX.set(0);
    tiltY.set(0);
    if (e.pointerType === 'mouse') setHovered(false);
  };

  return (
    <div className="idcard-wrap" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        className="idcard-swing"
        animate={swing ? { rotateZ: [-2.4, 2.4, -2.4] } : { rotateZ: 0 }}
        transition={swing ? { duration: 6.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      >
        {/* lanyard strap + metal clip */}
        <span className="idcard-lanyard" aria-hidden="true">
          <span className="idcard-lanyard__strap idcard-lanyard__strap--l" />
          <span className="idcard-lanyard__strap idcard-lanyard__strap--r" />
          <svg className="idcard-lanyard__clip" viewBox="0 0 64 74">
            <defs>
              <linearGradient id="clip-metal" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#fbfbff" />
                <stop offset="0.35" stopColor="#b9b6c8" />
                <stop offset="0.6" stopColor="#f2f0f9" />
                <stop offset="1" stopColor="#8d899e" />
              </linearGradient>
            </defs>
            <path d="M24 2h16a4 4 0 0 1 4 4v10H20V6a4 4 0 0 1 4-4z" fill="url(#clip-metal)" />
            <rect x="14" y="16" width="36" height="22" rx="6" fill="url(#clip-metal)" />
            <rect x="22" y="22" width="20" height="5" rx="2.5" fill="#5c5870" opacity="0.55" />
            <path d="M26 38v12a6 6 0 0 0 12 0V38" fill="none" stroke="url(#clip-metal)" strokeWidth="5" />
            <ellipse cx="32" cy="66" rx="12" ry="6" fill="none" stroke="url(#clip-metal)" strokeWidth="3.4" />
          </svg>
        </span>

        <motion.div className="idcard-tilt" style={{ rotateX, rotateY }}>
          <motion.button
            type="button"
            className="idcard"
            aria-pressed={flipped}
            aria-label={`${labels.card} — ${labels.flip}`}
            onClick={() => setPinned((p) => !p)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={animate ? { type: 'spring', stiffness: 70, damping: 14 } : { duration: 0 }}
          >
            {/* front */}
            <span className="idcard__face glass" aria-hidden={flipped}>
              <span className="idcard__slot" />
              <span className="idcard__sheen" />
              <span className="idcard__top">
                <span className="idcard__label">{labels.idTitle}</span>
                <span className="brand__mono idcard__mono">{monogram}</span>
              </span>
              <span className="idcard__portrait">
                {photo ? (
                  <Image src={photo.src} width={photo.width} height={photo.height} alt={labels.photoAlt} sizes="(max-width: 900px) 70vw, 24vw" />
                ) : (
                  <PortraitPlaceholder label={labels.photoPending} />
                )}
              </span>
              <span className="idcard__identity">
                <span className="idcard__name display-title">{name}</span>
                <span className="idcard__title">{title}</span>
                <span className="idcard__status">
                  <span className="idcard__dot" />
                  {labels.status}: {labels.statusValue}
                </span>
              </span>
            </span>

            {/* back */}
            <span className="idcard__face idcard__face--back glass" aria-hidden={!flipped}>
              <span className="idcard__slot" />
              <span className="idcard__sheen" />
              <span className="idcard__label idcard__label--first">{labels.education}</span>
              <span className="idcard__text">{education}</span>

              <span className="idcard__label">{labels.interests}</span>
              <span className="idcard__chips">
                {interests.map((i) => (
                  <span key={i} className="chip idcard__chip">
                    {i}
                  </span>
                ))}
              </span>

              {experience.length > 0 && (
                <>
                  <span className="idcard__label">{labels.experience}</span>
                  {experience.map((e) => (
                    <span key={e.id} className="idcard__text">
                      {e.text}
                      {!e.verified && <span className="verify-badge">⚑</span>}
                      {e.detail && <span className="idcard__sub">{e.detail}</span>}
                    </span>
                  ))}
                </>
              )}
              <span className="idcard__label">{labels.languages}</span>
              <span className="idcard__text">{languages}</span>
              <span className="idcard__mono idcard__mono--back brand__mono" aria-hidden="true">
                {monogram}
              </span>
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
      <p className="idcard-hint" aria-hidden="true">
        ↻ {labels.flip}
      </p>
    </div>
  );
}
