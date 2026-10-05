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

%d%.folder_name_convention_note

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

%d%.trade_btc_note

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

%d%.mount_clientrender_note

%d%.plain_links_note

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

%d%.query_params_note

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

%d%.wrap_in_layout_note
