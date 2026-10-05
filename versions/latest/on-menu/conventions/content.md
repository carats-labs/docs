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

%d%.underscore_folders_note

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

%d%.layout_children_note

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

%d%.dto_no_export_note

## %d%.conv_sass_title

%d%.conv_sass_desc

```scss
// src/client/pages/trade/trade.sass
@use '../../base' as *

#trade
  .trade-header
    display: flex
```

%d%.sass_use_path_note

## %d%.conv_naming_title

%d%.conv_naming_desc
