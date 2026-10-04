---
name: instant-docs
description: Use this skill when preparing documentation
---

Instant-docs is a document generation framework which abstracts the complex processes. It renders every page from a folder structure, so the directory layout *is* the site.

Folder structure:
- static: public directory which can contain static files like images, videos and even javascript and css files. It is copied to the build output as-is.
- src: source directory that contains javascript files not related to documentation.
- src/plugins: directory that contains plugins for document generation. its crucial.
- src/plugins/backend: Every script in this directory is supposed to export a default function that receives an object with the following properties: html, meta, lang, dir. The function should return the modified html.
- src/plugins/frontend: Every script in this directory is directly executed in the browser context. They are bundled with esbuild into PLUGINS_PATH.
- versions: the main directory that contains the documentation files. its expected to have a subdirectory for each version.
- versions/{version}: each version directory contains the documentation files for that version. and each of them must contain template.html.
- versions/{version}/static: optional. A per-version static directory served from STATIC_PATH, which defaults to /static/%version%.
- template.html can refer to variables, see the list below.

Template variables:
- meta variables are prefixed with `meta_` and are filled from the page metadata: %meta_title%, %meta_description%, %meta_keywords%, %meta_image%, %meta_icon%.
- layout variables: %logo%, %nav%, %header%, %search%, %generated_table_of_contents%, %content%, %footer%.
- context variables: %lang%, %version%, %encoding%, %timestamp%, %static_path%, %home_link%, %version_options%, %dictionary%.
- %home_link% is the url of the home page of the current version and language. Prefer it over writing `/%lang%/%version%/` by hand, because it is built from LINK_FORMAT and therefore survives a change of link format. A page link is then `%home_link%/page-name`.
- if %search% is referenced in the template, there must be a search.html file in the same directory. The file is read from `versions/{version}/search.html` only, and it is not looked up per language.
- if %footer% is referenced in the template, there must be a footer.html file. `footer_{lang}.html` overrides it. A `.md` file is rendered through marked and wrapped in `<footer class="footer">`.
- if %logo% is referenced in the template, there must be a logo.html file. `logo_{lang}.html` overrides it. The file is inserted verbatim, not wrapped.
- logo.html, footer.html and header.html are looked up by walking *up* the directory tree from the page, so a single file at `versions/{version}/` serves every page and a per-page file overrides it.
- %header% comes from a `header.html` or `header_{lang}.html` file, with the same upward lookup. A `.md` file is wrapped in `<header class="header">`.
- %nav%, %header%, %generated_table_of_contents% and %content% don't have to own html files.
- %version_options% is a `<select>` built from the directories in `versions`, with the current version preselected. Pair it with the version-changer backend plugin.

Versions, dictionaries and placeholders:
- versions/{version} directory can contain a dictionary.json file that contains translations in the format Record<string, Record<string, string>> where the first key is the language code and the second key is the translation key, or you can seperate each language into a file named dictionary_{language_code}.json that contains Record<string, string> (key-value pairs).
- dictionary files are also looked up by walking up the directory tree, so `versions/{version}/dictionary.json` covers every page below it.
- a translated variable in the template or content can be referenced as {.env.DICTIONARY_VARIABLE}.{variable_name}
- if .env.DICTIONARY_VARIABLE is %d% and variable name is greet: %d%.greet is the correct placeholder for the translation
- CONTENT_LANGUAGES in .env decides which languages are generated. A language listed there but absent from the dictionary resolves every `%d%` key to an empty string, so keep the two in sync. Note that the language is taken from the request or DEFAULT_LANG, and a language is only reachable through the url if LINK_FORMAT contains %lang%.
- Basically template.html defines the layout and then we inject content by path (folder paths reflect the url path, without on-menu & off-menu prefixes)
- the url of a page is built from LINK_FORMAT, which supports %lang%, %version%, %slug% and %path%. Write links with %home_link% rather than by hand so a format change does not break them.

Content files:
- Content can be written in markdown or html language but the file name must be content.md or content.html respectively
- Content must be placed into the versions/{version}/off-menu or versions/{version}/on-menu directories
- off-menu pages are not included in the navigation menu
- on-menu pages are included in the navigation menu, ordered by the menuOrder of their metadata, and can be nested arbitrarily deep
- Typical home page content is placed at versions/{version}/off-menu/content.md (this page will be hosted at /{version} url)
- Typical document page content is placed at versions/{version}/on-menu/{page_name}/content.md (this page will be hosted at /{version}/{page_name} url and {page_name} will be visible on navigation menu)
- content.md or content.html files can contain dictionary variables like %d%.greet
- or you can completely replace the content for a language by creating a content_{language_code}.md or content_{language_code}.html file
- any file whose name starts with `content` is treated as the content of its directory, and getFilename strips the extension before matching, so content_es.md matches the language `es`.

Metadata:
- each content directory can contain meta.js or meta_{language_code}.js file
- meta javascript files must default export metadata function call result that receives an object with the following properties:
```ts
interface MetaArgs {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  icon?: string;
  lang?: string;
  generateTOC?: boolean;
  menuOrder?: number;
  replacePlaceholders?: boolean;
}
```
- the file must import `metadata` from `instant-docs/helpers/index.js`; anything else in the object is ignored.
- metadata files are resolved per language: `meta_{lang}.js` wins, `meta.js` is the fallback, and a directory with no metadata falls back to an empty default.
- menuOrder sorts the navigation menu, lowest first. It only affects on-menu pages.
- title is also the fallback used when a page has no metadata: the url segment is title-cased and dashes become spaces.
- keywords is an array and is joined with a comma when it is substituted into the template.
- replacePlaceholders controls whether `%content%` is replaced before or after the other variables. Leave it true unless the content itself contains text that looks like a placeholder.

Table of contents and headings:
- marked v12 and later do not emit heading ids, and `generateTableOfContents` only looks for `h{level}[id]`. The built-in table of contents is therefore silently empty unless ids are added first.
- a backend plugin can fix this: assign a slug id to every heading inside the content, then build the nested list and inject it wherever the template has a placeholder for it. The `table_of_contents` dictionary key supplies the heading of that list, and `%d%.expand` supplies the aria-label of the nav expander.
- set generateTOC to false in meta.js when a plugin owns the table of contents, otherwise two of them can be rendered.
- DEFAULT_CONTENT_HEADING_LEVEL (2 by default) is the heading level the table of contents starts from. Style content accordingly: one `#` title per page, then `##` sections.

Search:
- the full text search index is built by fetching each page and reading the text of `.content`, so the content **must** be wrapped in `<div class="content">` in the template. Without that wrapper the index contains nothing but page titles.
- the index is written to `{BUILD_DIR}/{version}/search_index.json` and served from the same path, and `ALLOW_SEARCH_IN_OFF_MENU` decides whether off-menu pages are included.
- the client fetches the index through `window.getLink({ slug: '/search_index.json' })`, which the globals backend plugin injects, so a backend plugin that injects `window.getLink` is a prerequisite for search.

Layout requirements worth keeping:
- keep the search form, the table of contents and the content as siblings, and put only the page body inside `.content`, so the search snippets do not repeat the table of contents.
- an empty placeholder element collapses with a `:empty` rule, which is how a page with no headings avoids a gap.
