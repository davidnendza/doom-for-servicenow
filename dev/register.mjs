// node --import ./dev/register.mjs ...  makes the server TypeScript and the Fluent files runnable in plain Node.
import { register } from 'node:module'

register('./hooks.mjs', import.meta.url)
globalThis.Now = {
    ID: new Proxy({}, { get: (_, key) => String(key) }),
    include: (path) => `/* included from ${path} */`,
    attach: (path) => `/* attached ${path} */`,
    ref: (table, key) => `${table}:${JSON.stringify(key)}`,
}
