# %d%.core_concepts_title

%d%.core_concepts_intro

## %d%.jjsx_heading

%d%.jjsx_desc

### %d%.jjsx_features

- **%d%.jjsx_feature1**: Write pure HTML & JavaScript in .tsx files
- **%d%.jjsx_feature2**: No React dependencies required
- **%d%.jjsx_feature3**: Automatic server and client-side rendering

## %d%.facets_heading

%d%.facets_desc

### %d%.defining_facets

```typescript
import { defineFacets } from '@carats/render';
import Home from './pages/home';
import Profile from './pages/profile';

export default defineFacets({
    routes: {
        '/': Home,
        '/profile/:id': Profile
    },
    suspense: {
        loading: () => 'Loading...',
        error: (error) => <div>Error: {error.message}</div>,
        notFound: () => <div>Page not found</div>
    },
    inAppRouting: true
});
```

## %d%.culets_heading

%d%.culets_desc

### %d%.defining_culet

```typescript
import { culet } from '@carats/ssr';

culet<User>('/profile', (request) => {
    return {
        id: request.params.id,
        name: 'John Doe',
        email: 'john@example.com'
    };
});
```

## %d%.server_props_heading

%d%.server_props_desc

%d%.server_props_auto_text

```typescript
import { Burnish } from '@carats/render';

export default Burnish<User>(function(user) {
    this.head = <title>{user.name}</title>;
    return <h1>Hello {user.name}</h1>;
});
```
