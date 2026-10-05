import { readFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { load } from 'cheerio';
import config from 'instant-docs/config.js';

/**
 * Injects a language <select> next to the version picker.
 *
 * The language list comes from CONTENT_LANGUAGES and each option is labelled
 * with the `language_name_<code>` dictionary key, so a reader sees the
 * language in its own script ("Türkçe", "العربية") rather than a bare code.
 *
 * Every option carries the URL of *the page currently being read* in the
 * target language, not the home page. That keeps the reader in place when
 * they switch, which is the whole point of a per-page switcher.
 *
 * The slug is recovered from `dir` the same way instant-docs builds the route
 * in index.js: the path under `versions/<version>` with the on-menu /
 * off-menu marker removed.
 */
const MENU_DIRS = new Set(['on-menu', 'off-menu']);

function readDictionaryValue(dir, lang, key) {
  let current = dir;
  while (current && current !== dirname(current)) {
    for (const file of [`dictionary_${lang}.json`, 'dictionary.json']) {
      try {
        const parsed = JSON.parse(readFileSync(join(current, file), config.ENCODING));
        const entries = file === 'dictionary.json' ? parsed[lang] ?? {} : parsed;
        if (entries[key] != null) return entries[key];
      } catch {
        /* keep walking up */
      }
    }
    current = dirname(current);
  }
  return '';
}

function getSlug(dir, version) {
  const path = relative(join('versions', version), dir).split(/[\\/]/);
  if (MENU_DIRS.has(path[0])) path.shift();
  return path.join('/');
}

function getLink({ lang, version, slug }) {
  return config.LINK_FORMAT
    .replaceAll('%lang%', lang)
    .replaceAll('%version%', version)
    .replaceAll('%slug%', slug)
    .replaceAll('%path%', `/${slug}`)
    .replaceAll('//', '/')
    .replace(/\/$/, '');
}

export default function languageChanger({ html, lang, dir }) {
  const $ = load(html);
  const version = $('html').attr('x-version');
  const wrapper = $('#logo-wrapper');
  if (!wrapper.length) return $.html();

  const languages = (config.CONTENT_LANGUAGES ?? '')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean);
  if (languages.length < 2) return $.html();

  const slug = getSlug(dir, version);
  const options = languages.map((code) => {
    const name = readDictionaryValue(dir, lang, `language_name_${code}`) || code;
    return `<option value="${getLink({ lang: code, version, slug })}"${code === lang ? ' selected' : ''}>${name}</option>`;
  });

  const label = readDictionaryValue(dir, lang, 'change_language');
  wrapper.append(
    `<div class="dropdown"><select id="language-options" title="${label}" aria-label="${label}">${options.join('')}</select></div>`,
  );

  function navigateOnChange() {
    document.addEventListener('DOMContentLoaded', () => {
      const options = document.getElementById('language-options');
      if (!options) return;
      options.addEventListener('change', (e) => window.location.assign(e.target.value));
    });
  }
  $('head').append(`<script>(${navigateOnChange.toString()})()</script>`);

  return $.html();
}