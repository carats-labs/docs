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

export default function Home(props: JSX.ComponentProps) {
    return (
        <div class="home">
            <h1>Welcome to Carats</h1>
            <p>Build amazing applications with JJSX</p>
        </div>
    );
}
```

## %d%.component_props_title

%d%.props_desc

```tsx
export default function Card(props: { title: string; children?: JSX.Element }) {
    return (
        <div class="card">
            <h2>{props.title}</h2>
            <div>{props.children}</div>
        </div>
    );
}

// Usage
<Card title="My Card">
    <p>Card content here</p>
</Card>
```

## %d%.component_head_title

%d%.head_desc

```tsx
export default function Home(this: CaratsComponent) {
    this.head = <>
        <title>Home Page</title>
        <meta name="description" content="Welcome to my app" />
    </>;
    return <div>Home</div>;
}
```

## %d%.component_attributes_title

%d%.attributes_desc

### %d%.incorrect_example

```tsx
<button onclick={() => handleClick()}>Click me</button>
```

### %d%.correct_example

```tsx
import { hydrate } from '@carats/hooks';

export default function MyButton() {
    hydrate(() => {
        const button = document.querySelector('button');
        button?.addEventListener('click', () => {
            console.log('Clicked!');
        });
    });
    
    return <button>Click me</button>;
}
```

## %d%.burnish_title

%d%.burnish_desc

### %d%.burnish_with_this

```tsx
export default Burnish<User>(function(user) {
    this.head = <title>{user.name}</title>;
    return <h1>Hello {user.name}</h1>;
});
```

### %d%.burnish_with_recast

```tsx
export default Burnish<User>((user) => <h1>{user.name}</h1>, { recast: true });
```

## %d%.client_entrypoint_title

```typescript
import { mount, clientRender } from '@carats/csr';
import facets from './facets.cara';

mount(facets);
clientRender();
```

## %d%.vite_config_title

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
