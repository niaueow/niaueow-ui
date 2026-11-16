// PostToolUse hook: formats a file with Prettier after Claude Code edits or writes it.
// Reads the hook JSON from stdin. Never fails the tool call: always exits 0.
import { readFile, writeFile } from 'node:fs/promises'
import { isAbsolute, relative, resolve } from 'node:path'

const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd())

try {
  let input = ''
  for await (const chunk of process.stdin) input += chunk
  const filePath = JSON.parse(input)?.tool_input?.file_path
  if (typeof filePath !== 'string') process.exit(0)

  const file = resolve(projectDir, filePath)
  const rel = relative(projectDir, file)
  // Only files inside this repository
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) process.exit(0)

  const prettier = await import('prettier')
  // Only the root config and ignore file are used. Resolving config from the edited file's
  // folder would let a nested prettier config load plugins, i.e. run arbitrary code.
  const info = await prettier.getFileInfo(file, {
    ignorePath: resolve(projectDir, '.prettierignore'),
    resolveConfig: false,
  })
  if (info.ignored || !info.inferredParser) process.exit(0)

  const source = await readFile(file, 'utf8')
  const options =
    (await prettier.resolveConfig(file, {
      config: resolve(projectDir, '.prettierrc.json'),
      editorconfig: false,
    })) ?? {}
  const formatted = await prettier.format(source, { ...options, filepath: file })
  if (formatted !== source) await writeFile(file, formatted)
} catch {
  // Prettier not installed yet, unparsable file, etc. Leave the file as written.
}
process.exit(0)
