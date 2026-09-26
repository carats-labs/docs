# %d%.server_side_title

%d%.server_side_intro

## %d%.server_entrypoint_title

%d%.entrypoint_desc

```typescript
import { defineServerEntry } from '@carats/ssr';
import facets from '../client/facets.cara';

export default defineServerEntry(facets);
```

## %d%.culets_server_title

%d%.culets_server_desc

```typescript
import { culet } from '@carats/ssr';

culet<User>('/profile', (request) => {
    return {
        id: request.params.id,
        name: 'Alexander Whitmore',
        username: 'awhitmore',
        email: 'a.whitmore@vault.io',
        phone: '+1 (212) 555-0193',
        website: 'whitmore.capital',
    };
});
```

## %d%.culet_seat_title

%d%.culet_seat_desc

```typescript
import { culet, seat } from '@carats/ssr';
import getTradeData from './culets/trade';

seat(getTradeData);

culet<TradeData>('/trade', (request) => {
    return getTradeData(request);
});
```

## %d%.express_integration_title

%d%.express_integration_desc

### %d%.server_entrypoint_subtitle

```typescript
import { culet, defineServerEntry, seat } from '@carats/ssr';
import facets from '../client/facets.cara';
import getTradeData from './culets/trade';

seat(getTradeData);

culet<User>('/profile', () => {
    return {
        id: '1',
        name: 'Alexander whitmore',
        username: 'awhitmore',
        email: 'a.whitmore@vault.io',
    };
});

export default defineServerEntry(facets)
```

### %d%.express_app_subtitle

```typescript
import { carats } from '@carats/express'
import express from 'express'

const app = express()
const port = process.env.PORT || 5173

app.use(carats())

const server = app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

export default server
```

## %d%.server_vite_config_title

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

## %d%.full_server_example_title

```typescript
import { culet, defineServerEntry, seat } from '@carats/ssr';
import facets from '../client/facets.cara';
import getTradeData from './culets/trade';

seat(getTradeData)

culet<User>('/profile', () => {
  return {
    id: '1',
    name: 'Alexander whitmore',
    username: 'awhitmore',
    email: 'a.whitmore@vault.io',
    phone: '+1 (212) 555-0193',
    website: 'whitmore.capital',
  };
});

culet<TradeData>('/trade', (req) => {
    return getTradeData(req);
});

export default defineServerEntry(facets)
```

## %d%.type_definitions_title

```typescript
interface CaratsServerEntry {
    render: (req: CaratsRequest<never>) => Promise<{
        html?: string;
        head?: string;
    }>;
    getServerProps: <T = any>(req: CaratsRequest<never>) => Promise<T> | T;
    facets: Facets;
    culets: Record<string, Culet>;
}

type CuletArgs = Omit<CaratsRequest, 'data'> & {
    params: Record<string, string>;
};

type Culet<T = any> = (request: CuletArgs) => T;
```
