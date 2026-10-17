import { gunzipB64, textToBytes } from './b64'

export interface EngineOptions {
    canvas: HTMLCanvasElement
    /** 1 (I'm too young to die) .. 5 (Nightmare!) */
    skill: number
    episode: number
    map: number
    onExit?: (status: number) => void
}

export interface Engine {
    readonly exited: boolean
    /** Every line the engine has written to stdout so far. */
    readonly lines: string[]
    /**
     * Leaves the game the way a player would (F10, then Y), which makes the engine write its
     * end-of-level statistics. Resolves with all stdout lines once the engine has exited.
     */
    quit(): Promise<string[]>
}

interface DoomModule {
    noInitialRun: boolean
    wasmBinary: Uint8Array
    canvas: HTMLCanvasElement
    FS: { createDataFile(parent: string, name: string, data: Uint8Array, canRead: boolean, canWrite: boolean): void }
    print(text: string): void
    printErr(text: string): void
    preRun: Array<() => void>
    onRuntimeInitialized(): void
    onExit(status: number): void
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function pressKey(key: string, code: string, keyCode: number): void {
    for (const type of ['keydown', 'keyup']) {
        document.dispatchEvent(
            new KeyboardEvent(type, { key, code, keyCode, which: keyCode, bubbles: true, cancelable: true })
        )
    }
}

/**
 * Boots the Chocolate Doom WebAssembly build. The engine, glue script and shareware WAD are
 * generated modules (see scripts/fetch-doom-assets.mjs) that are only fetched once a player
 * actually starts a run.
 */
export async function startEngine(options: EngineOptions): Promise<Engine> {
    const [wasmModule, wadModule, glueModule, cfgModule] = await Promise.all([
        import('../generated/engine-wasm'),
        import('../generated/game-wad'),
        import('../generated/engine-glue'),
        import('../generated/game-cfg'),
    ])
    const [wasm, wad, glue] = await Promise.all([
        gunzipB64(wasmModule.default),
        gunzipB64(wadModule.default),
        gunzipB64(glueModule.default),
    ])

    const lines: string[] = []
    const state = { exited: false }
    let markExited: () => void = () => undefined
    const exitedPromise = new Promise<void>((resolve) => (markExited = resolve))

    const args = [
        '-iwad', 'doom1.wad',
        '-config', 'default.cfg',
        '-window',
        '-nogui',
        '-nomusic',
        '-nocheats',
        '-statdump', '-',
        '-warp', String(options.episode), String(options.map),
        '-skill', String(options.skill),
    ] // prettier-ignore

    const doom: DoomModule = {
        noInitialRun: true,
        wasmBinary: wasm,
        canvas: options.canvas,
        FS: undefined as unknown as DoomModule['FS'], // injected by the glue script
        print: (text) => lines.push(text),
        printErr: () => undefined,
        preRun: [
            () => {
                doom.FS.createDataFile('/', 'doom1.wad', wad, true, false)
                doom.FS.createDataFile('/', 'default.cfg', textToBytes(cfgModule.default), true, true)
            },
        ],
        onRuntimeInitialized: () => (window as unknown as { callMain(args: string[]): void }).callMain(args),
        onExit: (status) => {
            if (state.exited) return
            state.exited = true
            markExited()
            options.onExit?.(status)
        },
    }
    ;(window as unknown as { Module: DoomModule }).Module = doom

    // The Now SDK bundler prepends `window.process = { versions: null }` to every entry chunk.
    // Emscripten sniffs `typeof process.versions === 'object'` to detect Node and then reads
    // `process.versions.node`, which throws on null, so hide the shim while the glue evaluates.
    const shimmed = window as unknown as { process?: unknown }
    const savedProcess = shimmed.process
    shimmed.process = undefined
    try {
        const script = document.createElement('script')
        script.textContent = new TextDecoder().decode(glue)
        document.head.appendChild(script)
    } finally {
        shimmed.process = savedProcess
    }

    return {
        get exited() {
            return state.exited
        },
        lines,
        async quit() {
            // F10 only opens the quit prompt while the in-game menu is closed, so if a menu was
            // open the first attempt is a no-op: close it with Escape and try again.
            for (let attempt = 0; attempt < 6 && !state.exited; attempt += 1) {
                pressKey('F10', 'F10', 121)
                await sleep(250)
                pressKey('y', 'KeyY', 89)
                await Promise.race([exitedPromise, sleep(900)])
                if (!state.exited) {
                    pressKey('Escape', 'Escape', 27)
                    await sleep(250)
                }
            }
            await Promise.race([exitedPromise, sleep(3000)])
            return lines
        },
    }
}
