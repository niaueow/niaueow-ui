# Roadmap

Components are released in small batches so the full pipeline (tokens, build, docs, publish) is proven early and each batch can be used in real projects right away.

## Versioning policy

- **0.x:** a new component or a breaking change bumps the minor version (0.1 to 0.2). Fixes and non-breaking improvements bump the patch version. Breaking changes are called out at the top of the changelog entry.
- **1.0 and later:** strict semantic versioning.

## Releases

### v0.1 Foundations
- Workspace, tooling, CI, release pipeline
- Token pipeline (Figma export to CSS), contrast checker
- Theming contract, light and dark mode
- Storybook with foundations pages (colors, typography, radius and spacing, theming)
- Vue and Nuxt playgrounds
- Component generator and add-component workflow
- **Components:** NButton, NInput, NBadge, NCard

### v0.2 Layout
- NSidebar, NNavbar

### v0.3 Interactive
- NDialog, NDropdown, NSelect, NTabs (built on Reka UI)

### v0.4 Feedback
- NToast, NAlert, NTooltip

## After v0.4

Not scheduled. Order depends on what real projects need.

- Nuxt module with auto-import (`modules: ['@niaueow/ui/nuxt']`)
- Form components: NCheckbox, NRadioGroup, NSwitch, NTextarea, NField (label + hint + error)
- Data display: NAvatar, NTable, NSkeleton
- Icon package or icon integration
- Figma Code Connect (if the Figma plan supports it)
- Visual regression testing
- Dedicated docs website
- 1.0 release once the API has been stable across several projects
