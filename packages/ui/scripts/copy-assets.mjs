// Copies files that ship with the package but are not built by Vite:
// - src/styles/index.css -> dist/styles.css, unprocessed, so Tailwind directives stay intact
// - the repo root README.md and LICENSE -> the package root, so npm includes them
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(pkgDir, '../..')

const copies = [
  [resolve(pkgDir, 'src/styles/index.css'), resolve(pkgDir, 'dist/styles.css')],
  [resolve(repoRoot, 'README.md'), resolve(pkgDir, 'README.md')],
  [resolve(repoRoot, 'LICENSE'), resolve(pkgDir, 'LICENSE')],
]

for (const [from, to] of copies) {
  mkdirSync(dirname(to), { recursive: true })
  copyFileSync(from, to)
  console.log(`copied ${from} -> ${to}`)
}
