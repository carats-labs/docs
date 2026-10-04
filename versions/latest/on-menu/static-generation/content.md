# %d%.static_generation_title

%d%.static_generation_intro

## %d%.static_generation_script_title

%d%.static_generation_desc

```json
{
  "scripts": {
    "build:static": "cross-env NODE_ENV=production carats-ssg"
  }
}
```

The `carats-ssg` binary comes from the `@carats/ssg` package, which is why it is a runtime dependency rather than a dev dependency: the prerendered output is a deployment artifact.

## %d%.static_generation_notes_title

%d%.static_generation_note1

- %d%.static_generation_note2
- %d%.static_generation_note3

%d%.static_generation_cli_note

A culet may read cookies, headers or the query string. Any route backed by such a culet cannot be meaningfully prerendered, because the output would be frozen with one visitor's data. Keep those routes on the SSR build, or mark the consuming component with `{ recast: true }` and accept that the static output holds placeholder data.
