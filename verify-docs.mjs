/**
 * Verifies the docs against the framework that `bun create carats` installs.
 *
 *   1. every %d%.key used by a page exists in the dictionary
 *   2. keys consumed programmatically (by instant-docs or a local plugin) are
 *      accounted for rather than reported as dead
 *   3. no legacy API name survives in any page
 *   4. every identifier the docs attribute to a package is really exported,
 *      read from the installed .d.ts
 *   5. the documented folder layout matches the generated app
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

const DOCS = 'carats-docs/versions/latest';
const APP = 'benchmark/carats-app/node_modules/@carats';

// instant-docs resolves these itself, so they never appear as %d%. in a page:
//   expand             -> aria-label on the sidebar expand button (generate-nav.js)
//   table_of_contents  -> TOC heading (genereate-toc.js, and src/plugins/backend/toc.js)
const CONSUMED_ELSEWHERE = new Set(['expand', 'table_of_contents']);

let failures = 0;
const fail = (m) => { failures++; console.log('  FAIL  ' + m); };
const ok = (m) => console.log('  ok    ' + m);

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const pages = walk(DOCS).filter((f) => /\.(md|html)$/.test(f));
const dict = JSON.parse(readFileSync(join(DOCS, 'dictionary.json'), 'utf8')).en;

// ---- 1 + 2. dictionary
const used = new Set();
for (const p of pages) {
  for (const m of readFileSync(p, 'utf8').matchAll(/%d%\.([A-Za-z0-9_]+)/g)) used.add(m[1]);
}
const missing = [...used].filter((k) => !(k in dict)).sort();
missing.length ? fail(`referenced but absent from dictionary: ${missing.join(', ')}`)
               : ok(`all ${used.size} referenced dictionary keys resolve`);

const dead = Object.keys(dict).filter((k) => !used.has(k) && !CONSUMED_ELSEWHERE.has(k)).sort();
dead.length ? fail(`dead dictionary keys (used by nothing): ${dead.join(', ')}`)
            : ok('no dead dictionary keys');

const programmatically = [...CONSUMED_ELSEWHERE].filter((k) => k in dict);
programmatically.length && ok(`${programmatically.length} key(s) resolved by instant-docs/plugins: ${programmatically.join(', ')}`);

// ---- 3. legacy API
const LEGACY = [['hydrate(', /hydrate\(/g], ['onMount', /\bonMount\b/g], ['renderPage', /\brenderPage\b/g], ['crown', /\bcrown\b/g]];
let legacy = 0;
for (const p of pages) {
  const src = readFileSync(p, 'utf8');
  for (const [name, re] of LEGACY) {
    for (const m of src.matchAll(re)) {
      fail(`${relative(DOCS, p)}:${src.slice(0, m.index).split('\n').length} still uses ${name}`);
      legacy++;
    }
  }
}
if (!legacy) ok('no legacy API identifiers in any page');

// ---- 4. published exports
const EXPORTS = {
  hooks: ['afterMount', 'beforeMount', 'clearHydrations', 'use'],
  render: ['defineFacets', 'Burnish', 'getPageComponent'],
  ssr: ['defineServerEntry', 'culet', 'seat'],
  csr: ['mount', 'clientRender', 'goTo'],
  express: ['carats'],
  core: ['findClosest'],
};
if (!existsSync(APP)) {
  console.log(`  skip  ${APP} absent, cannot check published exports`);
} else {
  for (const [pkg, names] of Object.entries(EXPORTS)) {
    const dts = join(APP, pkg, 'dist', 'index.d.ts');
    if (!existsSync(dts)) { fail(`cannot read ${dts}`); continue; }
    const src = readFileSync(dts, 'utf8');
    const absent = names.filter((n) => !new RegExp(`\\b${n}\\b`).test(src));
    absent.length ? fail(`@carats/${pkg} does not export ${absent.join(', ')}`)
                  : ok(`@carats/${pkg} exports all ${names.length} documented name(s)`);
  }
  const apiPage = readFileSync(join(DOCS, 'on-menu', 'api-reference', 'content.md'), 'utf8');
  /\(fn: Factory<T>\): void;/.test(apiPage) ? fail('docs declare Setter as returning void; the package returns T')
                                           : ok('Setter documented as returning T, matching the package');
}

// ---- 5. folder layout
const appSrc = 'benchmark/carats-app/src';
if (existsSync(appSrc)) {
  const listed = [];
  const collect = (d, pre = '') => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) collect(p, `${pre}${e}/`);
      else listed.push(pre + e);
    }
  };
  collect(appSrc);
  const gs = readFileSync(join(DOCS, 'on-menu', 'getting-started', 'content.md'), 'utf8');
  const code = listed.filter((f) => /\.(ts|tsx|html|scss)$/.test(f));
  const undocumented = code.filter((f) => !gs.includes(f.split('/').pop()));
  undocumented.length
    ? console.log(`  note  generated files not shown in getting-started: ${undocumented.join(', ')}`)
    : ok('every generated source file appears in getting-started');

  // filenames the docs get wrong, compared against the generated app
  const STALE = {
    'server/culets/': 'culets.ts',
    'facets.cara.ts': 'facets.tsx',
  };
  for (const [wrong, right] of Object.entries(STALE)) {
    gs.includes(wrong)
      ? fail(`getting-started mentions ${wrong}; the generated app ships ${right}`)
      : ok(`getting-started names ${right}`);
  }

  // @carats/<pkg> mentioned by the docs must be a published package
  const published = new Set(readdirSync(APP).filter((d) => !statSync(join(APP, d)).isFile()));
  const claimed = new Set();
  for (const p of pages) for (const m of readFileSync(p, 'utf8').matchAll(/@carats\/([a-z]+)/g)) claimed.add(m[1]);
  const fictional = [...claimed].filter((n) => !published.has(n)).sort();
  fictional.length ? fail(`docs mention unpublished package(s): ${fictional.map((f) => '@carats/' + f).join(', ')}`)
                   : ok(`every @carats package the docs mention is published (${published.size} available)`);
}

console.log(failures ? `\n${failures} problem(s)` : '\nall checks passed');
process.exit(failures ? 1 : 0);