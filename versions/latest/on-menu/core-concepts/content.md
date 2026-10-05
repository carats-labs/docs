# %d%.core_concepts_title

%d%.core_concepts_intro

## %d%.jjsx_heading

%d%.jjsx_desc

### %d%.jjsx_features

- %d%.jjsx_feature1
- %d%.jjsx_feature2
- %d%.jjsx_feature3

%d%.jjsx_compiles_note

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

%d%.facets_data_note

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

%d%.culet_dynamic_params_note

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

%d%.unburnished_page_note

## %d%.rendering_heading

%d%.rendering_desc

%d%.rendering_twice_note

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

%d%.goto_no_reload_note
