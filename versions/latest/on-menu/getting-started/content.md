# %d%.getting_started_title

%d%.getting_started_intro

## %d%.requirements_title

%d%.requirements_content

## %d%.quickstart_title

%d%.quickstart_desc

### %d%.quickstart_create

```bash
bun create carats my-carats-app
cd my-carats-app
```

%d%.gs_create_generator_note

### %d%.quickstart_run

```bash
bun install
bun run dev
```

%d%.gs_dev_server_note

<!-- ### %d%.quickstart_clone

%d%.quickstart_clone_desc

```bash
npx degit ufukbakan/vite-jjsx-ssr my-carats-app
cd my-carats-app
``` -->

## %d%.manual_setup_title

%d%.manual_setup_desc

### %d%.folder_structure_title

%d%.folder_structure_desc

```
src/
├── app.ts
├── vite-env.d.ts
├── dto/
│   ├── user.d.ts
│   └── trade-data.d.ts
├── client/
│   ├── index.html
│   ├── entrypoint.ts
│   ├── facets.tsx
│   ├── base.sass
│   ├── components/
│   │   ├── SearchInput.tsx
│   │   └── search-bar.sass
│   └── pages/
│       ├── _layout/index.tsx
│       ├── _error/index.tsx
│       ├── _not_found/index.tsx
│       ├── home/index.tsx
│       ├── market/index.tsx
│       ├── profile/index.tsx
│       └── trade/index.tsx
└── server/
    ├── entrypoint.ts
    └── culets.ts
public/
vite.config.client.ts
vite.config.server.ts
vitest.config.ts
tsconfig.json
package.json
```

### %d%.install_deps_title

%d%.install_deps_desc

#### %d%.install_deps_runtime

```bash
bun add @carats/core @carats/render @carats/hooks @carats/csr
bun add @carats/ssr @carats/express @carats/ssg
bun add express compression sirv
```

#### %d%.install_deps_dev

```bash
bun add -d jjsx vite sass typescript
bun add -d @types/node @types/express @types/compression
bun add -d vitest @vitest/coverage-v8 @fetch-mock/vitest cross-env
```

%d%.gs_express5_note

## %d%.config_title

### %d%.tsconfig_title

%d%.tsconfig_desc

```json
{
  "compilerOptions": {
    "target": "es2022",
    "useDefineForClassFields": true,
    "module": "esnext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["jjsx"],
    "typeRoots": ["./src/dto", "./node_modules"],
    "skipLibCheck": true,
    "jsx": "react",
    "jsxFactory": "JJSX.jsxFactory",
    "jsxFragmentFactory": "JJSX.fragmentFactory",

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

%d%.gs_typeroots_note

### %d%.vite_client_title

%d%.vite_client_desc

```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  publicDir: path.resolve(import.meta.dirname, 'public'),
  root: path.resolve(import.meta.dirname, 'src/client'),
  base: '/',
  appType: 'custom',
  server: {
    middlewareMode: true
  },
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/client'),
    emptyOutDir: true,
    manifest: true,
    minify: true,
    rollupOptions: {
      treeshake: true
    }
  }
})
```

### %d%.vite_server_title

```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  publicDir: false,
  build: {
    ssr: path.resolve(__dirname, 'src/server/entrypoint.ts'),
    outDir: path.resolve(__dirname, 'dist/server'),
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      treeshake: true
    }
  }
})
```

### %d%.package_scripts_title

%d%.package_scripts_desc

```json
{
  "scripts": {
    "dev": "bun --inspect=6499 src/app.ts",
    "build": "bun build:server && bun build:client",
    "build:client": "vite build --config vite.config.client.ts",
    "build:server": "vite build --config vite.config.server.ts",
    "build:static": "cross-env NODE_ENV=production carats-ssg",
    "preview": "cross-env NODE_ENV=production bun src/app.ts",
    "test": "vitest --run --coverage"
  }
}
```

%d%.gs_app_entry_note

## %d%.run_title

%d%.run_desc

## %d%.structure_title

%d%.structure_desc

| %d%.path_col | %d%.description_col |
|---|---|
| `src/app.ts` | %d%.desc_app_entry_point |
| `src/vite-env.d.ts` | %d%.desc_vite_env |
| `src/client/index.html` | %d%.desc_client_template |
| `src/client/entrypoint.ts` | %d%.desc_client_entrypoint |
| `src/client/facets.tsx` | %d%.desc_route_definitions |
| `src/client/base.sass` | %d%.desc_base_sass |
| `src/client/pages/` | %d%.desc_pages |
| `src/client/components/` | %d%.desc_components |
| `src/server/entrypoint.ts` | %d%.desc_server_entrypoint |
| `src/server/culets.ts` | %d%.desc_server_functions |
| `src/dto/` | %d%.desc_dto |
| `public/` | %d%.desc_public |

## %d%.next_steps_title

%d%.next_steps_desc
