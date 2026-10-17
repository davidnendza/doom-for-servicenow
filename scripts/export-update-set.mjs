// Turns the app that is installed on an instance into a single update set XML file, so people can install
// it without the Now SDK (System Update Sets > Retrieved Update Sets > Import Update Set from XML).
//
// Steps this automates, after you have installed the build on the instance with `now-sdk install`:
//   1. On the instance, open the app (System Applications > Studio, or sys_app.list) and use the related link
//      "Publish to Update Set...". That packs every application file into a completed update set.
//   2. Run this script. It finds that update set, downloads its records over the REST/XML interfaces using the
//      credential you already stored with `now-sdk auth`, and writes release/<scope>-<version>.update-set.xml in
//      the format "Import Update Set from XML" expects.
//
// Usage:  node scripts/export-update-set.mjs --auth <alias> [--set <update set sys_id>] [--out release]
//
// The credential is read straight from `now-sdk auth --print` into request headers; it is never printed.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const arg = (name) => {
    const i = args.indexOf(`--${name}`)
    return i >= 0 ? args[i + 1] : undefined
}

const alias = arg('auth')
if (!alias) {
    console.error('Usage: node scripts/export-update-set.mjs --auth <alias> [--set <sys_id>] [--out release]')
    process.exit(1)
}

const config = JSON.parse(readFileSync(join(root, 'now.config.json'), 'utf8'))
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const scope = config.scope
const appName = config.name
const version = pkg.version
const outDir = resolve(root, arg('out') ?? 'release')

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const sdk = (...a) => execFileSync(npx, ['@servicenow/sdk', ...a], { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' })

// Instance host for the alias, from `now-sdk auth --list`.
const listing = sdk('auth', '--list')
const block = listing.split(/\n(?=\*?\[)/).find((b) => b.replace(/^\*/, '').startsWith(`[${alias}]`))
const host = block && /host\s*=\s*(\S+)/.exec(block)?.[1]
if (!host) throw new Error(`No credential called "${alias}" (see: npx @servicenow/sdk auth --list)`)

const headers = {}
for (const line of sdk('auth', '--print', alias, '--format', 'headers').split(/\r?\n/)) {
    const m = /^([A-Za-z-]+):\s*(.+)$/.exec(line.trim())
    if (m) headers[m[1]] = m[2]
}
if (!headers.Authorization) throw new Error('Could not obtain a credential for ' + alias)

async function get(path, accept) {
    const res = await fetch(`${host}/${path}`, { headers: { ...headers, Accept: accept } })
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`)
    return res.text()
}

// 1. The completed update set that "Publish to Update Set..." produced.
let setId = arg('set')
if (!setId) {
    const q = encodeURIComponent(`application.scope=${scope}^state=complete^name!=Default^ORDERBYDESCsys_created_on`)
    const found = JSON.parse(await get(`api/now/table/sys_update_set?sysparm_query=${q}&sysparm_limit=1&sysparm_fields=sys_id,name`, 'application/json'))
    setId = found.result?.[0]?.sys_id
    if (!setId) throw new Error(`No completed update set for ${scope}. Use "Publish to Update Set..." on the app first.`)
}
const setXml = await get(`sys_update_set.do?XML&sys_id=${setId}`, 'application/xml')
const field = (xml, name) => {
    const m = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(xml)
    return m ? m[1] : ''
}
const appId = field(setXml, 'application')
const description = field(setXml, 'description')
const setName = `${appName} ${version}`

// 2. Every record in it.
const rowsXml = await get(`sys_update_xml_list.do?XML&sysparm_query=${encodeURIComponent(`update_set=${setId}`)}&sysparm_record_count=5000`, 'application/xml')
const rows = rowsXml.match(/<sys_update_xml>[\s\S]*?<\/sys_update_xml>/g) ?? []
if (rows.length === 0) throw new Error('The update set has no records')

// 3. Re-label them as the records of a retrievable ("remote") update set.
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const converted = rows.map((row) =>
    row
        .replace('<sys_update_xml>', '<sys_update_xml action="INSERT_OR_UPDATE">')
        .replace(`<application>${appId}</application>`, `<application display_value="${escapeAttr(appName)}">${appId}</application>`)
        .replace('<remote_update_set/>', `<remote_update_set display_value="${escapeAttr(setName)}">${setId}</remote_update_set>`)
        .replace(/<update_set>[^<]*<\/update_set>/, '<update_set display_value=""/>')
)

const stamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
const remote = `<sys_remote_update_set action="INSERT_OR_UPDATE">
<application display_value="${escapeAttr(appName)}">${appId}</application>
<application_name>${escapeAttr(appName)}</application_name>
<application_scope>${scope}</application_scope>
<application_version>${version}</application_version>
<collisions/>
<commit_date/>
<deleted/>
<description>${escapeAttr(description)}</description>
<inserted/>
<name>${escapeAttr(setName)}</name>
<origin_sys_id/>
<parent display_value=""/>
<release_date/>
<remote_base_update_set display_value=""/>
<remote_parent_id/>
<remote_sys_id>${setId}</remote_sys_id>
<state>loaded</state>
<summary/>
<sys_class_name>sys_remote_update_set</sys_class_name>
<sys_created_by>${field(setXml, 'sys_created_by') || 'admin'}</sys_created_by>
<sys_created_on>${stamp}</sys_created_on>
<sys_id>${setId}</sys_id>
<sys_mod_count>0</sys_mod_count>
<sys_updated_by>${field(setXml, 'sys_updated_by') || 'admin'}</sys_updated_by>
<sys_updated_on>${stamp}</sys_updated_on>
<update_set display_value=""/>
<update_source display_value=""/>
<updated/>
</sys_remote_update_set>
`

const xml = `<?xml version="1.0" encoding="UTF-8"?><unload unload_date="${stamp}">\n${remote}${converted.join('\n')}\n</unload>\n`
mkdirSync(outDir, { recursive: true })
const file = join(outDir, `${scope}-${version}.update-set.xml`)
writeFileSync(file, xml)
console.log(`${rows.length} records from update set ${setId} -> ${file} (${(xml.length / 1024 / 1024).toFixed(1)} MB)`)
