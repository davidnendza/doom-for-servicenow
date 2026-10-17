// Boots the in-memory "platform": loads the real Fluent sources (tables, business rules, REST API,
// properties, seed data) and the real server handlers, and dispatches HTTP-shaped calls to them.
import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { db, gs, newId, resetData, setUser, tableRows } from './mock-glide.mjs'
import { registry } from './mock-fluent.mjs'
import { ServiceError } from './mock-ws-err.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fluentDir = join(root, 'src', 'fluent')

export const USERS = {
    marine: { id: 'u_marine', name: 'Dev Marine', user_name: 'dev.marine' },
    isabella: { id: 'u_isabella', name: 'Isabella Hellwalker', user_name: 'isabella' },
    mallory: { id: 'u_mallory', name: 'Mallory Cheater', user_name: 'mallory' },
}

function* fluentFiles(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) {
            if (entry.name !== 'generated') yield* fluentFiles(path)
        } else if (entry.name.endsWith('.now.ts') && entry.name !== 'ui-pages.now.ts') {
            yield path // ui-pages imports .html, which only the SDK bundler understands
        }
    }
}

let routes = []

function seedUsers() {
    for (const u of Object.values(USERS)) {
        tableRows('sys_user').set(u.id, { sys_id: u.id, name: u.name, user_name: u.user_name })
    }
}

function seedRecords() {
    for (const { table, data } of registry.records) {
        if (table !== 'x_417611_doom_achievement') continue
        const row = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]))
        row.sys_id = newId()
        tableRows(table).set(row.sys_id, row)
    }
}

export async function boot() {
    for (const file of fluentFiles(fluentDir)) await import(pathToFileURL(file).href)

    for (const table of registry.tables) db.schema.set(table.name, table)
    db.businessRules.push(...registry.businessRules)
    for (const p of registry.properties) db.properties.set(p.name, p.value)

    const api = registry.restApis.find((a) => a.serviceId === 'doom')
    routes = api.routes.map((route) => ({
        method: route.method,
        pattern: new RegExp('^/api/x_417611_doom/doom' + route.path.replace(/\{(\w+)\}/g, '(?<$1>[^/]+)') + '$'),
        script: route.script,
    }))
    resetData()
    seedUsers()
    seedRecords()
}

export function reset() {
    resetData()
    seedUsers()
    seedRecords()
    for (const p of registry.properties) db.properties.set(p.name, p.value)
}

/** Dispatches one REST call as the given user, like the platform would for a Scripted REST API. */
export function handle({ method, path, query = {}, body, user = 'marine' }) {
    const route = routes.find((r) => r.method === method && r.pattern.test(path))
    if (!route) return { status: 404, body: { error: { message: `No route for ${method} ${path}` } } }
    setUser(USERS[user].id)

    const pathParams = route.pattern.exec(path).groups ?? {}
    const request = {
        body: { dataString: body === undefined ? '' : JSON.stringify(body) },
        pathParams,
        queryParams: query,
        uri: path,
    }
    const response = { status: 200, body: undefined }
    response.setStatus = (code) => (response.status = code)
    // Like the platform, wrap the body in { result: ... }.
    response.setBody = (value) => (response.body = { result: JSON.parse(JSON.stringify(value)) })
    response.setError = (error) => {
        if (!(error instanceof ServiceError)) throw new Error('setError expects a ServiceError')
        response.status = error.status
        response.body = { error: { message: error.message, detail: error.detail }, status: 'failure' }
    }
    route.script(request, response)
    return { status: response.status, body: response.body }
}

export { db, gs, tableRows }
