# Theming

Every visual value in `@niaueow/ui` is a CSS variable with the `--n-` prefix, generated from the [niaueow Figma design system](https://www.figma.com/design/83nCxVpSCw5SFSsoPu4o9Z/niaueow-s-design-system). Override the variables to theme; never override component classes to change brand colors.

Tokens come in two levels:

| Level | Figma source | Example | Used by components? |
|---|---|---|---|
| **Primitive** | `Primitive` collection | `--n-brand-500` (`#1155cc`) | No |
| **Semantic** | `Semantic` collection (Light, Dark) | `--n-background-brand-active` → `var(--n-brand-500)` in light, `var(--n-brand-400)` in dark | Yes |

Semantic tokens reference primitives with `var()`. Override a primitive scale and every semantic token built on it follows, in both modes.

## Quick start

### Rebrand the primary color

The whole brand palette is one 10-step scale. Replace it:

```css
@import "tailwindcss";
@import "@niaueow/ui/styles.css";

:root {
  --n-brand-50: var(--color-blue-50);
  --n-brand-100: var(--color-blue-100);
  --n-brand-200: var(--color-blue-200);
  --n-brand-300: var(--color-blue-300);
  --n-brand-400: var(--color-blue-400);
  --n-brand-500: var(--color-blue-500);
  --n-brand-600: var(--color-blue-600);
  --n-brand-700: var(--color-blue-700);
  --n-brand-800: var(--color-blue-800);
  --n-brand-900: var(--color-blue-900);
}
```

Every `brand`, `info` and `focus` token in light and dark mode now uses blue. Keep the scale ordered from lightest (50) to darkest (900), and check that white text on step 500 still reaches 4.5:1.

### Change the font

```css
:root {
  --n-font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

## Three ways to theme

| Goal | Override | Example |
|---|---|---|
| Change a whole palette | Primitive scale | `--n-brand-*`, `--n-neutral-*`, `--n-positive-*`, `--n-warning-*`, `--n-negative-*` |
| Change one role | Semantic token | `--n-background-primary: #ffffff;` |
| Theme one section | Primitives or semantic tokens on a `data-n-theme` element | see [Scoped themes](#scoped-themes) |

Override a semantic token for one mode only by placing it in `:root` (light) or `.dark` (dark):

```css
.dark {
  --n-background-primary: #1a1a1a;
}
```

## How overrides work

- Library tokens are declared inside `@layer base`. Your unlayered declarations always win, whether they appear before or after the library import.
- Utilities like `bg-background-brand-active` read `var(--n-background-brand-active)` at runtime, so changing a variable updates every component without rebuilding.
- Semantic tokens are declared on `:root`, `.dark` and `[data-n-theme]`. A CSS variable that references another variable is resolved on the element where it is declared, then inherited as a fixed value. That is why scoped primitive overrides need the `data-n-theme` attribute.

### Scoped themes

Add `data-n-theme` to the wrapper so the library re-declares semantic tokens there:

```html
<section data-n-theme class="promo">
  <NButton>Uses rose inside this section</NButton>
</section>
```

```css
.promo {
  --n-brand-500: var(--color-rose-500);
  --n-brand-600: var(--color-rose-600);
  /* ...other steps */
}
```

Without the attribute, overriding a primitive on a nested element has no effect on semantic tokens. Overriding semantic tokens directly works anywhere.

## Dark mode

All 57 semantic colors have a Light and a Dark value. Dark mode is class based:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Put `dark` on `<html>` to switch the whole page.

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

VueUse's `useDark()` does the same with persistence.

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode'],
  colorMode: { classSuffix: '' },
})
```

`useColorMode()` then toggles the `dark` class on `<html>` without a flash on load.

## Token reference

### Primitive colors

Override these to change a palette. They do not create Tailwind utilities, so your project's own Tailwind palette is untouched.

| Scale | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| `--n-brand-*` | `#e7eefa` | `#b5caef` | `#92b1e8` | `#608ddd` | `#4177d6` | `#1155cc` | `#0f4dba` | `#0c3c91` | `#092f70` | `#072456` |
| `--n-positive-*` | `#e9f9ef` | `#baedcd` | `#99e4b5` | `#6bd893` | `#4ed17e` | `#22c55e` | `#1fb356` | `#188c43` | `#136c34` | `#0e5327` |
| `--n-warning-*` | `#fef5e7` | `#fce1b3` | `#fad28f` | `#f8be5c` | `#f7b13c` | `#f59e0b` | `#df900a` | `#ae7008` | `#875706` | `#674205` |
| `--n-negative-*` | `#fdecec` | `#fac5c5` | `#f8a9a9` | `#f48282` | `#f26969` | `#ef4444` | `#d93e3e` | `#aa3030` | `#832525` | `#641d1d` |
| `--n-neutral-*` | `#f1f1f1` | `#d4d4d4` | `#c0c0c0` | `#a3a3a3` | `#919191` | `#757575` | `#6a6a6a` | `#535353` | `#404040` | `#313131` |

