/**
 * Ranim's final background renders (soft and dark), used as the liquid-glass layer.
 * WavesGL animates them; the plain image is the fallback before WebGL starts / without WebGL.
 */
export const GLASS_BG = {
  light: '/visuals/glass-bg-light.webp',
  dark: '/visuals/glass-bg-dark.webp',
} as const;

export const GLASS_BG_SIZE = { width: 1672, height: 941 } as const;
