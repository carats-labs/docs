# %d%.hooks_title

%d%.hooks_intro

## %d%.use_hook_title

%d%.use_hook_desc

### %d%.basic_usage_title

```typescript
import { use } from '@carats/hooks';

function MyComponent() {
    const counter = use(0);
    
    return (
        <div>
            <p>Count: {counter.get()}</p>
            <button onclick={() => counter.set(counter.get() + 1)}>
                Increment
            </button>
        </div>
    );
}
```

### %d%.state_interface_title

```typescript
type Getter<T> = () => T;
type Factory<T> = (currentValue: T) => T;
type Setter<T> = {
    (fn: Factory<T>): void;
    (value: T): void;
};
type Subscriber<T> = (value: T) => void;
type Subscribe<T> = (subsriber: Subscriber<T>) => () => void;
type State<T> = {
    get: Getter<T>;
    set: Setter<T>;
    subscribe: Subscribe<T>;
};
```

### %d%.subscribe_method_title

```typescript
function MyComponent() {
    const counter = use(0);
    
    // Subscribe to state changes
    counter.subscribe((value) => {
        console.log('Count changed to:', value);
    });
    
    return <div>Count: {counter.get()}</div>;
}
```

## %d%.hydrate_title

%d%.hydrate_desc

```tsx
import { hydrate } from '@carats/hooks';

function MyComponent() {
    hydrate(() => {
        const button = document.querySelector('.my-button');
        button?.addEventListener('click', () => {
            console.log('Button clicked!');
        });
        
        return () => {
            // Cleanup function
            button?.removeEventListener('click', () => {});
        };
    });
    
    return <button class="my-button">Click me</button>;
}
```

## %d%.onmount_title

%d%.onmount_desc

```tsx
import { onMount } from '@carats/hooks';

function MyComponent() {
    onMount(() => {
        console.log('Component mounted!');
        
        return () => {
            console.log('Cleanup on unmount');
        };
    });
    
    return <div>My Component</div>;
}
```

## %d%.clear_hydrations_title

%d%.clear_hydrations_desc

```typescript
import { clearHydrations } from '@carats/hooks';

// Clear all hydration callbacks
await clearHydrations();
```

## %d%.complete_example_title

```tsx
import { use, hydrate, onMount } from '@carats/hooks';
import './counter.sass';

interface CounterProps {
    initialValue?: number;
}

export default function Counter(props: CounterProps) {
    const count = use(props.initialValue ?? 0);
    
    onMount(() => {
        console.log('Counter mounted with initial value:', count.get());
    });
    
    const handleIncrement = () => {
        count.set(prev => prev + 1);
    };
    
    const handleDecrement = () => {
        count.set(prev => prev - 1);
    };
    
    hydrate(() => {
        const buttons = document.querySelectorAll('.counter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('hovered');
            });
        });
        
        return () => {
            buttons.forEach(btn => {
                btn.classList.remove('hovered');
            });
        };
    });
    
    return (
        <div class="counter">
            <h2>Counter: {count.get()}</h2>
            <button class="counter-btn" onclick={handleIncrement}>+</button>
            <button class="counter-btn" onclick={handleDecrement}>-</button>
        </div>
    );
}
```

## %d%.type_definitions_title

```typescript
type MaybePromise<T> = T | Promise<T>;
type ClearCallback = () => MaybePromise<void>;
type HydrationCallback = () => MaybePromise<ClearCallback | void>;

declare function hydrate(callback: HydrationCallback): void;
declare function onMount(callback: HydrationCallback): void;
declare function use<T>(): State<T>;
declare function use<T>(initialState: T): State<T>;
```