| Variable | Value | Figma |
|---|---|---|
| `--n-neutral-background` | `#f9f9f9` | `Neutral/Background` |
| `--n-neutral-white` | `#fcfcfc` | `Neutral/White` |
| `--n-overlay-50` | `#313131` at 50% | `Overlay/50` |
| `--n-overlay-50-inverse` | `#f7fafc` at 50% | `Overlay/50 Inverse` |

### Semantic colors

Use the utility prefix that matches the category: `text-` for content, `bg-` for background and surface, `border-` / `ring-` / `outline-` for stroke.

#### Content (text and icons)

| Variable | Utility | Light | Dark |
|---|---|---|---|
| `--n-content-primary` | `text-content-primary` | neutral-900 | neutral-white |
| `--n-content-primary-inverse` | `text-content-primary-inverse` | neutral-white | neutral-900 |
| `--n-content-gray` | `text-content-gray` | neutral-500 | neutral-200 |
| `--n-content-hover` | `text-content-hover` | neutral-600 | neutral-100 |
| `--n-content-default` | `text-content-default` | neutral-400 | neutral-600 |
| `--n-content-disable` | `text-content-disable` | neutral-300 | neutral-700 |
| `--n-content-brand-active` | `text-content-brand-active` | brand-500 | brand-400 |
| `--n-content-brand-hover` | `text-content-brand-hover` | brand-600 | brand-300 |
| `--n-content-brand-clicked` | `text-content-brand-clicked` | brand-700 | brand-200 |
| `--n-content-brand-lighter` | `text-content-brand-lighter` | brand-200 | brand-800 |
| `--n-content-brand-subtle` | `text-content-brand-subtle` | brand-50 | brand-900 |
| `--n-content-info` | `text-content-info` | brand-500 | brand-400 |
| `--n-content-positive` | `text-content-positive` | positive-500 | positive-400 |
| `--n-content-warning` | `text-content-warning` | warning-500 | warning-400 |
| `--n-content-negative` | `text-content-negative` | negative-500 | negative-400 |
| `--n-content-positive-subtle` | `text-content-positive-subtle` | positive-50 | positive-900 |
| `--n-content-warning-subtle` | `text-content-warning-subtle` | warning-50 | warning-900 |
| `--n-content-negative-subtle` | `text-content-negative-subtle` | negative-50 | negative-900 |

#### Background

| Variable | Utility | Light | Dark |
|---|---|---|---|
| `--n-background-primary` | `bg-background-primary` | neutral-background | neutral-900 |
| `--n-background-primary-inverse` | `bg-background-primary-inverse` | neutral-900 | neutral-background |
| `--n-background-light` | `bg-background-light` | neutral-white | neutral-700 |
| `--n-background-hover` | `bg-background-hover` | neutral-50 | neutral-800 |
| `--n-background-disabled` | `bg-background-disabled` | neutral-100 | neutral-800 |
| `--n-background-brand-active` | `bg-background-brand-active` | brand-500 | brand-400 |
| `--n-background-brand-hover` | `bg-background-brand-hover` | brand-600 | brand-300 |
| `--n-background-brand-clicked` | `bg-background-brand-clicked` | brand-700 | brand-200 |
| `--n-background-brand-lighter` | `bg-background-brand-lighter` | brand-200 | brand-800 |
| `--n-background-brand-subtle` | `bg-background-brand-subtle` | brand-50 | brand-900 |
| `--n-background-info` | `bg-background-info` | brand-500 | brand-400 |
| `--n-background-positive` | `bg-background-positive` | positive-500 | positive-400 |
| `--n-background-warning` | `bg-background-warning` | warning-500 | warning-400 |
| `--n-background-negative` | `bg-background-negative` | negative-500 | negative-400 |
| `--n-background-info-subtle` | `bg-background-info-subtle` | brand-50 | brand-900 |
| `--n-background-positive-subtle` | `bg-background-positive-subtle` | positive-50 | positive-900 |
| `--n-background-warning-subtle` | `bg-background-warning-subtle` | warning-50 | warning-900 |
| `--n-background-negative-subtle` | `bg-background-negative-subtle` | negative-50 | negative-900 |

