# %d%.hooks_title

%d%.hooks_intro

> %d%.hooks_no_react_note

## %d%.use_hook_title

%d%.use_hook_desc

### %d%.basic_usage_title

```tsx
import { use } from '@carats/hooks';

export default function Counter(props: { start?: number }) {
    const count = use(props.start ?? 0);

    // get() is a plain read, safe on the server and in the browser
    return <p class="counter">{count.get()}</p>;
}
```

%d%.use_manual_dom_note

```tsx
import { use, afterMount } from '@carats/hooks';

export default function Counter() {
    const count = use(0);

    afterMount(() => {
        const inc = document.getElementById('inc');
        const dec = document.getElementById('dec');
        const label = document.getElementById('count');

        const unsub = count.subscribe((value) => {
            if (label) label.textContent = String(value);
        });

        const increment = () => count.set((n) => n + 1);
        const decrement = () => count.set((n) => n - 1);

        inc?.addEventListener('click', increment);
        dec?.addEventListener('click', decrement);

        return () => {
            unsub();
            inc?.removeEventListener('click', increment);
            dec?.removeEventListener('click', decrement);
        };
    });

    return (
        <div class="counter">
            <p id="count">{count.get()}</p>
            <button id="inc">+</button>
            <button id="dec">-</button>
        </div>
    );
}
```

### %d%.state_interface_title

%d%.use_interface

```typescript
type Getter<T> = () => T;
type Factory<T> = (currentValue: T) => T;
type Setter<T> = {
    (fn: Factory<T>): T;
    (value: T): T;
};
type Subscriber<T> = (value: T) => void;
type Subscribe<T> = (subscriber: Subscriber<T>) => () => void;
type State<T> = {
    get: Getter<T>;
    set: Setter<T>;
    subscribe: Subscribe<T>;
};
declare function use<T>(): State<T>;
declare function use<T>(initialState: T): State<T>;
```

%d%.set_returns_note

`use` is also callable outside a component, which is the idiomatic way to share a single piece of state between pages.

### %d%.subscribe_method_title

```tsx
import { use } from '@carats/hooks';

const state = use(0);

// Returns the unsubscribe function
const unsub = state.subscribe((value) => {
    console.log('Count changed to:', value);
});
```

%d%.subscribe_note

%d%.subscribe_owns_dom_note

```tsx
// Wrong: two places write to the DOM, so they can disagree
const onClick = () => {
    count.set((n) => n + 1);
    if (label) label.textContent = String(count.get());
};

// Right: the handler only changes state, the subscriber only writes the DOM
const unsub =  count.subscribe((value) => {
    if (label) label.textContent = String(value);
});
const onClick = () => count.set((n) => n + 1);
```

## %d%.aftermount_title

%d%.aftermount_desc

```tsx
import { afterMount } from '@carats/hooks';

export default function MyComponent() {
    afterMount(() => {
        const button = document.getElementById('my-button');
        const onClick = () => console.log('Button clicked!');
        button?.addEventListener('click', onClick);

        return () => button?.removeEventListener('click', onClick);
    });

    return <button id="my-button">Click me</button>;
}
```

Keep a reference to the exact handler you registered. Passing a fresh arrow function to `removeEventListener` creates a new function identity, so the listener is never actually removed.

## %d%.beforemount_title

%d%.beforemount_desc

```tsx
import { beforeMount } from '@carats/hooks';

export default function MyComponent() {
    beforeMount(() => {
        const timer = setInterval(() => console.log('tick'), 1000);
        return () => clearInterval(timer);
    });

    return <div>My Component</div>;
}
```

%d%.choosing_mount_hook_note

## %d%.clear_hydrations_title

%d%.clear_hydrations_desc

```typescript
import { clearHydrations } from '@carats/hooks';

// Runs every registered clear callback and empties the registry
await clearHydrations();
```

## %d%.complete_example_title

```tsx
import { use, beforeMount, afterMount } from '@carats/hooks';
import './counter.sass';

interface CounterProps {
    initialValue?: number;
}

export default function Counter(props: CounterProps) {
    const count = use(props.initialValue ?? 0);

    // beforeMount runs immediately and does not need this component's markup
    beforeMount(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') count.set((n) => n + 1);
            if (e.key === 'ArrowDown') count.set((n) => n - 1);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    });

    afterMount(() => {
        const label = document.getElementById('count');
        const inc = document.getElementById('inc');
        const dec = document.getElementById('dec');

        const unsub = count.subscribe((value) => {
            if (label) label.textContent = String(value);
        });

        const increment = () => count.set((n) => n + 1);
        const decrement = () => count.set((n) => n - 1);

        inc?.addEventListener('click', increment);
        dec?.addEventListener('click', decrement);

        return () => {
            unsub();
            inc?.removeEventListener('click', increment);
            dec?.removeEventListener('click', decrement);
        };
    });

    return (
        <div class="counter">
            <h2>Counter: <span id="count">{count.get()}</span></h2>
            <button id="inc" type="button">+</button>
            <button id="dec" type="button">-</button>
        </div>
    );
}
```

## %d%.type_definitions_title

```typescript
type MaybePromise<T> = T | Promise<T>;
type ClearCallback = () => MaybePromise<void>;
type HydrationCallback = () => MaybePromise<ClearCallback | void>;

declare function afterMount(callback: HydrationCallback): void;
declare function beforeMount(callback: HydrationCallback): void;
declare function clearHydrations(): Promise<void>;
declare function use<T>(): State<T>;
declare function use<T>(initialState: T): State<T>;
```