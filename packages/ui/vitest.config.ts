import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.test.ts', 'src/**/*.stories.ts'],
      thresholds: {
        // docs/COMPONENT-GUIDELINES.md: components stay at or above 80% lines and branches
        'src/components/**': { lines: 80, branches: 80 },
      },
    },
  },
})
