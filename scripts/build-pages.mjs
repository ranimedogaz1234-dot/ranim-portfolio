/**
 * Static build for GitHub Pages: https://ranimedogaz1234-dot.github.io/ranim-portfolio/
 *
 * The Vercel build (`npm run build`) is untouched. This script:
 * 1. Sets aside the two server-only files that a static export cannot contain:
 *    - src/proxy.ts (locale redirects; replaced below by a static index.html)
 *    - src/app/[locale]/[...rest] (catch-all 404; replaced below by a static 404.html)
 * 2. Runs `next build` with GITHUB_PAGES=true (static export, /ranim-portfolio base path).
 * 3. Always puts the files back, even if the build fails.
 * 4. Adds index.html (sends "/" to the visitor's saved language, else English),
 *    404.html and .nojekyll to the exported `out/` folder.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, renameSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = process.cwd();
const BASE = '/ranim-portfolio';
const serverOnly = ['src/proxy.ts', 'src/app/[locale]/[...rest]'];
const stash = mkdtempSync(path.join(tmpdir(), 'pages-build-'));
const moved = [];

function restore() {
  for (const rel of moved.splice(0)) {
    const from = path.join(stash, rel);
    const to = path.join(root, rel);
    try {
      renameSync(from, to);
    } catch {
      cpSync(from, to, { recursive: true });
      rmSync(from, { recursive: true, force: true });
    }
  }
}
process.on('SIGINT', () => { restore(); process.exit(130); });
process.on('SIGTERM', () => { restore(); process.exit(143); });

let status = 1;
try {
  for (const rel of serverOnly) {
    if (!existsSync(path.join(root, rel))) continue;
    const dest = path.join(stash, rel);
    cpSync(path.join(root, rel), dest, { recursive: true });
    rmSync(path.join(root, rel), { recursive: true, force: true });
    moved.push(rel);
  }
  const res = spawnSync(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build'], {
    stdio: 'inherit',
    env: { ...process.env, GITHUB_PAGES: 'true' },
  });
  status = res.status ?? 1;
} finally {
  restore();
  rmSync(stash, { recursive: true, force: true });
}
if (status !== 0) process.exit(status);

const out = path.join(root, 'out');

// "/" → saved language (NEXT_LOCALE cookie, set by the language switcher), otherwise English.
const pickLocale = `var m=document.cookie.match(/(?:^|; )NEXT_LOCALE=(en|fr)/);var l=m?m[1]:'en';`;
writeFileSync(
  path.join(out, 'index.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Ranim Doggaz — Portfolio</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<link rel="canonical" href="${BASE}/en/">
<script>${pickLocale}location.replace('${BASE}/'+l+'/'+location.search+location.hash);</script>
<noscript><meta http-equiv="refresh" content="0; url=${BASE}/en/"></noscript>
<style>html{background:#0c0a12;color:#e3d6fb;font-family:system-ui,sans-serif}</style>
</head><body><p style="text-align:center;margin-top:40vh"><a href="${BASE}/en/" style="color:inherit">Ranim Doggaz — Portfolio</a></p></body></html>
`,
);

// Unknown paths: renamed project slugs go to their new page; anything else to the localized home.
writeFileSync(
  path.join(out, '404.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Page not found — Ranim Doggaz</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<script>
(function(){
  var base='${BASE}', aliases={sayara:'carrent2'};
  var p=location.pathname.indexOf(base)===0?location.pathname.slice(base.length):location.pathname;
  var m=p.match(/^\\/(en|fr)(\\/.*)?$/);
  var c=document.cookie.match(/(?:^|; )NEXT_LOCALE=(en|fr)/);
  var l=m?m[1]:(c?c[1]:'en');
  var pm=p.match(/^\\/(?:en|fr)\\/projects\\/([^/]+)\\/?$/);
  if(pm&&aliases[pm[1]]){location.replace(base+'/'+l+'/projects/'+aliases[pm[1]]+'/');return;}
  document.addEventListener('DOMContentLoaded',function(){document.getElementById('home').href=base+'/'+l+'/';});
})();
</script>
<style>html{background:#0c0a12;color:#e3d6fb;font-family:system-ui,sans-serif}body{display:grid;place-items:center;min-height:100vh;margin:0;text-align:center}a{color:#c9b3ff}</style>
</head><body><main><h1>404</h1><p>This page could not be found.<br>Page introuvable.</p><p><a id="home" href="${BASE}/en/">Ranim Doggaz — Portfolio</a></p></main></body></html>
`,
);

writeFileSync(path.join(out, '.nojekyll'), '');
console.log('GitHub Pages export ready in out/');
