# %d%.react_migration_title

%d%.react_migration_intro

| Concept | %d%.react_col | %d%.carats_col |
|---|---|---|
| %d%.rm_row_runtime_title | %d%.rm_row_runtime_react | %d%.rm_row_runtime_carats |
| %d%.rm_row_state_title | %d%.rm_row_state_react | %d%.rm_row_state_carats |
| %d%.rm_row_effect_title | %d%.rm_row_effect_react | %d%.rm_row_effect_carats |
| %d%.rm_row_events_title | %d%.rm_row_events_react | %d%.rm_row_events_carats |
| %d%.rm_row_routing_title | %d%.rm_row_routing_react | %d%.rm_row_routing_carats |
| %d%.rm_row_data_title | %d%.rm_row_data_react | %d%.rm_row_data_carats |
| %d%.rm_row_head_title | %d%.rm_row_head_react | %d%.rm_row_head_carats |
| %d%.rm_row_meta_title | %d%.rm_row_meta_react | %d%.rm_row_meta_carats |
| %d%.rm_row_styling_title | %d%.rm_row_styling_react | %d%.rm_row_styling_carats |
| %d%.rm_row_types_title | %d%.rm_row_types_react | %d%.rm_row_types_carats |

## %d%.rm_events_heading

The event model is the change that breaks a port most often, so it is worth being precise about it.

```tsx
// React
<button onClick={() => setOpen(!open)}>Toggle</button>
<input value={query} onChange={(e) => setQuery(e.target.value)} />
```

```tsx
// Carats
import { use, afterMount } from '@carats/hooks';

export default function Toggle() {
    const open = use(false);

    afterMount(() => {
        const button = document.getElementById('toggle');

        const stop = open.subscribe((value) => {
            button?.setAttribute('aria-expanded', String(value));
        });

        const onClick = () => open.set(!open.get());
        button?.addEventListener('click', onClick);

        return () => {
            stop();
            button?.removeEventListener('click', onClick);
        };
    });

    return <button id="toggle" aria-expanded="false">Toggle</button>;
}
```

## %d%.rm_state_heading

`useState` becomes `use`, and every render that React would have handled becomes an explicit DOM write. State that was local to a component is unchanged in spirit: call `use` at the top level of the component, read it with `get`, and write with `set`.

## %d%.rm_routing_heading

The file-system router collapses into a single object. Every route becomes an entry in `defineFacets`, and nested layouts become an explicit import. Because the facets object is shared, a route that is missing from it is missing from both the client and the server, which removes a whole class of bug.

## %d%.rm_data_heading

`getServerSideProps` becomes a culet, and the page becomes burnished. The function signature is the same shape: the request in, the data out.

```typescript
// React / Next.js
export async function getServerSideProps({ params }) {
    return { props: { symbol: params.symbol } };
}
```

```typescript
// Carats
export default culet<TradeData>('/trade/:symbol', async (req) => {
    return { symbol: req.params.symbol.toUpperCase() };
});
```

```tsx
// Carats page
export default Burnish<TradeData>(function (data) {
    return <h1>{data.symbol}</h1>;
});
```

## %d%.rm_head_heading

A metadata export becomes `this.head`, and the component has to be a `function` declaration for `this` to exist. A component that is already an arrow function can stay one, at the cost of not contributing head tags.

## %d%.rm_styling_heading

CSS-in-JS has no equivalent. Each component imports a SASS file, that file imports `base.sass` for the design tokens, and the tokens live at the top level of that one global stylesheet.

## %d%.rm_summary_title

1. %d%.rm_step1
2. %d%.rm_step2
3. %d%.rm_step3
4. %d%.rm_step4
5. %d%.rm_step5
6. %d%.rm_step6
7. %d%.rm_step7
