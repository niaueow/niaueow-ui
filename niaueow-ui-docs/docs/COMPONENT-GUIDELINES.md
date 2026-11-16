# Component Guidelines

Every component in `@niaueow/ui` follows these rules. Reviewers and automated checks enforce them.

## Source of truth

- **Figma defines** variants, sizes, states, spacing and colors. Variant and size names in code match Figma exactly.
- If Figma is missing something code needs (a focus state, a disabled state, an error state), raise it and add it to Figma first. Do not invent it in code.

## File structure

```
src/components/<kebab-name>/
├─ N<Name>.vue
├─ <kebab-name>.variants.ts
├─ N<Name>.stories.ts
├─ N<Name>.test.ts
└─ index.ts
```

`index.ts` exports the component and its prop types. The component is re-exported from `src/index.ts` and registered in `src/plugin.ts`. `pnpm new <Name>` does all of this.

## Naming

- Component: `N` + PascalCase (`NButton`, `NDropdownMenu`).
- Sub-components: `N<Parent><Part>` (`NCardHeader`, `NDialogContent`).
- Props interface: `N<Name>Props`.
- Variant prop values: lowercase, from Figma (`primary`, `ghost`, `sm`, `lg`).

## API rules

- `<script setup lang="ts">` with typed `defineProps`, `defineEmits`, `defineSlots`.
- Export the props interface so consumers get autocomplete.
- Use `defineModel` for `v-model`.
- Accept a `class` prop and merge it with `cn()` so consumer classes win conflicts.
- Forward remaining attributes to the root element.
- Support `as` / `asChild` (Reka UI `Primitive`) where rendering as another element makes sense, for example a button rendered as a link.
- Sensible defaults: the most common variant and `md` size need no props.
- Composition over configuration: prefer slots and sub-components (`NCardHeader`) to large prop lists.
- No breaking prop changes without a changeset that says so.

## Styling rules

- Tailwind utilities that map to tokens only: `bg-primary`, `text-muted-foreground`, `rounded-md`.
- **Never** hardcoded values: no hex/rgb/oklch, no arbitrary values like `bg-[#123456]` or `p-[13px]`, no Tailwind palette colors like `bg-blue-600` in component code.
- Variants live in `<name>.variants.ts`, not inline in the template.
- Dark mode works through tokens. Components should almost never need `dark:` classes; if one does, the token set is probably missing something.
- Add `data-slot="<name>"` on the root and key parts, plus `data-state` / `data-disabled` where relevant.

## Behaviour and accessibility

Target: WCAG 2.2 AA.

- Native elements first: `<button type="button">`, `<input>`, `<a href>`.
- Interactive components with complex behaviour (Dialog, Dropdown, Select, Tabs, Tooltip, Toast) wrap Reka UI primitives. Do not re-implement focus trapping or keyboard handling Reka provides.
- Visible focus with `focus-visible:` and the `--n-ring` token. Never remove outlines without a replacement.
- Everything usable with keyboard alone.
- Disabled uses the native `disabled` attribute where possible. Loading sets `aria-busy="true"` and blocks interaction.
- Form controls support `aria-invalid`, `aria-describedby`, `disabled`, `readonly`, and work with `<label for>`.
- Icon-only controls require an accessible name (`aria-label` prop, enforced in types where practical).
- Respect `prefers-reduced-motion` with `motion-safe:` / `motion-reduce:`.
- Minimum target size 24×24 CSS px (WCAG 2.5.8).

## SSR

- No `window`, `document` or `localStorage` access at module scope or during setup. Use `onMounted` when browser APIs are needed.
- Use `useId()` for generated ids.

## Security

- No `v-html`, no rendering HTML strings from props (`vue/no-v-html` is an ESLint error).
- No `eval`, `new Function`, or resolving components from strings.
- No new runtime dependencies without written justification.

## Stories (required)

- Autodocs enabled.
- One story per variant, one per size, and a matrix story showing all combinations.
- State stories: disabled, loading, invalid, focus (where applicable).
- Dark mode verified with the themes toolbar.
- A play function testing the main interaction.
- Zero a11y addon violations.

## Tests (required)

Each component test file covers:

- renders each variant and size with the expected classes or data attributes
- props reach the DOM (attributes, ARIA)
- emitted events
- `v-model` updates
- disabled / loading block interaction
- keyboard interaction
- `class` prop merges and overrides
- axe check passes

Coverage for `src/components` stays at or above 80% lines and branches.

## Definition of done

- [ ] Matches Figma in every variant, size and state, light and dark
- [ ] Tokens only; no hardcoded design values
- [ ] Exported from `src/index.ts` and registered in `src/plugin.ts`
- [ ] Stories complete, zero a11y violations
- [ ] Tests complete, coverage threshold met
- [ ] Shown in both playgrounds
- [ ] Changeset added
- [ ] `pnpm verify` passes
