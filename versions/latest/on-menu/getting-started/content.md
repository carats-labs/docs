# %d%.installation_title

%d%.intro_paragraph

## %d%.installation_requirements

**%d%.installation_requirements_content**

## %d%.installation_steps

### %d%.installation_step1

```bash
mkdir my-carats-app
cd my-carats-app
```

### %d%.installation_step2

```bash
bun init -y
```

### %d%.installation_step3

```bash
bun add @carats/core @carats/render @carats/hooks @carats/ssr @carats/csr @carats/url
bun add -d jjsx vite sass typescript @types/node
```

### %d%.installation_step4

%d%.folder_structure_text

```
src/
├── app.ts
├── client/
│   ├── entrypoint.ts
│   ├── facets.cara.ts
│   ├── index.html
│   ├── vite-env.d.ts
│   └── base.sass
└── server/
    ├── entrypoint.ts
    └── culets/
```

## %d%.installation_config_title

### %d%.installation_tsconfig_title

%d%.tsconfig_desc

```json
{
  "compilerOptions": {
    "target": "es2022",
    "useDefineForClassFields": true,
    "module": "esnext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["jjsx"],
    "skipLibCheck": true,
    "jsx": "react",
    "jsxFactory": "JJSX.jsxFactory",
    "jsxFragmentFactory": "JJSX.fragmentFactory",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

### %d%.installation_package_title

%d%.package_desc

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

## %d%.installation_structure_title

%d%.structure_desc

| %d%.path_col                        | %d%.description_col                    |
|-----------------------------|--------------------------------|
| `src/app.ts`                | %d%.desc_app_entry_point   |
| `src/client/index.html`     | %d%.desc_client_template           |
| `src/client/entrypoint.ts`  | %d%.desc_client_entrypoint |
| `src/client/facets.cara.ts` | %d%.desc_route_definitions              |
| `src/server/entrypoint.ts`  | %d%.desc_server_entrypoint      |
| `src/server/culets/`        | %d%.desc_server_functions     |
