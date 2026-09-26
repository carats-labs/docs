# %d%.styling_title

%d%.styling_intro

## %d%.base_sass_title

%d%.base_sass_desc

### %d%.creating_base_sass

```sass
// Colors
$color-primary: #000000
$color-secondary: #ffffff
$color-background: #f5f5f5
$color-text: #333333
$color-text-light: #666666

// Spacing
$spacing-xs: 4px
$spacing-sm: 8px
$spacing-md: 16px
$spacing-lg: 24px
$spacing-xl: 32px

// Typography
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
$font-size-base: 16px
$font-size-sm: 14px
$font-size-lg: 18px
$font-size-xl: 24px
$font-weight-normal: 400
$font-weight-bold: 700

// Breakpoints
$breakpoint-sm: 576px
$breakpoint-md: 768px
$breakpoint-lg: 992px
$breakpoint-xl: 1200px

// Border radius
$border-radius: 4px
$border-radius-lg: 8px

// Box shadows
$box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
$box-shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15)

// Transitions
$transition-fast: 150ms ease
$transition-normal: 250ms ease
```

## %d%.design_tokens_title

%d%.design_tokens_desc

### %d%.correct_usage

```sass
@use '../base.sass' as *

.my-component
    color: $color-text
    padding: $spacing-md
    font-size: $font-size-base
```

### %d%.incorrect_usage

```sass
// Don't nest variables
.my-component
    .inner
        color: $color-text  // Harder to maintain
```

## %d%.semantic_html_title

%d%.semantic_html_desc

### %d%.example_component

```tsx
import './card.sass';

export default function Card(props: { title: string; children?: JSX.Element }) {
    return (
        <article class="card">
            <header>
                <h2>{props.title}</h2>
            </header>
            <section>
                {props.children}
            </section>
            <footer>
                <button>Action</button>
            </footer>
        </article>
    );
}
```

### %d%.corresponding_sass

```sass
@use '../base.sass' as *

.card
    background: $color-secondary
    border-radius: $border-radius-lg
    box-shadow: $box-shadow
    padding: $spacing-md
    margin-bottom: $spacing-md

    header
        margin-bottom: $spacing-sm

        h2
            font-size: $font-size-lg
            font-weight: $font-weight-bold

    section
        margin-bottom: $spacing-md

    footer
        display: flex
        justify-content: flex-end

        button
            background: $color-primary
            color: $color-secondary
            padding: $spacing-sm $spacing-md
            border: none
            border-radius: $border-radius
            cursor: pointer
            transition: background $transition-fast

            &:hover
                opacity: 0.9
```

## %d%.responsive_styling_title

```sass
@use '../base.sass' as *

.container
    max-width: $breakpoint-xl
    margin: 0 auto
    padding: $spacing-md

    @media (max-width: $breakpoint-md)
        padding: $spacing-sm

.grid
    display: grid
    grid-template-columns: repeat(3, 1fr)
    gap: $spacing-md

    @media (max-width: $breakpoint-lg)
        grid-template-columns: repeat(2, 1fr)

    @media (max-width: $breakpoint-sm)
        grid-template-columns: 1fr
```

## %d%.best_practices_title

%d%.best_practices_intro

1. **%d%.best_practice1**
2. **%d%.best_practice2**
3. **%d%.best_practice3**
4. **%d%.best_practice4**
5. **%d%.best_practice5**