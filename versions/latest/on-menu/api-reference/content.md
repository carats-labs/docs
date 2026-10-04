# %d%.api_reference_title

%d%.api_reference_intro

## %d%.api_core_title

```typescript
interface CaratsRequest<T = any> {
    url: string;
    headers: Record<string, string>;
    cookies: Record<string, string>;
    method: string;
    data: T;
}
declare function findClosest(fileName: string): string | undefined;
```

## %d%.api_render_title

```typescript
interface CaratsComponent<T = any> extends JSX.FunctionComponent<T> {
    defaultProps?: T;
    head?: JSX.Element;
    burnished?: boolean;
    recast?: boolean;
}
type CaratsComponentWithThis<T = any> =
    ((this: CaratsComponent<T>, props: T) => JSX.Element) & CaratsComponent<T>;
interface Facets {
    inAppRouting?: boolean;
    routes: Record<string, CaratsComponent>;
    suspense: {
        loading: () => JSX.Element;
        error: (error: Error) => JSX.Element;
        notFound: () => JSX.Element;
    };
}
interface PartialFacets {
    inAppRouting?: boolean;
    routes?: Record<string, CaratsComponent>;
    suspense?: Partial<Facets['suspense']>;
}
interface PageComponentResult {
    component: CaratsComponent<any>;
    params: Record<string, string>;
    route: string;
}
interface BurnishOptions {
    recast?: boolean;
}
declare function defineFacets(facets: PartialFacets): Facets;
declare function getPageComponent(this: Facets, url: string): PageComponentResult;
declare function Burnish<T = any>(component: CaratsComponentWithThis<T>, options?: BurnishOptions): CaratsComponentWithThis<T>;
declare function Burnish<T = any>(component: CaratsComponent<T>, options?: BurnishOptions): CaratsComponent<T>;
```

`defineFacets` takes a `PartialFacets` and returns a fully populated `Facets`, which is why every key of the input is optional. `Facets['suspense']` lists all three states, but the partial input allows declaring only the ones that matter.

`head` is a `JSX.Element`, not a string. Assign a fragment of tags to it, and the framework collects the fragment during rendering.

`getPageComponent` is the function the server plugin is built on. It is exported because it is useful on its own: given a URL it resolves a component plus its parameters, which is enough to work out what a request would render.

## %d%.api_csr_title

```typescript
declare global {
    interface HTMLAnchorElement {
        _isHandled: boolean;
    }
    interface Window {
        carats: {
            ssp: {
                for: string | undefined;
                data: any;
            };
        };
    }
}
declare function mount(facets: Facets): Facets;
declare function clientRender(): Promise<void>;
declare function goTo(url: string): void;
```

The `_isHandled` flag on `HTMLAnchorElement` is how the runtime marks a link it has already taken over. Once a link has been handled, navigation happens in the client instead of the browser. Do not set it yourself.

## %d%.api_hooks_title

```typescript
type MaybePromise<T> = T | Promise<T>;
type ClearCallback = () => MaybePromise<void>;
type HydrationCallback = () => MaybePromise<ClearCallback | void>;
declare function afterMount(callback: HydrationCallback): void;
declare function beforeMount(callback: HydrationCallback): void;
declare function clearHydrations(): Promise<void>;
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

## %d%.api_ssr_title

```typescript
import { CaratsRequest } from '@carats/core';
import { Facets } from '@carats/render';

interface CaratsServerEntry {
    render: (req: CaratsRequest<never>) => Promise<{
        html?: string;
        head?: string;
    }>;
    getServerProps: <T = any>(req: CaratsRequest<never>) => Promise<T> | T;
    facets: Facets;
    culets: Record<string, Culet>;
}
type CuletArgs = Omit<CaratsRequest, 'data'> & {
    params: Record<string, string>;
};
type Culet<T extends Object = any> = (request: CuletArgs) => T;
declare const seat: <T extends Culet>(f: T) => T;
declare function culet<T extends Object = any>(route: string, culet: Culet<T>): Culet<T>;
declare function defineServerEntry(facets: Facets): CaratsServerEntry;
```

`CuletArgs` is `CaratsRequest` without `data`, plus `params`. The absence of `data` is deliberate: a culet is only ever reached by a GET, so there is no request body to read.

## %d%.api_express_title

```typescript
import { Router } from 'express';
declare const carats: () => Router;
```

## %d%.api_url_title

```typescript
declare function qs(query: Record<string, string>): string;
declare function parseUrl(url: string): {
    path: string;
    query: Record<string, string>;
};
declare function matchRoute(route: string, path: string): Record<string, string> | false;
declare function replaceParams(route: string, params: Record<string, string>): string;
```

## %d%.api_ssg_title

```typescript
#!/usr/bin/env bun
```

`@carats/ssg` ships a command-line tool and no runtime exports, so it has no importable surface. It is referenced by the `build:static` script and nowhere in application code.
