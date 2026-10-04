# %d%.conventions_title

%d%.conventions_intro

## %d%.conv_pages_title

%d%.conv_pages_desc

```
src/client/pages/
├── _layout/          # shared building block, not a route
│   ├── index.tsx
│   └── _layout.sass
├── _error/           # suspense.error
│   └── index.tsx
├── _not_found/       # suspense.notFound
│   └── index.tsx
├── home/             # '/'
│   ├── index.tsx
│   └── home.sass
├── market/           # '/market'
│   ├── index.tsx
│   └── market.sass
├── profile/          # '/profile'
│   ├── index.tsx
│   └── profile.sass
└── trade/            # '/trade/:symbol'
    ├── index.tsx
    └── trade.sass
```

The leading underscore is what marks a folder as a building block rather than a page. It keeps shared components out of the way in the file tree and signals that they are not meant to be routed to.

## %d%.conv_layout_title

%d%.conv_layout_desc

```tsx
// src/client/pages/profile/index.tsx
import { Burnish } from '@carats/render';
import Layout from '../_layout';
import './profile.sass';

export default Burnish(function (user: User) {
    this.head = <>
        <title>Profile for {user.name}</title>
    </>;
    return (
        <Layout>
            <h1>{user.name}</h1>
        </Layout>
    );
});
```

The layout renders `props.children` where the page content belongs, which is the only composition mechanism. There is no nested-route tree and no automatic wrapping, so the dependency is visible in the import.

## %d%.conv_error_title

%d%.conv_error_desc

## %d%.conv_dto_title

%d%.conv_dto_desc

```typescript
// src/dto/user.d.ts
interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string
  website: string
}
```

The interface has no `export`, which is what makes it global. With `typeRoots` pointing at `src/dto`, `culet<User>` and `Burnish<User>` resolve in every file without an import, and a rename in one place is picked up everywhere.

## %d%.conv_sass_title

%d%.conv_sass_desc

```sass
// src/client/pages/trade/trade.sass
@use '../../base' as *

#trade
  .trade-header
    display: flex
```

The extension in the `@use` path is optional, and the path is relative to the stylesheet rather than to the component. `base.sass` is the only file that defines tokens; every other file consumes them.

## %d%.conv_naming_title

%d%.conv_naming_desc
