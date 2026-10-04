# %d%.core_concepts_title

%d%.core_concepts_intro

## %d%.jjsx_heading

%d%.jjsx_desc

### %d%.jjsx_features

- **%d%.jjsx_feature1**: Write pure HTML & JavaScript in `.tsx` files
- **%d%.jjsx_feature2**: No React dependencies
- **%d%.jjsx_feature3**: Automatic server and client-side rendering

JJSX compiles to a function call, so a component is an ordinary function that returns an HTML string. There is no virtual DOM to diff and no component instance to keep alive, which is why the same function is safe to run on the server and again in the browser.

```tsx
export default function Greeting(props: { name: string }) {
    return <p>Hello {props.name}</p>
}
```

## %d%.facets_heading

%d%.facets_desc

### %d%.defining_facets

```tsx
import { defineFacets } from '@carats/render';
import ErrorPage from './pages/_error';
import NotFound from './pages/_not_found';
import Home from './pages/home';
import Profile from './pages/profile';

export default defineFacets({
    routes: {
        '/': Home,
        '/profile': Profile
    },
    suspense: {
        error: ErrorPage,
        notFound: NotFound
    },
    inAppRouting: true
});
```

> %d%.facets_partial_note

A facet is also the unit of data fetching. A route in `routes` is the route a culet must be registered under, and a page that is wrapped with `Burnish` receives the value that culet returned.

## %d%.culets_heading

%d%.culets_desc

### %d%.defining_culet

```typescript
// src/server/culets/profile.ts
import { culet } from '@carats/ssr';

export default culet<User>('/profile', (req) => {
    return {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com'
    };
});
```

With a dynamic route, the parameter is read from `req.params`:

```typescript
// src/server/culets/trade.ts
import { culet } from '@carats/ssr';

export default culet<TradeData>('/trade/:symbol', async (req) => {
    const symbol = req.params.symbol.toUpperCase();
    const quote = await fetchQuote(symbol);
    return { symbol, price: quote.price };
});
```

### %d%.seating_culets

%d%.seating_culets_desc

```typescript
// src/server/entrypoint.ts
import { defineServerEntry, seat } from '@carats/ssr';
import facets from '../client/facets.cara';
import getTradeData from './culets/trade';

seat(getTradeData);

export default defineServerEntry(facets);
```

## %d%.server_props_heading

%d%.server_props_desc

%d%.server_props_auto_text

```tsx
import { Burnish } from '@carats/render';
import Layout from '../_layout';

export default Burnish<TradeData>(function (data) {
    this.head = <title>Trade {data.symbol}</title>;
    return (
        <Layout>
            <h1>{data.symbol}</h1>
        </Layout>
    );
});
```

A page that is not burnished simply receives no props, which is the normal case for a static page.

## %d%.rendering_heading

%d%.rendering_desc

The practical consequence is that statements in a component body run twice in a normal page load: once on the server, once in the browser. Anything that touches `document`, reads `window` or performs a side effect has to be deferred to a hook, otherwise server-side rendering will throw.

## %d%.client_runtime_heading

%d%.client_runtime_desc

```tsx
import { goTo } from '@carats/csr';
import { afterMount } from '@carats/hooks';
import './search-bar.sass';

export default function SearchInput() {
    afterMount(() => {
        const form = document.getElementById('search-bar');
        const submit = (e: Event) => {
            e.preventDefault();
            const q = (document.getElementById('search-input') as HTMLInputElement).value;
            goTo(`/search?q=${q}`);
        };
        form?.addEventListener('submit', submit);
        return () => form?.removeEventListener('submit', submit);
    });

    return (
        <form id="search-bar">
            <input id="search-input" name="q" type="text" />
        </form>
    );
}
```

`goTo` navigates the same way an intercepted link click does, so no document reload happens when in-app routing is enabled.
