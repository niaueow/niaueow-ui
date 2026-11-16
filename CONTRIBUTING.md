# Contributing

## Prerequisites

- Node.js LTS (version in `.nvmrc`). On Windows ARM64, install the native `arm64` build (`nvm install <version> arm64`), not x64.
- pnpm (version in the root `package.json` `packageManager` field). Install that exact version globally with its install script allowed, so its native binary is linked:
  ```bash
  npm install -g pnpm@<version> --allow-scripts=pnpm
  ```
  A global pnpm 11 older than 11.28.4 that switches itself to the pinned version leaves a broken shim on Windows ([pnpm#16594](https://github.com/pnpm/pnpm/issues/16594)).
- Git

Works on Windows (including ARM64), macOS and Linux. All scripts are Node-based, so PowerShell and Git Bash both work.

## Setup

```bash
git clone https://github.com/niaueow/niaueow-ui.git
cd niaueow-ui
pnpm install
```

## Commands

Run from the repo root.

| Command | What it does |
|---|---|
| `pnpm lint` / `pnpm format` | Lint / format |
| `pnpm typecheck` | Type-check all packages |
| `pnpm test` | Unit, interaction and a11y tests with coverage |
| `pnpm build` | Build the library to `packages/ui/dist` |
| `pnpm check:package` | publint + arethetypeswrong on the built package |
| `pnpm changeset` | Record a change for the next release |
| `pnpm verify` | Everything CI runs, in the same order |
| `pnpm tokens` | Regenerate `tokens.css` from the Figma export (added in M2) |
| `pnpm tokens:contrast` | Check WCAG contrast of semantic color pairs (added in M2) |
| `pnpm storybook` | Start Storybook at http://localhost:6006 (added in M3) |
| `pnpm build-storybook` | Build static Storybook (added in M3) |
| `pnpm dev:vue` | Run the Vite + Vue playground (added in a later milestone) |
| `pnpm dev:nuxt` | Run the Nuxt playground (added in a later milestone) |
| `pnpm new <Name>` | Scaffold a new component (added in M5) |

Run `pnpm verify` before opening a pull request.

## Workflow

1. Create a branch from `main`: `feat/avatar`, `fix/button-focus`, `docs/theming`.
2. Make your change. For a new component, follow [docs/ADDING-A-COMPONENT.md](./docs/ADDING-A-COMPONENT.md).
3. Add a changeset if the published package changes:
   ```bash
   pnpm changeset
   ```
   Choose the bump per the [versioning policy](./ROADMAP.md#versioning-policy) and write a one-line summary for the changelog.
4. Commit with [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:`, `refactor:`.
5. Open a pull request and fill in the template. CI must pass before merging.

## What reviewers check

- Follows [docs/COMPONENT-GUIDELINES.md](./docs/COMPONENT-GUIDELINES.md)
- Matches Figma in every variant, size and state, light and dark
- No hardcoded design values; tokens only
- Stories and tests cover every variant and state
- No new runtime dependency without justification
- Changeset included when the package changes

## Changing design tokens

Never edit `packages/ui/src/styles/tokens.css` by hand; it is generated. See [docs/TOKENS.md](./docs/TOKENS.md).
