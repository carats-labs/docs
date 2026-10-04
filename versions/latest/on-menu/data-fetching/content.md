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

A thrown error, whether from the culet or from the component, reaches the `error` suspense component as an `Error`. An unmatched URL reaches `notFound` instead.

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

Because `cookies` and `headers` are available, a culet can personalise a page per visitor without any extra plumbing. The response is still cached per route, so do not put per-visident data in a culet that is not marked `recast` on the consuming component.

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

There is no implicit matching by file name or by component name. A typo in the route string fails silently: the page renders, the props are `undefined`, and the error surfaces as a crash inside the component. Registering the culet route as a named constant and importing it into both places removes the failure mode.

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

`recast` belongs on the component, not on the culet, so a single live page does not force every consumer of that route to refetch.

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

The client global is typed, so `window.carats` needs no cast. `ssp.for` is the route the payload belongs to, which lets a shared component verify that the data it is about to read was resolved for the page it is rendered on, and skip it when it was not.
