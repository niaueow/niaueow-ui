# Theming

Every visual value in `@niaueow/ui` is a CSS variable with the `--n-` prefix. Override the variables; never override component classes to change brand colors.

## Quick start

```css
@import "tailwindcss";
@import "@niaueow/ui/styles.css";

:root {
  --n-primary: var(--color-emerald-600);
  --n-primary-foreground: white;
}
```

That is a complete rebrand of primary color across every component.

## How overrides work

- Library tokens are declared inside `@layer base`.
- Your declarations outside a layer always beat layered ones, so your `:root { ... }` wins whether it appears before or after the library import.
- Library utilities like `bg-primary` read `var(--n-primary)` at runtime, so changing the variable updates every component without rebuilding.

You can scope a theme to part of the page:

```css
.marketing-section {
  --n-primary: var(--color-rose-600);
}
```

## Token reference

> Filled in from the real Figma semantic collection during setup. The names below show the expected shape.

### Colors

| Variable | Used for |
|---|---|
| `--n-background` | Page background |
| `--n-foreground` | Default text |
| `--n-primary` | Primary actions (filled button, active states) |
| `--n-primary-foreground` | Text/icons on `--n-primary` |
| `--n-secondary` / `--n-secondary-foreground` | Secondary actions |
| `--n-muted` / `--n-muted-foreground` | Subtle backgrounds, hint text |
| `--n-accent` / `--n-accent-foreground` | Hover and highlight surfaces |
| `--n-destructive` / `--n-destructive-foreground` | Errors and destructive actions |
| `--n-card` / `--n-card-foreground` | Card surfaces |
| `--n-border` | Borders and dividers |
| `--n-input` | Input borders |
| `--n-ring` | Focus ring |

### Shape, type, depth

| Variable | Used for |
|---|---|
| `--n-radius-sm`, `--n-radius-md`, `--n-radius-lg` | Corner radius |
| `--n-font-sans` | Base font family |
| `--n-shadow-sm`, `--n-shadow-md` | Elevation |
| `--n-spacing` | Base spacing unit |

When you change a foreground/background pair, keep the contrast at 4.5:1 or higher for text. The library checks its own defaults; it cannot check your overrides.

## Fonts

Fonts are not bundled. Load the font yourself and set the variable:

```css
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

:root {
  --n-font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
}
```

Self-hosting the font (or `@nuxt/fonts` in Nuxt) avoids a third-party request.

## Dark mode

Dark mode is class based. The library defines:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Any element with the `dark` class, and its descendants, use dark tokens. Usually you put it on `<html>`.

### Vue (Vite)

```ts
// composables/useTheme.ts
import { ref, watchEffect } from 'vue'

const isDark = ref(
  typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches,
)

watchEffect(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark.value)
  }
})

export function useTheme() {
  return { isDark, toggle: () => (isDark.value = !isDark.value) }
}
```

VueUse's `useDark()` does the same with persistence, if you already use VueUse.

### Nuxt

Install `@nuxtjs/color-mode` and set the class format the library expects:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode'],
  colorMode: { classSuffix: '' },
})
```

`useColorMode()` then switches the `dark` class on `<html>` without a flash on load.

### Custom dark values

```css
.dark {
  --n-primary: var(--color-emerald-400);
  --n-primary-foreground: var(--color-emerald-950);
}
```

## Extending components with classes

Every component accepts a `class` prop. Conflicting Tailwind classes are resolved in your favour:

```vue
<NButton class="w-full px-8">Full width</NButton>
```

Use this for layout (width, margin, position). Use variables for brand changes, so every instance stays consistent.

## Targeting parts

Components expose `data-slot`, `data-state` and `data-disabled` attributes:

```css
[data-slot="button"][data-disabled] {
  cursor: not-allowed;
}
```

Treat these as styling hooks, not as stable DOM structure.
