/**
 * Renders still frames of the procedural glass ribbons (WavesGL) for the static fallback
 * shown before WebGL starts / without WebGL. Uses the real site, so the stills match the shader.
 *
 *   npm run build && npx next start -p 3100      (in another terminal)
 *   npm i --no-save puppeteer-core               (one-time; uses your installed Chrome)
 *   node scripts/render-wave-stills.mjs
 */
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
for (const theme of ['dark', 'light']) {
  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });
  // reduced motion → the ribbons render a single still frame at t = 0
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument((t) => localStorage.setItem('ranim-theme', t), theme);
  await page.goto('http://localhost:3100/en', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.backdrop[data-gl="ready"]', { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.addStyleTag({
    content: `html, body { background: transparent !important; }
      body > *:not(.backdrop) { visibility: hidden !important; }
      .backdrop > *:not(.backdrop__canvas) { display: none !important; }
      .backdrop__canvas { opacity: 1 !important; transition: none !important; }`,
  });
  await new Promise((r) => setTimeout(r, 400));
  const png = await page.screenshot({ omitBackground: true, type: 'png' });
  await sharp(png).webp({ quality: 88, alphaQuality: 92, smartSubsample: true }).toFile(`public/visuals/glass-waves-${theme}.webp`);
  console.log('rendered', theme);
  await page.close();
}
await browser.close();
