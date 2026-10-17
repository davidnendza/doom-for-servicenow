// Doomguy: a toggleable marine that roams the ServiceNow UI.
//
// This module is loaded into the *top* browser window (see the global UI Script), because the
// classic UI replaces its content frame on every navigation while the top window persists. Frames
// that load register themselves through attachFrame() so their keystrokes reach the marine.
// Sprites and sounds are decoded from the shareware WAD the first time the marine is switched on.
import { gunzipB64 } from './lib/b64'
import { getDoomguy, sendDoomguyTelemetry, setDoomguy, setTokenProvider } from './lib/api'
import { initSettingsPage } from './lib/settings-page'
import { decodeSound, loadSpriteSet, Wad, type Sound, type Sprite } from './lib/wad'

const ENTRY_URL = '/uxasset/externals/x_doom/doomguy.jsdbx'

const SCALE = 2
const CELL = 96 // natural pixel size of the marine canvas
const ANCHOR_X = 48
const ANCHOR_Y = 80
const WALK_SPEED = 230 // px per second
const RUN_SPEED = 400
const FRAME_MS = 110
const FIRE_FLASH_MS = 120
const FIRE_COOLDOWN_MS = 280
const SHOT_RANGE = 520
const STEP_PX = 40
const TELEMETRY_MS = 20000
const DEATH_FRAMES = 'HIJKLMN'
/** Screen sector (0 = right, then clockwise in 45 degree steps) to the sprite rotation facing that way. */
const ROTATION_BY_SECTOR = [7, 8, 1, 2, 3, 4, 5, 6]
const IGNORE_FRAMES = /x_doom_play\.do/

interface Assets {
    marine: Map<string, Sprite>
    puff: Map<string, Sprite>
    fog: Map<string, Sprite>
    sounds: Record<string, Sound>
}

interface Effect {
    sprites: Sprite[]
    x: number
    y: number
    start: number
    frameMs: number
}

interface Tracer {
    x1: number
    y1: number
    x2: number
    y2: number
    until: number
}

export interface DoomguyController {
    readonly enabled: boolean
    setEnabled(value: boolean): Promise<void>
    toggle(): Promise<boolean>
    attachFrame(win: Window): void
    onChange(listener: (enabled: boolean) => void): () => void
    stats(): { steps: number; shots: number }
}

type HostWindow = Window & {
    __xDoomGuy?: DoomguyController
    __xDoomFrames?: Window[]
    __xDoomLoading?: boolean
    g_ck?: string
}

type Mode = 'hidden' | 'arriving' | 'alive' | 'dying'

function resolveHost(): HostWindow {
    try {
        void window.top!.document
        return window.top as HostWindow
    } catch {
        return window as HostWindow
    }
}

const host = resolveHost()

function isEditable(target: EventTarget | null): boolean {
    const el = target as HTMLElement | null
    if (!el || !el.tagName) return false
    const role = el.getAttribute('role')
    return (
        el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        el.tagName === 'SELECT' ||
        el.isContentEditable ||
        role === 'textbox' ||
        role === 'combobox' ||
        role === 'searchbox'
    )
}

function isClickable(target: EventTarget | null): boolean {
    const el = target as HTMLElement | null
    if (!el || !el.tagName) return false
    return (
        el.tagName === 'BUTTON' ||
        el.tagName === 'A' ||
        el.tagName === 'SUMMARY' ||
        el.getAttribute('role') === 'button'
    )
}

async function loadAssets(): Promise<Assets> {
    const { default: b64 } = await import('./generated/game-wad')
    const wad = new Wad(await gunzipB64(b64))
    const palette = wad.get('PLAYPAL')!.subarray(0, 768)
    const sounds: Record<string, Sound> = {}
    for (const [key, lump] of Object.entries({
        pistol: 'DSPISTOL',
        teleport: 'DSTELEPT',
        death: 'DSPLDETH',
        oof: 'DSOOF',
    })) {
        const data = wad.get(lump)
        const sound = data && decodeSound(data)
        if (sound) sounds[key] = sound
    }
    return {
        marine: loadSpriteSet(wad, 'PLAY', palette),
        puff: loadSpriteSet(wad, 'PUFF', palette),
        fog: loadSpriteSet(wad, 'TFOG', palette),
        sounds,
    }
}

const pick = (set: Map<string, Sprite>, frame: string, rotation: number): Sprite | undefined =>
    set.get(`${frame}${rotation}`) ?? set.get(`${frame}0`)

