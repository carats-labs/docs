# %d%.components_title

%d%.components_intro

## %d%.component_structure_title

%d%.component_structure_desc

```tsx
import './_layout.sass';

export default function Layout(props: JSX.ComponentProps) {
    return (
        <>
            <header>Hello World</header>
            <main>{props.children}</main>
            <footer>Carats</footer>
        </>
    )
}
```

## %d%.component_example_title

```tsx
import './home.sass';

export default function Home() {
    return (
        <div class="home">
            <h1>Welcome to Carats</h1>
            <p>Build amazing applications with JJSX</p>
        </div>
    );
}
```

%d%.sass_side_effect_note

## %d%.component_props_title

%d%.component_props_desc

```tsx
export default function Card(props: { title: string; children?: JSX.Element }) {
    return (
        <article class="card">
            <h2>{props.title}</h2>
            {props.children}
        </article>
    );
}

// Usage
<Card title="My Card">
    <p>Card content here</p>
</Card>
```

## %d%.component_default_props_title

%d%.component_default_props_desc

```tsx
import { CaratsComponent } from '@carats/render';

const Profile: CaratsComponent<User> = function (user) {
    return <h1>{user.name}</h1>;
};

Profile.defaultProps = {
    id: '0',
    name: 'Guest',
    username: 'guest',
    email: '',
    phone: '',
    website: ''
};

export default Profile;
```

## %d%.component_head_title

%d%.component_head_desc

```tsx
import { CaratsComponent } from '@carats/render';

export default function Home(this: CaratsComponent) {
    this.head = <>
        <title>Home Page</title>
        <meta name="description" content="Welcome to my app" />
    </>;
    return <div>Home</div>;
}
```

> %d%.component_head_note

%d%.carats_component_type_note

## %d%.component_attributes_title

%d%.component_attributes_desc

### %d%.incorrect_example

```tsx
<button onclick={() => handleClick()}>Click me</button>
```

%d%.function_attribute_note

### %d%.correct_example

```tsx
import { afterMount } from '@carats/hooks';

export default function MyButton() {
    let handler: (() => void) | undefined;

    afterMount(() => {
        const button = document.getElementById('my-button');
        handler = () => console.log('Clicked!');
        button?.addEventListener('click', handler);
        return () => button?.removeEventListener('click', handler!);
    });

    return <button id="my-button">Click me</button>;
}
```

%d%.other_event_attributes_note

## %d%.burnish_title

%d%.burnish_desc

### %d%.burnish_with_this

```tsx
import { Burnish } from '@carats/render';

export default Burnish<User>(function (user) {
    this.head = <title>{user.name}</title>;
    return <h1>Hello {user.name}</h1>;
});
```

### %d%.burnish_with_recast

%d%.burnish_recast

```tsx
export default Burnish<User>((user) => <h1>Hello {user.name}</h1>, { recast: true });
```

%d%.burnished_props_note

## %d%.client_entrypoint_title

%d%.client_entrypoint_desc

```typescript
import { mount, clientRender } from '@carats/csr';
import facets from './facets.cara';
import './base.sass';

mount(facets);
clientRender();
```

%d%.global_stylesheet_note

## %d%.vite_config_title

%d%.vite_config_desc

```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  publicDir: path.resolve(import.meta.dirname, 'public'),
  root: path.resolve(import.meta.dirname, 'src/client'),
  base: '/',
  appType: 'custom',
  server: {
    middlewareMode: true
  },
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/client'),
    emptyOutDir: true,
    manifest: true,
    minify: true,
    rollupOptions: {
      treeshake: true
    }
  }
})
```
