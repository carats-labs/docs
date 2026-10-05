import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { load } from 'cheerio';
import config from 'instant-docs/config.js';

/**
 * marked v12+ dropped automatic heading ids, so `generateTableOfContents()`
 * in instant-docs (which only looks for `h{level}[id]`) silently produces an
 * empty table of contents. This plugin restores that behaviour without
 * touching instant-docs itself:
 *
 *   1. every heading inside `.content` gets a stable, unique id
 *   2. a nested `<ol>` table of contents is injected into `#toc`
 *
 * Because of (1) it also makes in-page anchor links work.
 *
 * Keep `generateTOC: false` in meta.js so instant-docs does not also try to
 * render a table of contents (which would duplicate this one).
 */

const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * Reads the closest dictionary the same way instant-docs does: a
 * `dictionary_<lang>.json` file takes precedence over a `dictionary.json`,
 * and both are looked up by walking up the directory tree.
 */
function getDictionaryValue(dir, lang, key) {
  let current = dir;
  while (current && current !== dirname(current)) {
    for (const file of [`dictionary_${lang}.json`, `dictionary_${config.DEFAULT_LANG}.json`, 'dictionary.json']) {
      try {
        const parsed = JSON.parse(readFileSync(join(current, file), config.ENCODING));
        const entries = file === 'dictionary.json' ? parsed[lang] ?? parsed[config.DEFAULT_LANG] ?? {} : parsed;
        if (entries[key] != null) return entries[key];
      } catch {
        /* keep walking up */
      }
    }
    current = dirname(current);
  }
  return key;
}

/**
 * Keeps letters and digits of any script, so a Turkish, Arabic or Spanish
 * heading still produces a usable anchor instead of collapsing to `section-1`.
 * Combining marks are kept too, otherwise a decomposed Arabic or Turkish vowel
 * loses its dots in the id.
 */
function slugify(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** Builds a nested <ol> from a flat, document-ordered heading list. */
function buildList(headings, start, parentLevel) {
  if (start >= headings.length) return '';
  let html = '<ol>';
  let i = start;
  while (i < headings.length) {
    const heading = headings[i];
    if (heading.level <= parentLevel) break;
    const level = heading.level;
    html += `<li><a href="#${heading.id}">${heading.text}</a>`;
    i += 1;
    const firstChild = i;
    while (i < headings.length && headings[i].level > level) i += 1;
    if (i > firstChild) html += buildList(headings.slice(firstChild, i), 0, level);
    html += '</li>';
  }
  return `${html}</ol>`;
}

export default function tableOfContents({ html, lang, dir }) {
  const $ = load(html);
  const content = $('div.content').first();
  const target = $('#toc').first();

  if (!content.length || !target.length) return $.html();

  const baseLevel = Number(config.DEFAULT_CONTENT_HEADING_LEVEL) || 2;
  const headings = content
    .find(HEADING_LEVELS.join(','))
    .toArray()
    .map((element) => ({
      element,
      level: Number(element.tagName.slice(1)),
      text: $(element).text().trim(),
    }))
    .filter((heading) => heading.text.length > 0 && heading.level >= baseLevel);

  if (!headings.length) return $.html();

  const used = new Set();
  for (const heading of headings) {
    const base = slugify(heading.text) || `section-${used.size + 1}`;
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    heading.id = id;
    $(heading.element).attr('id', id);
  }

  const title = getDictionaryValue(dir, lang, 'table_of_contents');
  target.html(`<section id="table-of-contents"><h2>${title}</h2>${buildList(headings, 0, baseLevel - 1)}</section>`);

  return $.html();
}
