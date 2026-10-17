// Re-targets the app at another instance by changing its scope everywhere it appears.
//
// ServiceNow only lets a scoped app use the vendor prefix of the instance it is built on, so the
// scope must be x_<company code>_doom. Find your instance's code with:
//   npx now-sdk query sys_properties -q "name=glide.appcreator.company.code" -f value -o json
//
// Usage:  node scripts/set-scope.mjs x_123456_doom [--dry-run]
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [next, ...flags] = process.argv.slice(2)
const dryRun = flags.includes('--dry-run')

if (!next || !/^x_[a-z0-9]+_[a-z0-9]+$/.test(next)) {
    console.error('Usage: node scripts/set-scope.mjs x_<company code>_doom [--dry-run]')
    process.exit(1)
}

const configPath = join(root, 'now.config.json')
const current = JSON.parse(readFileSync(configPath, 'utf8')).scope
if (current === next) {
    console.log(`Already ${next}; nothing to do.`)
    process.exit(0)
}

// Only files under version control, and never the lockfile or anything generated.
const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter((f) => f && f !== 'package-lock.json' && !/\.(mp4|png|jpg|gif)$/.test(f))

// Plain substitution on purpose: table, role, property and route names all start with the scope.
const escaped = current.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const pattern = new RegExp(escaped, 'g')

let changed = 0
let occurrences = 0
for (const file of files) {
    const path = join(root, file)
    let text
    try {
        text = readFileSync(path, 'utf8')
    } catch {
        continue
    }
    const hits = text.match(pattern)
    if (!hits) continue
    occurrences += hits.length
    changed += 1
    console.log(`${dryRun ? 'would change' : 'changed'} ${file} (${hits.length})`)
    if (!dryRun) writeFileSync(path, text.replace(pattern, next))
}
console.log(`${current} -> ${next}: ${occurrences} occurrences in ${changed} files${dryRun ? ' (dry run)' : ''}`)