class Doomguy implements DoomguyController {
    enabled = false

    private mode: Mode = 'hidden'
    private assets?: Assets
    private loading?: Promise<Assets>
    private root?: HTMLDivElement
    private marineCanvas?: HTMLCanvasElement
    private fxCanvas?: HTMLCanvasElement
    private toastEl?: HTMLDivElement
    private audio?: AudioContext
    private buffers: Record<string, AudioBuffer> = {}

    private x = 0
    private y = 0
    private sector = 2
    private readonly keys = new Set<string>()
    private lastTime = 0
    private walkClock = 0
    private fireStart = -1e9
    private nextShot = 0
    private modeSince = 0
    private lastOof = 0
    private effects: Effect[] = []
    private tracers: Tracer[] = []
    private fxDirty = false

    private stepFraction = 0
    private pendingSteps = 0
    private pendingShots = 0
    private totalSteps = 0
    private totalShots = 0
    private telemetryTimer?: number

    private readonly attached = new WeakSet<Document>()
    private readonly listeners = new Set<(enabled: boolean) => void>()

    attachFrame(win: Window): void {
        try {
            const doc = win.document
            if (this.attached.has(doc)) return
            this.attached.add(doc)
            win.addEventListener('keydown', (e) => this.onKeyDown(e, win), true)
            win.addEventListener('keyup', (e) => this.onKeyUp(e), true)
            win.addEventListener('blur', () => this.keys.clear())
        } catch {
            /* cross-origin frame */
        }
    }

    init(): void {
        setTokenProvider(() => this.findToken())
        this.attachFrame(window)
        for (const win of host.__xDoomFrames ?? []) this.attachFrame(win)
        host.addEventListener('pagehide', () => this.flushTelemetry(true))
        host.addEventListener('resize', () => this.resizeFx())
        getDoomguy()
            .then(async (pref) => {
                if (pref.enabled) await this.setEnabled(true, false)
            })
            .catch(() => undefined)
    }