#### Stroke (borders, dividers, focus)

| Variable | Utility | Light | Dark |
|---|---|---|---|
| `--n-stroke-primary` | `border-stroke-primary` | neutral-50 | neutral-800 |
| `--n-stroke-primary-inverse` | `border-stroke-primary-inverse` | neutral-800 | neutral-50 |
| `--n-stroke-secondary` | `border-stroke-secondary` | neutral-100 | neutral-700 |
| `--n-stroke-secondary-inverse` | `border-stroke-secondary-inverse` | neutral-700 | neutral-100 |
| `--n-stroke-disabled` | `border-stroke-disabled` | neutral-100 | neutral-800 |
| `--n-stroke-inverse` | `border-stroke-inverse` | neutral-background | neutral-900 |
| `--n-stroke-focus` | `ring-stroke-focus` | brand-600 | brand-300 |
| `--n-stroke-brand` | `border-stroke-brand` | brand-500 | brand-400 |
| `--n-stroke-info` | `border-stroke-info` | brand-500 | brand-400 |
| `--n-stroke-positive` | `border-stroke-positive` | positive-500 | positive-400 |
| `--n-stroke-warning` | `border-stroke-warning` | warning-500 | warning-400 |
| `--n-stroke-negative` | `border-stroke-negative` | negative-500 | negative-400 |

#### Surface (elevation levels)

In light mode every level is `neutral-background` and elevation comes from the matching shadow. In dark mode each level gets lighter. Pair them: `bg-surface-l2 shadow-l2`.

| Variable | Utility | Light | Dark |
|---|---|---|---|
| `--n-surface-l0` | `bg-surface-l0` | neutral-background | neutral-900 |
| `--n-surface-l1` | `bg-surface-l1` | neutral-background | neutral-800 |
| `--n-surface-l2` | `bg-surface-l2` | neutral-background | neutral-700 |
| `--n-surface-l3` | `bg-surface-l3` | neutral-background | neutral-600 |
| `--n-surface-l4` | `bg-surface-l4` | neutral-background | neutral-500 |
| `--n-surface-l5` | `bg-surface-l5` | neutral-background | neutral-400 |
| `--n-surface-l6` | `bg-surface-l6` | neutral-background | neutral-300 |

#### Overlay (scrims behind dialogs)

| Variable | Utility | Light | Dark |
|---|---|---|---|
| `--n-overlay` | `bg-overlay` | overlay-50 | overlay-50 |
| `--n-overlay-inverse` | `bg-overlay-inverse` | overlay-50-inverse | overlay-50-inverse |

### Radius

From the Figma `Radius` collection. Names are the pixel value.

| Variable | Utility | Value |
|---|---|---|
| `--n-radius-0` | `rounded-0` | 0 |
| `--n-radius-4` | `rounded-4` | 4px |
| `--n-radius-8` | `rounded-8` | 8px |
| `--n-radius-10` | `rounded-10` | 10px |
| `--n-radius-12` | `rounded-12` | 12px |
| `--n-radius-16` | `rounded-16` | 16px |
| `--n-radius-24` | `rounded-24` | 24px |
| `--n-radius-32` | `rounded-32` | 32px |
| `Radius Full` | `rounded-full` | Tailwind's built-in fully rounded value |

Because the names describe values, a consumer who wants sharper corners overrides each number (`--n-radius-8: 4px`). Role-based radius tokens (for controls, cards, dialogs) are on the roadmap.

### Spacing

Every value in the Figma `Spacing` collection is a multiple of 2px, so the library uses Tailwind's default 4px spacing scale and generates no spacing variables. Class step = Figma px ÷ 4.

| Figma | Class step | Example |
|---|---|---|
| Spacing 2 | `0.5` | `p-0.5` |
| Spacing 4 | `1` | `gap-1` |
| Spacing 8 | `2` | `px-2` |
| Spacing 10 | `2.5` | `py-2.5` |
| Spacing 12 | `3` | `p-3` |
| Spacing 14 | `3.5` | `px-3.5` |
| Spacing 16 | `4` | `p-4` |
| Spacing 20 | `5` | `gap-5` |
| Spacing 24 | `6` | `p-6` |
| Spacing 32 to 112 | `8` to `28` | `p-8`, `mt-28` |

