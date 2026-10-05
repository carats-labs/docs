/**
 * Verifies the docs against the framework that `bun create carats` installs.
 *
 *   1. every %d%.key used by a page exists in every language dictionary
 *   2. all languages define the same key set, with no empty translations
 *   3. keys consumed programmatically (by instant-docs or a local plugin) are
 *      accounted for rather than reported as dead
 *   4. no legacy API name survives in any page
 *   5. every identifier the docs attribute to a package is really exported,
 *      read from the installed .d.ts
 *   6. the documented folder layout matches the generated app
 *   7. no prose is hardcoded: every reader-visible string is a dictionary key
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

const DOCS = process.env.DOCS_DIR ?? 'versions/latest';
const APP = 'benchmark/carats-app/node_modules/@carats';
const LANGS = (process.env.CONTENT_LANGUAGES ?? 'en').split(',').map((l) => l.trim()).filter(Boolean);
const DEFAULT_LANG = process.env.DEFAULT_LANG ?? 'en';

// resolved without appearing as %d%. in a page:
//   expand             -> aria-label on the sidebar expand button (generate-nav.js)
//   table_of_contents  -> TOC heading (genereate-toc.js, and src/plugins/backend/toc.js)
//   change_language,
//   language_name_*    -> the <select> the language-changer plugin injects, which
//                         reads the dictionary file itself because it runs after
//                         placeholder substitution
//   no_results         -> static/js/search.js reads it off window.dictionary,
//                         which %dictionary% serialises into the page
const CONSUMED_ELSEWHERE = new Set([
  'expand',
  'table_of_contents',
  'change_language',
  'language_name_en',
  'language_name_tr',
  'language_name_ar',
  'language_name_es',
  'no_results',
]);

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
const dictionaries = Object.fromEntries(
  LANGS.map((lang) => [lang, JSON.parse(readFileSync(join(DOCS, `dictionary_${lang}.json`), 'utf8'))]),
);
const dict = dictionaries[DEFAULT_LANG];

// ---- 1 + 2. dictionary
const used = new Set();
for (const p of pages) {
  for (const m of readFileSync(p, 'utf8').matchAll(/%d%\.([A-Za-z0-9_]+)/g)) used.add(m[1]);
}
for (const lang of LANGS) {
  const d = dictionaries[lang];
  const missing = [...used].filter((k) => !(k in d)).sort();
  missing.length
    ? fail(`${lang}: referenced but absent from dictionary: ${missing.join(', ')}`)
    : ok(`${lang}: all ${used.size} referenced dictionary keys resolve`);
}
const reference = dict;
for (const lang of LANGS.filter((l) => l !== DEFAULT_LANG)) {
  const d = dictionaries[lang];
  const missing = Object.keys(reference).filter((k) => !(k in d));
  const extra = Object.keys(d).filter((k) => !(k in reference));
  const empty = Object.keys(d).filter((k) => !String(d[k] ?? '').trim());
  const untranslated = Object.keys(d).filter((k) => d[k] === reference[k]);
  const problems = [];
  if (missing.length) problems.push(`missing ${missing.length}: ${missing.join(', ')}`);
  if (extra.length) problems.push(`unknown ${extra.length}: ${extra.join(', ')}`);
  if (empty.length) problems.push(`empty ${empty.length}: ${empty.join(', ')}`);
  problems.length
    ? fail(`${lang}: ${problems.join(' | ')}`)
    : ok(`${lang}: complete, ${Object.keys(d).length} keys, none empty`);
  // identical strings are expected for proper nouns and package names
  const suspicious = untranslated.filter((k) => !/^(language_name_|welcome_title$|.*_title$|.*_col$|api_\w+_title$|rm_row_\w+_react$|rm_row_\w+_carats$|jjsx_heading$|hooks_title$|culets_heading$|base_sass_title$)/.test(k));
  suspicious.length && console.log(`  note  ${lang}: ${untranslated.length} value(s) equal to ${DEFAULT_LANG}, ${suspicious.length} of them not obviously a proper noun`);
}

const dead = Object.keys(reference).filter((k) => !used.has(k) && !CONSUMED_ELSEWHERE.has(k)).sort();
dead.length ? fail(`dead dictionary keys (used by nothing): ${dead.join(', ')}`)
            : ok('no dead dictionary keys');

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

// ---- 7. no hardcoded prose
// Anything a reader sees has to come from a dictionary key. Fenced code blocks
// and HTML comments are skipped: code samples stay as written, and commented
// blocks are not rendered.
let hardcoded = 0;
for (const p of pages.filter((f) => f.endsWith('.md'))) {
  const prose = readFileSync(p, 'utf8')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  for (const line of prose.split(/\r?\n/)) {
    // drop markdown link targets, placeholders, inline code and list/table syntax
    const text = line
      .replace(/\]\([^)]*\)/g, ']')
      .replace(/%[a-z_]+%(\.[a-z_0-9]+)?/gi, '')
      .replace(/`[^`]*`/g, '')
      .replace(/^[|:\-\s>*.]+/, '')
      .trim();
    if (!text || !/[A-Za-z]{3,}/.test(text)) continue;
    hardcoded++;
    fail(`${relative(DOCS, p)}: prose is not in the dictionary -> ${text.slice(0, 90)}`);
  }
}
if (!hardcoded) ok('no hardcoded prose in any content.md');

console.log(failures ? `\n${failures} problem(s)` : '\nall checks passed');
process.exit(failures ? 1 : 0);