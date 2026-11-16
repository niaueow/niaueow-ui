import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

// Every dependency and peer stays external, including subpaths like `vue/server-renderer`.
const externalPackages = [
  ...Object.keys((pkg as { dependencies?: Record<string, string> }).dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies),
]
const isExternal = (id: string) =>
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`))

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rolldownOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    // styles.css is copied by scripts/copy-assets.mjs, unprocessed
    copyPublicDir: false,
  },
})
