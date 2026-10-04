# %d%.server_side_title

%d%.server_side_intro

## %d%.server_entrypoint_title

%d%.server_entrypoint_desc

```typescript
import { defineServerEntry } from '@carats/ssr';
import facets from '../client/facets.cara';

export default defineServerEntry(facets);
```

### %d%.server_entry_methods_title

The object returned by `defineServerEntry` is what the server plugin drives:

- `render(req)` resolves the facet for the requested URL, runs the page component and returns the rendered `html` together with the collected `head` tags.
- `getServerProps(req)` resolves the culet for the requested URL and returns its value, or `undefined` when the route has no culet.
- `facets` is the shared facets object, and `culets` is the registry built by `culet` and `seat`.

This is why the default export must be the entry itself: the Express plugin calls these functions for every request.

## %d%.culets_server_title

%d%.culets_server_desc

```typescript
import { culet } from '@carats/ssr';

culet<User>('/profile', (req) => {
    return {
        id: '1',
        name: 'Alexander Whitmore',
        username: 'awhitmore',
        email: 'a.whitmore@vault.io',
        phone: '+1 (212) 555-0193',
        website: 'whitmore.capital',
    };
});
```

The generic parameter is optional but worth keeping: it is what makes the return value match the props of the page that consumes it.

## %d%.culet_seat_title

%d%.culet_seat_desc

```typescript
import { culet, seat } from '@carats/ssr';
import getTradeData from './culets/trade';

seat(getTradeData);
```

A culet declared inline in the entrypoint registers itself, so it needs no `seat` call. A culet imported from `src/server/culets` was created by `culet()` in its own module and must be seated once. Do not wrap a seated culet in another `culet()` call, because that would register the same handler under a second route.

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
        name: 'Alexander Whitmore',
        username: 'awhitmore',
        email: 'a.whitmore@vault.io',
        phone: '+1 (212) 555-0193',
        website: 'whitmore.capital',
    };
});

export default defineServerEntry(facets);
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

export default server;
```

Order the middleware so that `carats()` runs after the routes and static handlers it should not swallow. The plugin returns an Express `Router`, which is why it is mounted with `app.use` rather than registered as a route.

## %d%.server_vite_config_title

%d%.server_vite_config_desc

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
// src/server/culets/trade.ts
import { culet } from '@carats/ssr';

export default culet<TradeData>('/trade/:symbol', async (req) => {
    const symbol = req.params.symbol;
    if (!symbol) {
        throw new Error('Symbol is required');
    }
    return {
        symbol: symbol.toUpperCase(),
        price: '$67,234.18',
        change24h: '+2.34%',
        volume: '$28.4B',
        high24h: '$68,102.50',
        low24h: '$65,890.00',
        orderBook: { bids: [], asks: [] },
    };
});
```

```typescript
// src/server/entrypoint.ts
import { culet, defineServerEntry, seat } from '@carats/ssr';
import facets from '../client/facets.cara';
import getTradeData from './culets/trade';

seat(getTradeData);

culet<User>('/profile', () => {
    return {
        id: '1',
        name: 'Alexander Whitmore',
        username: 'awhitmore',
        email: 'a.whitmore@vault.io',
        phone: '+1 (212) 555-0193',
        website: 'whitmore.capital',
    };
});

export default defineServerEntry(facets);
```

Note that the facet route and the culet route are identical strings, including the `:symbol` parameter. A mismatch is the most common reason a burnished page renders without data.

## %d%.type_definitions_title

```typescript
import { CaratsRequest } from '@carats/core';
import { Facets } from '@carats/render';

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

declare const seat: <T extends Culet>(f: T) => T;
declare function culet<T = any>(route: string, culet: Culet<T>): Culet<T>;
declare function defineServerEntry(facets: Facets): CaratsServerEntry;
```
