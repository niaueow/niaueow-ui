# Architecture

## How the pieces fit

```
Figma Variables
   │  export plugin
   ▼
tokens/figma/*.json ──► scripts/build-tokens.ts ──► src/styles/tokens.css (generated)
                                                        │
src/styles/index.css  (theme mapping, dark variant, @source)
                                                        │
src/components/*  (Vue SFCs using Tailwind utilities like bg-primary)
   │  Vite library build
   ▼
dist/  (ESM JS per module, .d.ts, styles.css)
   │  npm publish (CI, trusted publishing)
   ▼
Consumer app: @import "@niaueow/ui/styles.css" + import { NButton }
   │  consumer's Tailwind v4 compiles library classes + app classes together
   ▼
Final CSS in the consumer's bundle
```

The library never ships compiled Tailwind output. It ships source classes and theme directives, and the consumer's Tailwind build generates only the classes actually used.

## Repository layout

```
niaueow-ui/
├─ .changeset/                  Changesets config and pending changesets
├─ .claude/
│  ├─ settings.json             Claude Code permissions (deny publish, push, .env reads)
│  └─ skills/add-component/     Claude Code skill for adding components from Figma
├─ .github/
│  ├─ workflows/ci.yml          Checks on PRs and main
│  ├─ workflows/release.yml     Version PR + publish
│  ├─ workflows/codeql.yml      Static analysis
│  ├─ dependabot.yml
│  └─ pull_request_template.md
├─ docs/                        Project documentation
├─ packages/
│  └─ ui/                       The published package
│     ├─ .storybook/            Storybook config
│     ├─ scripts/               copy-assets.mjs, build-tokens.ts, check-contrast.ts, new-component.ts
│     ├─ tokens/figma/          Raw Figma export (input, committed)
│     ├─ stories/               MDX foundations pages
│     └─ src/
│        ├─ components/<name>/  One folder per component
│        ├─ styles/tokens.css   GENERATED
│        ├─ styles/index.css    Published as styles.css
│        ├─ utils/cn.ts
│        ├─ plugin.ts           Vue plugin (global registration)
│        └─ index.ts            Named exports
├─ playgrounds/
│  ├─ vue/                      Vite + Vue consumer app
│  └─ nuxt/                     Nuxt consumer app (SSR check)
├─ scripts/verify.mjs           `pnpm verify`: every CI check in order, stops at the first failure
├─ CLAUDE.md
├─ CONTRIBUTING.md
├─ README.md
├─ ROADMAP.md
├─ SECURITY.md
├─ TECHSTACK.md
├─ LICENSE
├─ pnpm-workspace.yaml
└─ package.json                 Root scripts, packageManager, engines
```

## Component folder

```
src/components/button/
├─ NButton.vue           Component
├─ button.variants.ts    Variant definitions (variant, size, ...)
├─ NButton.stories.ts    Storybook stories
├─ NButton.test.ts       Vitest tests
└─ index.ts              export { default as NButton } + types
```

## Styles

`src/styles/index.css` is the public stylesheet, published as `@niaueow/ui/styles.css`. Its responsibilities:

1. Import the generated `tokens.css` (primitives and semantic `--n-*` variables, in `@layer base`).
2. Declare the dark variant: `@custom-variant dark (&:where(.dark, .dark *));`
3. Map semantic variables to Tailwind theme keys with `@theme inline` so utilities like `bg-primary`, `rounded-md` and `font-sans` resolve to `--n-*` variables.
4. Point Tailwind at the built components with `@source`, so consumers do not have to configure scanning.

Details of the variable contract: [THEMING.md](./THEMING.md). How `tokens.css` is produced: [TOKENS.md](./TOKENS.md).

## Build output

```
dist/
├─ index.js                 Entry: named exports + default plugin
├─ index.d.ts
├─ plugin.js
├─ components/button/NButton.vue.js   (one module per source file)
├─ components/button/index.d.ts
├─ ...
└─ styles.css               Copy of index.css + tokens.css, directives intact
```

- ESM only.
- `preserveModules` keeps one output module per source file for tree-shaking.
- `vue`, `reka-ui`, `class-variance-authority`, `tailwind-merge` and `clsx` are external.
- `.d.ts` files are emitted by `vue-tsc` (`tsconfig.build.json`), one per module.
- `scripts/copy-assets.mjs` copies `src/styles/index.css` to `dist/styles.css` unprocessed, and copies the repo root `README.md` and `LICENSE` into `packages/ui/` so npm ships them. The copies are gitignored; the root files are the source.

## Package exports

```json
{
  "type": "module",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./styles.css": "./dist/styles.css",
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "peerDependencies": { "vue": "^3.5.0", "tailwindcss": "^4.0.0" }
}
```

A future `./nuxt` export will hold the Nuxt module.

## Public API

| Import | What you get |
|---|---|
| `import { NButton } from '@niaueow/ui'` | Single component, tree-shakeable |
| `import type { NButtonProps } from '@niaueow/ui'` | Prop types |
| `import NiaueowUI from '@niaueow/ui'` | Vue plugin; `app.use(NiaueowUI)` registers all components |
| `@import "@niaueow/ui/styles.css"` | Tokens, theme mapping, dark variant, source path |
| `--n-*` CSS variables | Theming surface |

Anything not listed here is internal and may change without notice.

## Playgrounds

`playgrounds/vue` and `playgrounds/nuxt` depend on the built package through the pnpm workspace. They show every component in light and dark mode with an overridden brand color. CI builds both, which proves:

- the published exports resolve
- `styles.css` works with a consumer Tailwind build
- components render under SSR (Nuxt)

## SSR

Components must not touch `window` or `document` during setup or at module scope, and use `useId()` for generated ids so server and client markup match.
