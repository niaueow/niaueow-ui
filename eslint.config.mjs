import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  globalIgnores([
    '**/dist/**',
    '**/coverage/**',
    '**/storybook-static/**',
    '**/.nuxt/**',
    '**/.output/**',
  ]),

  js.configs.recommended,
  tseslint.configs.recommended,
  pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },

  {
    // Library source runs in the browser (and SSR). Declaring browser globals also lets
    // no-implied-eval recognise setTimeout/setInterval with string arguments.
    files: ['packages/*/src/**'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    files: ['**/*.mjs', 'scripts/**', 'packages/*/scripts/**', '**/*.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    rules: {
      // Security rules from CLAUDE.md and SECURITY.md
      'vue/no-v-html': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error', // also catches Function(...) without `new`
    },
  },

  // Last: turn off rules that conflict with Prettier
  eslintConfigPrettier,
)
