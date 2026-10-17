import { pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const mocks = {
    '@servicenow/glide': join(here, 'mock-glide.mjs'),
    '@servicenow/glide/sn_ws_err': join(here, 'mock-ws-err.mjs'),
    '@servicenow/sdk/core': join(here, 'mock-fluent.mjs'),
}

export async function resolve(specifier, context, nextResolve) {
    if (mocks[specifier]) return { url: pathToFileURL(mocks[specifier]).href, shortCircuit: true }
    try {
        return await nextResolve(specifier, context)
    } catch (error) {
        // The sources use extensionless relative imports (resolved by the Now SDK bundler).
        if (specifier.startsWith('.') && error?.code === 'ERR_MODULE_NOT_FOUND') {
            return nextResolve(`${specifier}.ts`, context)
        }
        throw error
    }
}