    onChange(listener: (enabled: boolean) => void): () => void {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    stats(): { steps: number; shots: number } {
        return { steps: this.totalSteps, shots: this.totalShots }
    }

    toggle(): Promise<boolean> {
        return this.setEnabled(!this.enabled).then(() => this.enabled)
    }

    async setEnabled(value: boolean, persist = true): Promise<void> {
        if (value === this.enabled) return
        this.enabled = value
        for (const listener of this.listeners) listener(value)
        if (persist) setDoomguy(value).catch(() => undefined)
        if (value) {
            this.toast('DOOMGUY: ON  (Ctrl+Alt+D to dismiss)')
            await this.arrive()
        } else {
            this.toast('DOOMGUY: OFF')
            this.depart()
        }
    }

    // ---- lifecycle ----------------------------------------------------------------------------

    private async ensureAssets(): Promise<Assets> {
        if (this.assets) return this.assets
        this.loading ??= loadAssets().then((assets) => (this.assets = assets))
        return this.loading
    }

    private async arrive(): Promise<void> {
        let assets: Assets
        try {
            assets = await this.ensureAssets()
        } catch (error) {
            this.enabled = false
            this.toast('DOOMGUY: could not load the WAD')
            console.warn('[x_doom] doomguy assets failed to load', error)
            return
        }
        if (!this.enabled || this.mode === 'arriving' || this.mode === 'alive') return

        this.mount()
        this.x = Math.max(120, host.innerWidth - 200)
        this.y = Math.max(160, host.innerHeight - 48)
        this.sector = 2
        this.setMode('arriving')
        this.effects.push({
            sprites: [...'ABCDEFGHIJ'].map((f) => assets.fog.get(`${f}0`)).filter((s): s is Sprite => !!s),
            x: this.x,
            y: this.y,
            start: performance.now(),
            frameMs: 70,
        })
        this.play('teleport')
        this.lastTime = performance.now()
        host.requestAnimationFrame(this.tick)
        this.telemetryTimer ??= host.setInterval(() => this.flushTelemetry(false), TELEMETRY_MS)
    }

    private depart(): void {
        if (this.mode === 'hidden') return
        this.keys.clear()
        this.flushTelemetry(false)
        this.setMode('dying')
        this.play('death')
    }

    private mount(): void {
        if (this.root) return
        const doc = host.document
        const root = doc.createElement('div')
        root.id = 'x-doom-doomguy'
        root.setAttribute(
            'style',
            'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483000;pointer-events:none;'
        )

        const fx = doc.createElement('canvas')
        fx.setAttribute('style', 'position:fixed;left:0;top:0;pointer-events:none;image-rendering:pixelated;')
        const marine = doc.createElement('canvas')
        marine.width = CELL
        marine.height = CELL
        marine.setAttribute(
            'style',
            `position:fixed;left:0;top:0;width:${CELL * SCALE}px;height:${CELL * SCALE}px;pointer-events:none;image-rendering:pixelated;`
        )
        root.append(fx, marine)
        doc.body.appendChild(root)
        this.root = root
        this.fxCanvas = fx
        this.marineCanvas = marine
        this.resizeFx()
    }

    private unmount(): void {
        this.root?.remove()
        this.root = this.marineCanvas = this.fxCanvas = undefined
        this.effects = []
        this.tracers = []
        this.setMode('hidden')
    }

    private setMode(mode: Mode): void {
        this.mode = mode
        this.modeSince = performance.now()
        if (this.root) this.root.dataset.mode = mode
    }

    private resizeFx(): void {
        if (!this.fxCanvas) return
        this.fxCanvas.width = host.innerWidth
        this.fxCanvas.height = host.innerHeight
        this.fxDirty = true
    }

    // ---- input --------------------------------------------------------------------------------

    private onKeyDown(event: KeyboardEvent, win: Window): void {
        if (event.ctrlKey && event.altKey && event.code === 'KeyD') {
            event.preventDefault()
            event.stopPropagation()
            if (!event.repeat) void this.toggle()
            return
        }
        if (this.mode !== 'alive' && this.mode !== 'arriving') return
        if (event.ctrlKey || event.metaKey || event.altKey) return
        const target = event.composedPath()[0] ?? event.target
        if (isEditable(target)) return
        try {
            if (IGNORE_FRAMES.test(win.location.pathname)) return
        } catch {
            /* ignore */
        }

        const code = event.code
        const handled = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS', 'KeyF']
        if (code === 'Space' && !isClickable(target)) {
            this.keys.add('Fire')
            event.preventDefault()
        } else if (handled.includes(code)) {
            this.keys.add(code === 'KeyF' ? 'Fire' : code)
            event.preventDefault()
        } else if (code === 'ShiftLeft' || code === 'ShiftRight') {
            this.keys.add('Run')
        }
        this.resumeAudio()
    }

    private onKeyUp(event: KeyboardEvent): void {
        const code = event.code
        if (code === 'Space' || code === 'KeyF') this.keys.delete('Fire')
        else if (code === 'ShiftLeft' || code === 'ShiftRight') this.keys.delete('Run')
        else this.keys.delete(code)
    }

    private findToken(): string | undefined {
        const candidates: Window[] = [window, host, ...(host.__xDoomFrames ?? [])]
        for (const win of candidates) {
            try {
                const token = (win as HostWindow).g_ck
                if (token) return token
            } catch {
                /* cross-origin */
            }
        }
        return undefined
    }

    // ---- main loop ----------------------------------------------------------------------------

    private readonly tick = (now: number): void => {
        if (this.mode === 'hidden' || !this.marineCanvas) return
        const dt = Math.min(0.05, (now - this.lastTime) / 1000)
        this.lastTime = now

        if (this.mode === 'arriving' && now - this.modeSince > 560) this.setMode('alive')
        if (this.mode === 'dying' && now - this.modeSince > DEATH_FRAMES.length * 130 + 1400) {
            this.unmount()
            return
        }

        const moving = this.mode === 'alive' ? this.move(dt) : false
        if (this.mode === 'alive') this.shoot(now)
        this.walkClock = moving ? this.walkClock + dt * 1000 : 0
        this.drawMarine(now, moving)
        this.drawFx(now)
        host.requestAnimationFrame(this.tick)
    }

    private move(dt: number): boolean {
        let dx = 0
        let dy = 0
        if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) dx -= 1
        if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) dx += 1
        if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) dy -= 1
        if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) dy += 1
        if (dx === 0 && dy === 0) return false

        const length = Math.hypot(dx, dy)
        const speed = this.keys.has('Run') ? RUN_SPEED : WALK_SPEED
        const nx = this.x + (dx / length) * speed * dt
        const ny = this.y + (dy / length) * speed * dt
        const minX = (ANCHOR_X * SCALE) / 2
        const maxX = host.innerWidth - minX
        const minY = ANCHOR_Y * SCALE * 0.7
        const maxY = host.innerHeight - 6
        const cx = Math.min(maxX, Math.max(minX, nx))
        const cy = Math.min(maxY, Math.max(minY, ny))
        if ((cx !== nx || cy !== ny) && performance.now() - this.lastOof > 700) {
            this.lastOof = performance.now()
            this.play('oof')
        }

        this.stepFraction += Math.hypot(cx - this.x, cy - this.y)
        const steps = Math.floor(this.stepFraction / STEP_PX)
        if (steps > 0) {
            this.stepFraction -= steps * STEP_PX
            this.pendingSteps += steps
            this.totalSteps += steps
        }
        this.x = cx
        this.y = cy
        this.sector = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8
        return true
    }

    private shoot(now: number): void {
        if (!this.keys.has('Fire') || now < this.nextShot || !this.assets) return
        this.nextShot = now + FIRE_COOLDOWN_MS
        this.fireStart = now
        this.pendingShots += 1
        this.totalShots += 1
        this.play('pistol')

        const angle = (this.sector * Math.PI) / 4
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)
        const x1 = this.x + dx * 22
        const y1 = this.y - 46 + dy * 12
        let reach = SHOT_RANGE
        for (let d = 30; d < SHOT_RANGE; d += 8) {
            const px = x1 + dx * d
            const py = y1 + dy * d
            if (px < 0 || py < 0 || px > host.innerWidth || py > host.innerHeight) {
                reach = d
                break
            }
        }
        const x2 = x1 + dx * reach
        const y2 = y1 + dy * reach
        this.tracers.push({ x1, y1, x2, y2, until: now + 70 })
        this.effects.push({
            sprites: [...'ABCD'].map((f) => this.assets!.puff.get(`${f}0`)).filter((s): s is Sprite => !!s),
            x: x2,
            y: y2 + 8,
            start: now + 40,
            frameMs: 70,
        })
    }

    // ---- drawing ------------------------------------------------------------------------------

    private drawMarine(now: number, moving: boolean): void {
        const canvas = this.marineCanvas!
        const assets = this.assets!
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, CELL, CELL)

        let sprite: Sprite | undefined
        let frame = 'A'
        if (this.mode === 'arriving') {
            sprite = undefined // hidden inside the teleport fog
        } else if (this.mode === 'dying') {
            const index = Math.min(DEATH_FRAMES.length - 1, Math.floor((now - this.modeSince) / 130))
            frame = DEATH_FRAMES[index]!
            sprite = pick(assets.marine, frame, 0)
        } else {
            const rotation = ROTATION_BY_SECTOR[this.sector]!
            const sinceShot = now - this.fireStart
            if (sinceShot < FIRE_FLASH_MS) frame = 'F'
            else if (sinceShot < FIRE_FLASH_MS + 90) frame = 'G'
            else if (moving) frame = 'ABCD'[Math.floor(this.walkClock / FRAME_MS) % 4]!
            sprite = pick(assets.marine, frame, rotation)
        }

        if (sprite) ctx.drawImage(sprite.image, ANCHOR_X - sprite.left, ANCHOR_Y - sprite.top)

        // Fade the corpse out before removing it.
        const fade =
            this.mode === 'dying'
                ? Math.min(1, Math.max(0, (now - this.modeSince - DEATH_FRAMES.length * 130 - 600) / 800))
                : 0
        canvas.style.opacity = String(1 - fade)
        canvas.style.transform = `translate(${Math.round(this.x - ANCHOR_X * SCALE)}px, ${Math.round(this.y - ANCHOR_Y * SCALE)}px)`

        const root = this.root!
        root.dataset.x = String(Math.round(this.x))
        root.dataset.y = String(Math.round(this.y))
        root.dataset.sector = String(this.sector)
        root.dataset.frame = this.mode === 'arriving' ? '-' : frame
        root.dataset.rotation = String(ROTATION_BY_SECTOR[this.sector])
    }

    private drawFx(now: number): void {
        const canvas = this.fxCanvas!
        const active = this.effects.length > 0 || this.tracers.length > 0
        if (!active && !this.fxDirty) return
        this.fxDirty = false
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.imageSmoothingEnabled = false

        this.effects = this.effects.filter((effect) => {
            const index = Math.floor((now - effect.start) / effect.frameMs)
            if (index >= effect.sprites.length) return false
            if (index < 0) return true
            const sprite = effect.sprites[index]!
            ctx.drawImage(
                sprite.image,
                Math.round(effect.x - sprite.left * SCALE),
                Math.round(effect.y - sprite.top * SCALE),
                sprite.width * SCALE,
                sprite.height * SCALE
            )
            return true
        })

        this.tracers = this.tracers.filter((tracer) => {
            if (now > tracer.until) return false
            ctx.strokeStyle = 'rgba(255, 224, 120, 0.9)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(tracer.x1, tracer.y1)
            ctx.lineTo(tracer.x2, tracer.y2)
            ctx.stroke()
            return true
        })
        // Leave one more pass to wipe the final frame, but only if there was something to wipe.
        this.fxDirty = active && this.effects.length === 0 && this.tracers.length === 0
    }

    // ---- audio, toast, telemetry --------------------------------------------------------------

    private resumeAudio(): void {
        if (!this.audio) {
            try {
                // This module runs in the top window, so its own AudioContext is the right one.
                this.audio = new AudioContext()
            } catch {
                return
            }
        }
        const audio = this.audio
        if (audio.state === 'suspended') void audio.resume()
    }

    private play(name: string): void {
        this.resumeAudio()
        const ctx = this.audio
        const sound = this.assets?.sounds[name]
        if (!ctx || !sound) return
        let buffer = this.buffers[name]
        if (!buffer) {
            buffer = ctx.createBuffer(1, sound.samples.length, sound.rate)
            buffer.copyToChannel(sound.samples, 0)
            this.buffers[name] = buffer
        }
        const source = ctx.createBufferSource()
        const gain = ctx.createGain()
        gain.gain.value = 0.5
        source.buffer = buffer
        source.connect(gain).connect(ctx.destination)
        source.start()
    }

    private toast(text: string): void {
        const doc = host.document
        if (!this.toastEl) {
            const el = doc.createElement('div')
            el.setAttribute(
                'style',
                'position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:2147483001;pointer-events:none;' +
                    'background:#1f1a17;color:#ffb199;border:1px solid #c8281e;padding:6px 14px;border-radius:3px;' +
                    'font:12px ui-monospace,Menlo,Consolas,monospace;letter-spacing:1px;transition:opacity .3s;'
            )
            el.id = 'x-doom-doomguy-toast'
            doc.body.appendChild(el)
            this.toastEl = el
        }
        const el = this.toastEl
        el.textContent = text
        el.style.opacity = '1'
        host.clearTimeout(Number(el.dataset.timer))
        el.dataset.timer = String(host.setTimeout(() => (el.style.opacity = '0'), 2200))
    }

    private flushTelemetry(unloading: boolean): void {
        if (this.pendingSteps === 0 && this.pendingShots === 0) return
        const steps = this.pendingSteps
        const shots = this.pendingShots
        this.pendingSteps = 0
        this.pendingShots = 0
        sendDoomguyTelemetry(steps, shots).catch(() => {
            if (!unloading) {
                this.pendingSteps += steps
                this.pendingShots += shots
            }
        })
    }
}

// Boot the controller exactly once, in the top window.
if (window === host && !host.__xDoomGuy) {
    const controller = new Doomguy()
    host.__xDoomGuy = controller
    controller.init()
}

/**
 * Returns the shared controller. When called from a content frame (for instance the settings
 * page) it first asks the top window to load this module, so there is only ever one marine.
 */
export async function getController(): Promise<DoomguyController> {
    if (host.__xDoomGuy) return host.__xDoomGuy
    if (!host.__xDoomLoading) {
        host.__xDoomLoading = true
        const script = host.document.createElement('script')
        script.type = 'module'
        script.src = ENTRY_URL
        host.document.head.appendChild(script)
    }
    for (let i = 0; i < 100; i += 1) {
        if (host.__xDoomGuy) return host.__xDoomGuy
        await new Promise((resolve) => setTimeout(resolve, 100))
    }
    throw new Error('Doomguy could not be loaded into the top window')
}

// The settings page (x_doom_doomguy.do) shares this entry so the global UI Script has one stable asset to load.
const settingsRoot = document.getElementById('doomguy-settings')
if (settingsRoot) void initSettingsPage(settingsRoot, getController)
