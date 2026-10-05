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

%d%.entry_drives_note

- %d%.entry_render_item
- %d%.entry_props_item
- %d%.entry_facets_item

%d%.entry_default_export_note

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

%d%.generic_param_note

## %d%.culet_seat_title

%d%.culet_seat_desc

```typescript
import { culet, seat } from '@carats/ssr';
import getTradeData from './culets/trade';

seat(getTradeData);
```

%d%.inline_culet_note

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

%d%.middleware_order_note

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

%d%.route_match_warning

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
