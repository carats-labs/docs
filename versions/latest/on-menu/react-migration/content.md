# %d%.react_migration_title

%d%.react_migration_intro

| %d%.concept_col | %d%.react_col | %d%.carats_col |
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

%d%.rm_events_intro

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

%d%.rm_state_desc

## %d%.rm_routing_heading

%d%.rm_routing_desc

## %d%.rm_data_heading

%d%.rm_data_desc

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

%d%.rm_head_desc

## %d%.rm_styling_heading

%d%.rm_styling_desc

## %d%.rm_summary_title

1. %d%.rm_step1
2. %d%.rm_step2
3. %d%.rm_step3
4. %d%.rm_step4
5. %d%.rm_step5
6. %d%.rm_step6
7. %d%.rm_step7
