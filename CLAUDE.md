# CLAUDE.md

Guidance for Claude Code sessions in this repository. Read this first, then the doc relevant to your task.

## Project

`@niaueow/ui`: a themeable Vue 3 component library built from the niaueow Figma design system. Tailwind CSS v4 for styling, Reka UI for interactive primitives, published to npm as ESM. Consumers rebrand by overriding `--n-*` CSS variables.

## Docs map

| Task | Read |
|---|---|
| Tools and why | `TECHSTACK.md` |
| Repo layout, build, exports | `docs/ARCHITECTURE.md` |
| Token pipeline | `docs/TOKENS.md` |
| Theming contract | `docs/THEMING.md` |
| Component rules | `docs/COMPONENT-GUIDELINES.md` |
| Adding a component | `docs/ADDING-A-COMPONENT.md` and `.claude/skills/add-component/SKILL.md` |
| Releases and settings | `docs/MAINTAINING.md` |
| Release plan | `ROADMAP.md` |

## Commands

```bash
pnpm install          # install (frozen lockfile in CI)
pnpm storybook        # Storybook dev server
pnpm dev:vue          # Vue playground
pnpm dev:nuxt         # Nuxt playground
pnpm tokens           # regenerate src/styles/tokens.css from Figma export
pnpm tokens:contrast  # WCAG contrast check on semantic pairs
pnpm new <Name>       # scaffold a component
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check:package    # publint + attw
pnpm verify           # everything CI runs; must pass before you finish
```

## Hard rules

1. **Never** run `npm publish`, `pnpm publish`, `git push`, or create npm tokens. Never change GitHub, npm or Vercel settings. Write instructions in `docs/MAINTAINING.md` instead.
2. **Never** read, print or commit `.env*` files or any secret.
3. **Never** edit `packages/ui/src/styles/tokens.css` by hand. Change the Figma export and run `pnpm tokens`.
4. **No hardcoded design values** in components: no hex/rgb/oklch, no arbitrary Tailwind values, no Tailwind palette colors. Tokens only.
5. **No `v-html`**, `eval`, `new Function`, or string-resolved components.
6. **No new runtime dependency** beyond `reka-ui`, the variant library, `tailwind-merge`, `clsx` without asking.
7. **Figma is the source of truth.** If Figma is missing a variant, state or token, ask. Do not invent design.
8. **Verify tooling against current docs** before configuring Tailwind v4, Storybook, Reka UI, pnpm, Changesets or npm publishing. Do not rely on memory for fast-moving APIs.
9. Run `pnpm verify` before saying work is done, and report the result.
10. Use Conventional Commits.

## Conventions (summary)

- Component `N<Name>`, folder `src/components/<kebab-name>/`, files: `N<Name>.vue`, `<kebab-name>.variants.ts`, `N<Name>.stories.ts`, `N<Name>.test.ts`, `index.ts`.
- `<script setup lang="ts">`, exported `N<Name>Props`, `defineModel` for v-model, `class` prop merged with `cn()`, `data-slot` on root.
- Interactive behaviour wraps Reka UI.
- SSR safe: no browser globals in setup; `useId()` for ids.
- Every variant, size and state has a story and a test, including an axe check.

Full rules: `docs/COMPONENT-GUIDELINES.md`.

## Theming contract (summary)

- Primitives: `--n-<color>-<step>`, no utilities.
- Semantic: `--n-primary`, `--n-foreground`, ... on `:root` (light) and `.dark` (dark), inside `@layer base`.
- `@theme inline` maps semantic variables to Tailwind keys (`--color-primary: var(--n-primary)`).
- Dark variant: `@custom-variant dark (&:where(.dark, .dark *));`
- `styles.css` includes `@source` for the built components.

Full contract: `docs/THEMING.md`.

## Environment

The maintainer develops on Windows 11 ARM64 in PowerShell. Your shell may be Git Bash. All `package.json` scripts must be Node-based and cross-platform; no bash-only commands.

## Rule 1 — Think Before Coding
State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

## Rule 2 — Simplicity First
Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

## Rule 3 — Surgical Changes
Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting.
Don't refactor what isn't broken. Match existing style.

## Rule 4 — Goal-Driven Execution
Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.