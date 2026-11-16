// Runs every check CI runs, in the same order, and stops at the first failure.
// Later milestones add steps here.
import { spawnSync } from 'node:child_process'

// Commands are fixed strings. A shell is used so `pnpm` resolves on Windows (pnpm.cmd / pnpm.ps1).
const steps = [
  ['lint', 'pnpm lint'],
  ['typecheck', 'pnpm typecheck'],
  ['test', 'pnpm test'],
  ['build', 'pnpm build'],
  ['check:package', 'pnpm check:package'],
  ['audit', 'pnpm audit --prod --audit-level=high'],
]

for (const [name, command] of steps) {
  console.log(`\n> verify: ${name}`)
  const result = spawnSync(command, { stdio: 'inherit', shell: true })
  if (result.status !== 0) {
    console.error(`\nverify failed at step: ${name}`)
    process.exit(result.status ?? 1)
  }
}

console.log('\nverify: all steps passed')
