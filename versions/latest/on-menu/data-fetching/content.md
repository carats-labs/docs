# %d%.data_fetching_title

%d%.data_fetching_intro

## %d%.culet_lifecycle_heading

%d%.culet_lifecycle_desc

```typescript
// src/server/culets/trade.ts
import { culet } from '@carats/ssr';

export default culet<TradeData>('/trade/:symbol', async (req) => {
    const symbol = req.params.symbol;
    if (!symbol) {
        throw new Error('Symbol is required');
    }
    const res = await fetch(`https://api.example.com/quote/${symbol}`);
    if (!res.ok) {
        throw new Error(`Upstream quote failed with ${res.status}`);
    }
    return res.json();
});
```

%d%.thrown_error_note

## %d%.culet_args_heading

%d%.culet_args_desc

```typescript
import { culet } from '@carats/ssr';

culet<Dashboard>('/dashboard', (req) => {
    return {
        // Route parameters
        // req.params
        // Query string: req.query
        // Cookies: req.cookies
        // Headers: req.headers
        // req.url, req.method
        theme: req.cookies.theme ?? 'dark',
        tab: req.query.tab ?? 'overview',
    };
});
```

%d%.per_visitor_note

## %d%.async_heading

%d%.async_desc

```typescript
culet<TradeData>('/trade/:symbol', async (req) => {
    const [quote, book] = await Promise.all([
        fetchQuote(req.params.symbol),
        fetchOrderBook(req.params.symbol)
    ]);
    return { ...quote, orderBook: book };
});
```

## %d%.culet_matching_heading

%d%.culet_matching_desc

```typescript
// The facet route
'/trade/:symbol'

// The culet route — must be identical, including the parameter name
culet<TradeData>('/trade/:symbol', handler)
```

%d%.no_implicit_match_note

## %d%.caching_heading

%d%.caching_desc

### %d%.recast_heading

%d%.recast_desc

```tsx
import { Burnish } from '@carats/render';

// Cached: reuses the most recent server props for the route
export default Burnish<TradeData>(function (data) {
    return <h1>{data.symbol} {data.price}</h1>;
});
```

```tsx
import { Burnish } from '@carats/render';

// Not cached: refetches on every render
export default Burnish<TradeData>(function (data) {
    return <h1>{data.symbol} {data.price}</h1>;
}, { recast: true });
```

%d%.recast_on_component_note

## %d%.ssp_global_heading

%d%.ssp_global_desc

```tsx
import { afterMount } from '@carats/hooks';

export default function LiveBadge() {
    afterMount(() => {
        // Read the props the server already resolved for this route
        const ssp = window.carats.ssp;
        const el = document.getElementById('live-badge');
        if (!el || !ssp) return;
        el.textContent = `${ssp.for}: ${JSON.stringify(ssp.data)}`;
    });

    return <span id="live-badge"></span>;
}
```

%d%.ssp_typed_note
