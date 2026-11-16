# Tech Stack

This document lists every tool in `@niaueow/ui`, what it does here, and why it was chosen. Exact versions live in `package.json` and `pnpm-lock.yaml`; the policy is to use the latest stable release, verified at install time.

## Overview

| Layer | Tool |
|---|---|
| Framework | Vue 3.5+ (Composition API, `<script setup>`) |
| Language | TypeScript (`strict`) |
| Styling | Tailwind CSS v4 |
| Headless primitives | Reka UI |
| Variants and class merging | class-variance-authority (or tailwind-variants), tailwind-merge, clsx |
| Build | Vite (library mode), vue-tsc / vite-plugin-dts |
| Documentation | Storybook (Vue 3 + Vite) |
| Testing | Vitest, @vue/test-utils, Storybook Vitest integration, axe |
| Linting and formatting | ESLint (flat config), eslint-plugin-vue, typescript-eslint, Prettier |
| Package checks | publint, @arethetypeswrong/cli |
| Token pipeline | Node + tsx, zod, culori |
| Versioning | Changesets |
| Package manager | pnpm (workspace) |
| CI/CD | GitHub Actions, CodeQL, Dependabot |
| Publishing | npm trusted publishing (OIDC) with provenance |
| Docs hosting | Vercel |

## Runtime

### Vue 3
The target framework for every project that uses this library. Vue 3.5+ is required for `useId()` (stable SSR-safe ids) and `defineModel` (simpler `v-model`).

### TypeScript
Every component exports its prop types, so consumers get autocomplete for `variant`, `size` and other props. `strict: true` catches mistakes before they ship.

### Tailwind CSS v4
Components are styled with Tailwind utilities. v4 defines the theme in CSS (`@theme`), which means design tokens are plain CSS variables at runtime and can be overridden per project without rebuilding the library.

Consequence: consuming projects must use Tailwind v4. This is an intentional trade-off for fast styling and a single token system.

### Reka UI
Headless (unstyled) Vue primitives for components with complex behaviour: Dialog, Dropdown, Select, Tabs, Tooltip, Toast. Reka handles focus trapping, keyboard navigation, ARIA attributes and portals. The library adds the visual layer from Figma. It is the same foundation shadcn-vue uses, so it is well maintained and widely tested.

Simple components (Button, Badge, Card) are written directly, using Reka's `Primitive` only for `as` / `asChild` support.

### class-variance-authority, tailwind-merge, clsx
- **Variant library** maps props like `variant="primary" size="sm"` to class lists in one typed definition per component.
- **tailwind-merge** resolves conflicting classes when a consumer passes `class="px-8"` to a component that already has `px-4`.
- **clsx** builds conditional class strings.
- They are combined in a single `cn()` helper.

These four packages are the entire runtime dependency budget. Adding another runtime dependency requires a written justification.

## Build

### Vite (library mode)
Builds ESM output with one module per source file (`preserveModules`), so bundlers can tree-shake unused components. `vue`, `reka-ui` and other dependencies are externalized, not bundled.

### vue-tsc / vite-plugin-dts
Generates `.d.ts` files from `.vue` and `.ts` sources. Type output is checked with `@arethetypeswrong/cli`.

### CSS output
`dist/styles.css` is copied from source without running Tailwind on it. It keeps the `@theme`, `@custom-variant`, `@layer` and `@source` directives so the consumer's Tailwind compiles them together with the app's own classes.

## Documentation

### Storybook (Vue 3 + Vite)
Interactive documentation and component playground, the equivalent of mui.com for this library. Addons:
- **Docs / autodocs:** prop tables generated from TypeScript types
- **a11y:** axe checks on every story
- **themes:** light / dark toggle via the `.dark` class
- **Vitest integration:** runs stories as tests in CI

Deployed to Vercel as a static site.

## Testing

| Tool | Purpose |
|---|---|
| Vitest | Unit and interaction tests, coverage thresholds |
| @vue/test-utils | Mounting components in tests |
| Storybook Vitest integration | Every story becomes a test; play functions test interactions |
| axe (via Storybook a11y and test helpers) | Automated accessibility checks |
| Playgrounds (Vite app, Nuxt app) | Build-level smoke tests that the published package works for real consumers, including SSR |

## Code quality

| Tool | Purpose |
|---|---|
| ESLint + eslint-plugin-vue + typescript-eslint | Linting, including `vue/no-v-html` as an error |
| Prettier | Formatting |
| publint | Checks `package.json` exports and published files |
| @arethetypeswrong/cli | Checks types resolve for consumers |

## Design tokens

| Tool | Purpose |
|---|---|
| Figma Variables | Source of truth: primitives collection plus semantic collection with Light and Dark modes |
| Figma export plugin | Exports variables to JSON (plugin name recorded in [docs/TOKENS.md](./docs/TOKENS.md)) |
| tsx | Runs TypeScript build scripts |
| zod | Validates the export file shape and rejects invalid values |
| culori | Parses colors and computes WCAG contrast ratios |

## Release and delivery

| Tool | Purpose |
|---|---|
| Changesets | Records changes per PR, bumps versions, writes the changelog |
| GitHub Actions | CI checks, release automation |
| npm trusted publishing | Publishes from CI over OIDC; no long-lived npm token exists |
| npm provenance | Links each published version to the commit and workflow that built it |
| Vercel | Hosts Storybook, redeploys on every push to `main` |

## Security tooling

| Tool / setting | Purpose |
|---|---|
| pnpm lifecycle script blocking | Dependencies cannot run install scripts unless allowlisted |
| pnpm minimum release age | New dependency versions are not installed until they are a few days old |
| `pnpm audit --prod` | Fails CI on high-severity advisories in runtime dependencies |
| Dependabot | Weekly grouped updates for npm packages and GitHub Actions |
| CodeQL | Static analysis for JavaScript / TypeScript |
| SHA-pinned actions | Third-party GitHub Actions cannot change under us |

See [SECURITY.md](./SECURITY.md) and [docs/MAINTAINING.md](./docs/MAINTAINING.md).

## Why pnpm

- Blocks dependency lifecycle scripts by default, a common malware entry point.
- Supports a minimum release age for dependencies.
- Strict `node_modules` layout catches undeclared dependencies.
- Fast workspace support for the library plus playgrounds.

Consumers are not affected; they install the package with npm, pnpm, yarn or bun.

## Alternatives considered

| Option | Why not chosen |
|---|---|
| Copy-in components (shadcn-vue model) | Fixes would need to be copied into every project by hand. A versioned package updates all projects with one command |
| Plain CSS + CSS variables | More portable, but slower to write and a second styling system next to Tailwind |
| Building interactive components from scratch | High risk of accessibility and keyboard bugs; Reka UI already solves them |
| Histoire | Vue-native and lighter, but smaller ecosystem and less recognised than Storybook |
| VitePress docs site | Closer to mui.com, but more setup. Can be added after 1.0 |
| GitHub Packages (private) | Requires auth tokens in every consuming project; public npm is simpler and visible in a portfolio |
| Nuxt module at launch | Extra setup before the API is stable; planned after v0.4 |

## Platform notes

Primary development machine is Windows 11 on ARM64 (Snapdragon X).

- Node.js has native `win32-arm64` builds.
- Tailwind v4's engine, lightningcss, esbuild and rollup ship `win32-arm64` binaries. If an install fails on ARM64, report it rather than swapping the tool.
- All repo scripts are written in Node, not shell, so they run in PowerShell, Git Bash and CI Linux runners.
- `.gitattributes` forces LF line endings.
- CI runs on Linux plus a Windows job (x64) to catch Windows-specific breakage.
