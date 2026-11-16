import type { App, Component, Plugin } from 'vue'

// Every public component, keyed by its registered name.
// `pnpm new <Name>` adds entries here, e.g. `NButton,`.
const components: Record<string, Component> = {}

const NiaueowUI: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

export default NiaueowUI
