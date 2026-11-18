/**
 * One-off repair of the background artwork extracted from the reference renders.
 *
 * Root causes of the "cracked" background:
 *  1. The colour plates were stored at ~200×120 px with heavy WebP compression and stretched
 *     ~10× to fill the screen — the codec's 16 px blocks became visible 150–200 px rectangles.
 *  2. The soft-theme ribbon layer had a dithered, speckled alpha channel (pixel noise in the
 *     haze around the glass) that read as grain / broken texture once scaled.
 *  3. The “projects” ribbon layers were cut out with rectangular masks (straight vertical cut
 *     lines), so cross-fading to them during scroll exposed hard image boundaries. They are no
 *     longer used.
 *
 * Usage: node scripts/repair-visuals.mjs <sourceDir> <outDir>
 * (sourceDir holds the original files so the repair is reproducible.)
 */
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const [, , srcDir = 'public/visuals', outDir = 'public/visuals'] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const src = (f) => path.join(srcDir, f);
const out = (f) => path.join(outDir, f);

// 1 — plates: upscale, then blur well past the block size so only the colour field remains.
for (const theme of ['dark', 'light']) {
  const buf = await sharp(src(`plate-home-${theme}.webp`))
    .resize(1600, 900, { kernel: 'cubic', fit: 'fill' })
    .blur(28)
    .webp({ quality: 90, smartSubsample: true })
    .toBuffer();
  fs.writeFileSync(out(`plate-home-${theme}.webp`), buf);
}

// 2 — soft-theme ribbons: denoise the alpha channel (median removes the dithered speckle,
// a light blur restores smooth falloff), keep the colour untouched.
{
  const img = sharp(src('waves-home-light.webp'));
  const { width, height } = await img.metadata();
  const rgb = await img.clone().removeAlpha().median(3).toBuffer();
  const alpha = await img.clone().extractChannel('alpha').median(5).blur(1.4).toBuffer();
  const buf = await sharp(rgb).joinChannel(alpha).webp({ quality: 88, alphaQuality: 95 }).toBuffer();
  fs.writeFileSync(out('waves-home-light.webp'), buf);
  console.log('waves-home-light', width, height);
}
console.log('done →', outDir);
