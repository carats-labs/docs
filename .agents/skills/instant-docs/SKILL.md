---
name: instant-docs
description: Use this skill when preparing documentation
---

Instant-docs is a document generation framework which abstracts the complex processes.
Folder structure:
- static: public directory which can contain static files like images, videos and even javascript and css files.
- src: source directory that contains javascript files not related to documentation.
- src/plugins: directory that contains plugins for document generation. its crucial.
- src/plugins/backend: Every script in this directory is supposed to export a default function that receives an object with the following properties: html, meta, lang, dir. The function should return the modified html.
- src/plugins/frontend: Every script in this directory is directly executed in the browser context.
- versions: the main directory that contains the documentation files. its expected to have a subdirectory for each version.
- versions/{version}: each version directory contains the documentation files for that version. and each of them must contain template.html.
- template.html can refer to variables like %meta_title%, %meta_description%, %meta_keywords%, %logo%, %nav%, %header%, %search%, %generated_table_of_contents%, %content%, %footer%, %encoding%, %lang%, %version%
- if %search% is referenced in the template, there must be a search.html file in the same directory
- if %footer% is referenced in the template, there must be a footer.html file in the same directory
- if %logo% is referenced in the template, there must be a logo.html file in the same directory
- other variables (%nav%, %header%, %generated_table_of_contents%, %content%) don't have to own html files.
- versions/{version} file can contain a dictionary.json file that contains translations in the format Record<string, Record<string, string>> where the first key is the language code and the second key is the translation key or you can seperate each language into a file named dictionary_{language_code}.json that contains Record<string, string> (key-value pairs)
- a translated variable in the template or content can be referenced as {.env.DICTIONARY_VARIABLE}.{variable_name}
- if .env.DICTIONARY_VARIABLE is %d% and variable name is greet: %d%.greet is the correct placeholder for the translation
- Basically template.html defines the layout and then we inject content by path (folder paths reflect the url path, without on-menu & off-menu prefixes)
- Content can be written in markdown or html language but the file name must be content.md or content.html respectively
- Content must be placed into the versions/{version}/off-menu or versions/{version}/on-menu directories
- off-menu pages are not included in the navigation menu
- on-menu pages are included in the navigation menu
- Typical home page content is placed at versions/{version}/off-menu/content.md (this page will be hosted at /{version} url)
- Typical document page content is placed at versions/{version}/on-menu/{page_name}/content.md (this page will be hosted at /{version}/{page_name} url and {page_name} will be visible on navigation menu)
- content.md or content.html files can contain dictionary variables like %d%.greet
- or you can completely replace the content for a language by creating a content_{language_code}.md or content_{language_code}.html file
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