To change density across your whole app, set Tailwind's own `--spacing` in your `@theme`. The library does not set it.

### Typography

From the Figma text styles. Font family: Plus Jakarta Sans. Letter spacing 1% (`0.01em`) on every style except Caption 3 (`0`). Line height follows the font (`normal`), matching Figma's Auto.

| Utility | Size | Weight | Figma style |
|---|---|---|---|
| `text-heading-1` | 2.5rem (40px) | 600 | Heading/Heading 1 |
| `text-heading-2` | 2rem (32px) | 600 | Heading/Heading 2 |
| `text-heading-3` | 1.5rem (24px) | 600 | Heading/Heading 3 |
| `text-body-1` | 1.25rem (20px) | 500 | Body/Body 1 |
| `text-body-2` | 1rem (16px) | 500 | Body/Body 2 |
| `text-body-3` | 0.875rem (14px) | 500 | Body/Body 3 |
| `text-body-1-bold` | 1.25rem (20px) | 600 | Body/Body 1-Bold |
| `text-body-2-bold` | 1rem (16px) | 600 | Body/Body 2-Bold |
| `text-body-3-bold` | 0.875rem (14px) | 600 | Body/Body 3-Bold |
| `text-caption-1` | 0.875rem (14px) | 400 | Caption/Caption 1 |
| `text-caption-2` | 0.75rem (12px) | 400 | Caption/Caption 2 |
| `text-caption-3` | 0.625rem (10px) | 400 | Caption/Caption 3 |

Each utility sets size, weight, letter spacing and line height together. Override a size with `--n-text-<name>`, for example `--n-text-heading-1: 2.25rem`.

| Variable | Default |
|---|---|
| `--n-font-sans` | `"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif` |

### Shadows

From the Figma effect styles `Shadow/L0` to `Shadow/L6`.

| Variable | Utility | Value |
|---|---|---|
| `--n-shadow-l0` | `shadow-l0` | `0 4px 4px -2px rgb(24 39 75 / 0.08), 0 2px 4px -2px rgb(24 39 75 / 0.12)` |
| `--n-shadow-l1` | `shadow-l1` | `0 0 2px 0 rgb(0 0 0 / 0.08), 0 2px 4px 0 rgb(0 0 0 / 0.08)` |
| `--n-shadow-l2` | `shadow-l2` | `0 0 4px 0 rgb(0 0 0 / 0.08), 0 4px 8px 0 rgb(0 0 0 / 0.1)` |
| `--n-shadow-l3` | `shadow-l3` | `0 0 6px 0 rgb(0 0 0 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.1)` |
| `--n-shadow-l4` | `shadow-l4` | `0 0 8px 0 rgb(0 0 0 / 0.08), 0 10px 20px 0 rgb(0 0 0 / 0.1)` |
| `--n-shadow-l5` | `shadow-l5` | `0 0 10px 0 rgb(0 0 0 / 0.08), 0 12px 24px 0 rgb(0 0 0 / 0.1)` |
| `--n-shadow-l6` | `shadow-l6` | `0 0 12px 0 rgb(0 0 0 / 0.08), 0 16px 32px 0 rgb(0 0 0 / 0.1)` |

## Fonts

Fonts are not bundled. The default stack starts with Plus Jakarta Sans, so load it (weights 400, 500 and 600) or replace `--n-font-sans`:

```css
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap");
```

Self-hosting the font, or `@nuxt/fonts` in Nuxt, avoids a third-party request. Without the font loaded, text falls back to the system sans-serif.

## Contrast

The library checks its default token pairs with `pnpm tokens:contrast` (see [TOKENS.md](./TOKENS.md#contrast-audit)). It cannot check your overrides. When you change a palette, keep text at 4.5:1 or higher and focus rings and input borders at 3:1 or higher against their background.

## Extending components with classes

Every component accepts a `class` prop. Conflicting Tailwind classes are resolved in your favour:

```vue
<NButton class="w-full px-8">Full width</NButton>
```

Use classes for layout (width, margin, position). Use variables for brand changes, so every instance stays consistent.

## Targeting parts

Components expose `data-slot`, `data-state` and `data-disabled` attributes:

```css
[data-slot="button"][data-disabled] {
  cursor: not-allowed;
}
```

Treat these as styling hooks, not as stable DOM structure.
