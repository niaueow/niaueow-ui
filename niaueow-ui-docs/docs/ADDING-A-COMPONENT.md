# Adding a Component

Two paths produce the same result. Both end with `pnpm verify` passing.

## Before you start

1. The component exists in Figma with all variants, sizes and states (default, hover, focus, disabled, plus loading/invalid if relevant), in Light and Dark.
2. Every value in the Figma component uses a variable from the Semantic collection. If it uses a raw value or a variable that has no token yet, fix Figma and [update tokens](./TOKENS.md#updating-tokens-after-a-figma-change) first.
3. Copy the Figma node link (right-click the component set, **Copy link to selection**).
4. Decide whether a Reka UI primitive applies. Check https://reka-ui.com for anything with overlays, menus, focus management or keyboard navigation.

## Path A: with Claude Code (recommended)

In Claude Code, from the repo root:

```
Add a component: Avatar
Figma: https://www.figma.com/design/<file>/...?node-id=123-456
```

The `add-component` skill (`.claude/skills/add-component/SKILL.md`) will:

1. Run `pnpm new Avatar`.
2. Read the Figma node through the Figma MCP server: design context, variables and a screenshot.
3. Stop and report if Figma uses a variable with no matching token.
4. Use a Reka UI primitive if one applies.
5. Implement the component per [COMPONENT-GUIDELINES.md](./COMPONENT-GUIDELINES.md).
6. Write stories and tests.
7. Run `pnpm verify` and fix failures.
8. Fill in the changeset and summarize what it built and any Figma gaps.

Then you review: compare Storybook against Figma in both modes, read the diff, and commit.

## Path B: by hand

### 1. Scaffold

```bash
pnpm new Avatar
```

Creates:

```
src/components/avatar/
├─ NAvatar.vue
├─ avatar.variants.ts
├─ NAvatar.stories.ts
├─ NAvatar.test.ts
└─ index.ts
```

and also:
- adds `export * from './components/avatar'` to `src/index.ts`
- registers `NAvatar` in `src/plugin.ts`
- creates a changeset stub `feat: add NAvatar`

The name must be PascalCase (`/^[A-Z][A-Za-z0-9]{1,40}$/`). The script refuses to overwrite an existing folder.

### 2. Define variants

In `avatar.variants.ts`, mirror the Figma variant properties:

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export const avatarVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type AvatarVariants = VariantProps<typeof avatarVariants>
```

### 3. Build the component

Follow [COMPONENT-GUIDELINES.md](./COMPONENT-GUIDELINES.md): typed props, `class` merged via `cn()`, `data-slot`, tokens only, accessible markup.

### 4. Stories

Every variant, size and state, a matrix story, dark mode check, a play function.

### 5. Tests

Cover the list in the guidelines, including an axe check.

### 6. Playgrounds

Add the component to `playgrounds/vue` and `playgrounds/nuxt`.

### 7. Changeset

Edit the generated changeset if the summary needs more detail.

### 8. Verify

```bash
pnpm verify
```

### 9. Open a pull request

Use the PR template checklist.

## After merge

The component ships with the next release. See [MAINTAINING.md](./MAINTAINING.md#releasing).
