# %d%.routing_title

%d%.routing_intro

## %d%.routes_heading

%d%.routes_desc

```typescript
// src/client/facets.cara.ts
import { defineFacets } from '@carats/render';
import ErrorPage from './pages/_error';
import NotFound from './pages/_not_found';
import Home from './pages/home';
import Market from './pages/market';
import Profile from './pages/profile';
import Trade from './pages/trade';

export default defineFacets({
    routes: {
        '/': Home,
        '/profile': Profile,
        '/market': Market,
        '/trade/:symbol': Trade
    },
    suspense: {
        error: ErrorPage,
        notFound: NotFound
    },
    inAppRouting: true
});
```

A page folder name is a convention, not a requirement. The folder keeps related files together, but the route a folder serves is whatever string it is mapped to, so `/market` can live in a folder called `browse` if that reads better.

## %d%.dynamic_params_heading

%d%.dynamic_params_desc

```tsx
// src/client/pages/trade/index.tsx
import { Burnish } from '@carats/render';
import Layout from '../_layout';
import './trade.sass';

export default Burnish<TradeData>(function (data) {
    this.head = <title>Trade {data.symbol}</title>;
    return (
        <Layout>
            <h1>{data.symbol}</h1>
        </Layout>
    );
});
```

`/trade/btc` renders this page with `data.symbol` resolved from the culet registered for the same route, and the page renders a different `<title>` for every symbol. The framework does the matching in `getPageComponent`, which returns the component, the extracted `params` and the matched `route`.

> %d%.route_matching_note

## %d%.in_app_routing_title

%d%.in_app_routing_desc

```typescript
// src/client/entrypoint.ts
import { mount, clientRender } from '@carats/csr';
import facets from './facets.cara';

mount(facets);
clientRender();
```

Both lines are required when in-app routing is on. `mount` registers the facets in the browser, and `clientRender` starts intercepting navigation.

Links need no framework component. A plain anchor is intercepted automatically, and a normal link is followed normally if the interception is disabled, which means pages stay crawlable and work without JavaScript.

## %d%.goto_title

%d%.goto_desc

```tsx
import { goTo } from '@carats/csr';
import { afterMount } from '@carats/hooks';
import './search-bar.sass';

export default function SearchInput() {
    afterMount(() => {
        const form = document.getElementById('search-bar');
        const submit = (e: Event) => {
            e.preventDefault();
            const input = document.getElementById('search-input') as HTMLInputElement;
            goTo(`/search?q=${input.value}`);
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

Build the query string with the standard `URLSearchParams`, which handles the encoding for you. To read the parameters of the current route from a component, ask a culet for them: a culet receives the matched parameters in `req.params`, and the page receives whatever the culet returned.

## %d%.routing_suspense_title

%d%.routing_suspense_desc

```tsx
// src/client/pages/_not_found/index.tsx
import Layout from '../_layout';
import './notfound.sass';

export default function NotFound() {
    return (
        <Layout>
            <section class="notfound-page container">
                <div class="notfound-code">404</div>
                <h1>Page not found</h1>
                <a href="/" class="btn btn-primary">Return to Dashboard</a>
            </section>
        </Layout>
    );
}
```

```tsx
// src/client/pages/_error/index.tsx
import Layout from '../_layout';
import './error.sass';

export default function ErrorPage(error: Error) {
    return (
        <Layout>
            <section class="error-page container">
                <h1>Something went wrong</h1>
                <p class="error-message">{error.message}</p>
                <a href="/" class="btn btn-primary">Return to Dashboard</a>
            </section>
        </Layout>
    );
}
```

Wrap both in the shared layout. A failing page that renders without the site chrome is much harder to diagnose than one that keeps the header and navigation.
