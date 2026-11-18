// Fails if en.json and fr.json don't have exactly the same keys.
import { readFileSync } from 'node:fs';

const load = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), 'utf8'));
const keys = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

const en = new Set(keys(load('en')));
const fr = new Set(keys(load('fr')));
const missingFr = [...en].filter((k) => !fr.has(k));
const missingEn = [...fr].filter((k) => !en.has(k));

if (missingFr.length || missingEn.length) {
  console.error('Missing in fr.json:', missingFr);
  console.error('Missing in en.json:', missingEn);
  process.exit(1);
}
console.log(`✓ ${en.size} keys, EN and FR in sync`);
