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

%d%.define_facets_note

%d%.head_note

%d%.get_page_component_note

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

%d%.is_handled_note

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

%d%.culet_args_note

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

%d%.ssg_no_exports_note
