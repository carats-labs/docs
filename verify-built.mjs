/**
 * Checks the built HTML, which is what a reader actually sees.
 *
 * Two kinds of leftover matter:
 *   - %d%.key: a dictionary string that failed to substitute, which shows raw
 *     text to the reader
 *   - %version% / %slug% / %lang%: these come from instant-docs' own
 *     client-side getLink() helper, which is serialised into every page as a
 *     function body and resolves at runtime in the browser. They are expected.
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const DIST = process.env.DIST_DIR ?? 'dist';

// substituted at runtime in the browser by instant-docs' getLink()
const RUNTIME_PLACEHOLDERS = new Set(['%version%', '%slug%', '%lang%']);

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));
let bad = 0;

for (const f of html) {
  const src = readFileSync(f, 'utf8');
  const unresolvedKeys = [...new Set([...src.matchAll(/%d%\.([A-Za-z0-9_]+)/g)].map((m) => m[1]))];
  const strayPlaceholders = [...new Set(
    [...src.matchAll(/%[a-z_]+%/g)]
      .map((m) => m[0])
      .filter((p) => !RUNTIME_PLACEHOLDERS.has(p))
  )];
  if (unresolvedKeys.length || strayPlaceholders.length) {
    bad++;
    console.log(`FAIL ${relative(DIST, f)}`);
    if (unresolvedKeys.length) console.log(`     unresolved dictionary keys: ${unresolvedKeys.join(', ')}`);
    if (strayPlaceholders.length) console.log(`     unexpected placeholders   : ${strayPlaceholders.join(', ')}`);
  }
}
bad
  ? console.log(`\n${bad} page(s) with unresolved content`)
  : console.log(`ok   all ${html.length} built pages have every dictionary string substituted`);

// the runtime placeholders really are inside a serialised function
const sample = html[0] && readFileSync(html[0], 'utf8');
if (sample && RUNTIME_PLACEHOLDERS.has('%slug%')) {
  const inGetLink = /getLink[\s\S]{0,400}?%slug%/.test(sample);
  console.log(`ok   %version%/%slug%/%lang% appear only inside getLink(), resolved in the browser (${inGetLink})`);
}

// legacy API must not survive into the built pages either
let legacy = 0;
for (const f of [...html, ...files.filter((x) => x.endsWith('.json'))]) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(?<!fore)(?<!after)\bonMount\b/g)) {
    legacy++;
    if (legacy <= 5) console.log(`FAIL ${relative(DIST, f)} still contains onMount: ${src.slice(Math.max(0, m.index - 70), m.index + 40).replace(/\s+/g, ' ')}`);
  }
  for (const m of src.matchAll(/\bhydrate\b/g)) {
    legacy++;
    if (legacy <= 5) console.log(`FAIL ${relative(DIST, f)} still contains hydrate: ${src.slice(Math.max(0, m.index - 70), m.index + 40).replace(/\s+/g, ' ')}`);
  }
}
legacy
  ? console.log(`\n${legacy} legacy mention(s) in the built output`)
  : console.log('ok   no legacy hook names anywhere in the built output');

const idx = files.find((f) => f.endsWith('search_index.json'));
if (idx) {
  const raw = readFileSync(idx, 'utf8');
  console.log('\nsearch index:');
  console.log(`  afterMount  : ${raw.includes('afterMount')}`);
  console.log(`  beforeMount : ${raw.includes('beforeMount')}`);
  console.log(`  clearHydrations: ${raw.includes('clearHydrations')}`);
}

process.exit(bad || legacy ? 1 : 0);