# @niaueow/ui

A themeable Vue 3 component library built from the niaueow Figma design system. Components are styled with Tailwind CSS v4, interactive parts are built on [Reka UI](https://reka-ui.com), and every color, font and radius is a CSS variable you can override per project.

> **Status:** pre-release (v0.x). APIs may change between minor versions until 1.0. See [ROADMAP.md](./ROADMAP.md).

- **Storybook:** `<<STORYBOOK_URL>>`
- **npm:** https://www.npmjs.com/package/@niaueow/ui
- **Figma:** https://www.figma.com/design/83nCxVpSCw5SFSsoPu4o9Z/niaueow-s-design-system

## Features

- Vue 3 + TypeScript, with typed props and autocomplete for every variant
- Works in Vue (Vite) and Nuxt projects, SSR safe
- Rebrand with CSS variables only; component code never changes
- Light and dark mode built in
- Accessible by default: WCAG 2.2 AA target, keyboard support, visible focus, axe-tested
- Tree-shakeable ESM package; import only what you use
- Published from CI with npm provenance

## Requirements

| Dependency | Version |
|---|---|
| Vue | `^3.5.0` |
| Tailwind CSS | `^4.0.0` |
| Node.js (for your build) | current LTS |

Your project must already use Tailwind CSS v4. The library ships Tailwind classes and theme directives, and your Tailwind build compiles them.

## Installation

```bash
npm i @niaueow/ui
# or
pnpm add @niaueow/ui
```

## Setup

Import the library stylesheet after Tailwind in your main CSS file:

```css
/* src/assets/main.css */
@import "tailwindcss";
@import "@niaueow/ui/styles.css";
```

The stylesheet registers the design tokens, the theme mapping, the `dark` variant and the source path Tailwind needs to find the library's classes.

## Usage

### Named imports (recommended)

```vue
<script setup lang="ts">
import { NButton, NCard } from '@niaueow/ui'
</script>

<template>
  <NCard>
    <NButton variant="primary">Simpan</NButton>
  </NCard>
</template>
```

### Global registration

```ts
// main.ts
import { createApp } from 'vue'
import NiaueowUI from '@niaueow/ui'
import App from './App.vue'
import './assets/main.css'

createApp(App).use(NiaueowUI).mount('#app')
```

Global registration includes every component in your bundle. Use named imports if bundle size matters.

## Theming

Override any `--n-*` variable in your own CSS. Your values win regardless of import order.

Rebrand by replacing the brand scale. Every brand, info and focus token in light and dark mode follows:

```css
:root {
  --n-brand-50: var(--color-emerald-50);
  --n-brand-100: var(--color-emerald-100);
  /* ...200 to 800 */
  --n-brand-900: var(--color-emerald-900);
  --n-font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Or change a single role:

```css
.dark {
  --n-background-primary: #1a1a1a;
}
```

The default font is Plus Jakarta Sans. Fonts are not bundled: load the font (Google Fonts, `@nuxt/fonts`, self-hosted) or point `--n-font-sans` at another one.

Full guide and token reference: [docs/THEMING.md](./docs/THEMING.md).

## Dark mode

Dark mode is class based. Add `dark` to `<html>` to switch:

```ts
document.documentElement.classList.toggle('dark')
```

In Nuxt, `@nuxtjs/color-mode` with `classSuffix: ''` works out of the box. See [docs/THEMING.md](./docs/THEMING.md#dark-mode).

## Nuxt

Until the Nuxt module ships, use named imports or register the plugin:

```ts
// plugins/niaueow-ui.ts
import NiaueowUI from '@niaueow/ui'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(NiaueowUI)
})
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/main.css'],
})
```

## Components

| Component | Status | Since |
|---|---|---|
| NButton | planned | v0.1 |
| NInput | planned | v0.1 |
| NBadge | planned | v0.1 |
| NCard | planned | v0.1 |
| NSidebar | planned | v0.2 |
| NNavbar | planned | v0.2 |
| NDialog | planned | v0.3 |
| NDropdown | planned | v0.3 |
| NSelect | planned | v0.3 |
| NTabs | planned | v0.3 |
| NToast | planned | v0.4 |
| NAlert | planned | v0.4 |
| NTooltip | planned | v0.4 |

Props, variants and live examples for each component are in Storybook.

## Documentation

| Document | Contents |
|---|---|
| [TECHSTACK.md](./TECHSTACK.md) | Tools used and why |
| [ROADMAP.md](./ROADMAP.md) | Release plan |
| [docs/THEMING.md](./docs/THEMING.md) | Theming guide and token reference for consumers |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Repo layout, build output, package exports |
| [docs/TOKENS.md](./docs/TOKENS.md) | Figma variables to CSS pipeline |
| [docs/COMPONENT-GUIDELINES.md](./docs/COMPONENT-GUIDELINES.md) | Rules every component follows |
| [docs/ADDING-A-COMPONENT.md](./docs/ADDING-A-COMPONENT.md) | How to add a new component |
| [docs/MAINTAINING.md](./docs/MAINTAINING.md) | Releases, publishing, deployment, repo settings |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development setup and pull request process |
| [SECURITY.md](./SECURITY.md) | Reporting vulnerabilities |

## Development

```bash
git clone https://github.com/<<GITHUB_USERNAME>>/niaueow-ui.git
cd niaueow-ui
pnpm install
pnpm storybook
```

Common commands:

| Command | What it does |
|---|---|
| `pnpm storybook` | Start Storybook locally |
| `pnpm dev:vue` / `pnpm dev:nuxt` | Run a playground app that consumes the library |
| `pnpm tokens` | Regenerate CSS tokens from the Figma export |
| `pnpm new <Name>` | Scaffold a new component |
| `pnpm test` | Run unit, interaction and a11y tests |
| `pnpm verify` | Run every check CI runs |

Details in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © Shabrina
