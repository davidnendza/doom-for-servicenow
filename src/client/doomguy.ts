// Doomguy: a toggleable marine that roams the ServiceNow UI.
//
// This module is loaded into the *top* browser window (see the global UI Script), because the
// classic UI replaces its content frame on every navigation while the top window persists. Frames
// that load register themselves through attachFrame() so their keystrokes reach the marine.
// Sprites and sounds are decoded from the shareware WAD the first time the marine is switched on.
import { gunzipB64 } from './lib/b64'
import { getDoomguy, sendDoomguyTelemetry, setDoomguy, setDoomguyMode, setTokenProvider, type DoomguyMode } from './lib/api'
import { Autopilot, type AutoTarget, type Intent, type Point } from './lib/autopilot'
import { ElementTargets, rayBox, type ElementEntry } from './lib/elements'
import { Monsters, SPECS, type Monster, type MonsterKind } from './lib/monsters'
import { initSettingsPage } from './lib/settings-page'
import { decodeSound, loadSpriteSet, Wad, type Sound, type Sprite } from './lib/wad'

const ENTRY_URL = '/uxasset/externals/x_417611_doom/doomguy.jsdbx'

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
const SCAN_MS = 600
const FIRST_MONSTER_MS = 3500
const GRAVITY = 900
const DEATH_FRAMES = 'HIJKLMN'
/** Screen sector (0 = right, then clockwise in 45 degree steps) to the sprite rotation facing that way. */
const ROTATION_BY_SECTOR = [7, 8, 1, 2, 3, 4, 5, 6]
const IGNORE_FRAMES = /x_417611_doom_play\.do/

interface Assets {
    marine: Map<string, Sprite>
    puff: Map<string, Sprite>
    fog: Map<string, Sprite>
    explosion: Map<string, Sprite>
    monsters: Partial<Record<MonsterKind, Map<string, Sprite>>>
    sounds: Record<string, Sound>
}

interface Effect {
    sprites: Sprite[]
    x: number
    y: number
    start: number
    frameMs: number
    scale?: number
}

/** A flying scrap of a blasted element: one of its letters, or a spark. */
interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    born: number
    life: number
    rot: number
    vr: number
    text: string
    color: string
    size: number
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
    readonly mode: DoomguyMode
    setEnabled(value: boolean): Promise<void>
    toggle(): Promise<boolean>
    setMode(mode: DoomguyMode): void
    toggleMode(): DoomguyMode
    attachFrame(win: Window): void
    onChange(listener: (enabled: boolean) => void): () => void
    stats(): { steps: number; shots: number; kills: number; blasts: number }
}

type HostWindow = Window & {
    __xDoomGuy?: DoomguyController
    __xDoomFrames?: Window[]
    __xDoomLoading?: boolean
    g_ck?: string
}

type Phase = 'hidden' | 'arriving' | 'alive' | 'dying'

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
        explode: 'DSBAREXP',
        pain: 'DSPOPAIN',
        impSight: 'DSBGSIT1',
        impDeath: 'DSBGDTH1',
        zombieSight: 'DSPOSIT1',
        zombieDeath: 'DSPODTH1',
    })) {
        const data = wad.get(lump)
        const sound = data && decodeSound(data)
        if (sound) sounds[key] = sound
    }
    return {
        marine: loadSpriteSet(wad, 'PLAY', palette),
        puff: loadSpriteSet(wad, 'PUFF', palette),
        fog: loadSpriteSet(wad, 'TFOG', palette),
        explosion: loadSpriteSet(wad, 'BEXP', palette),
        monsters: {
            imp: loadSpriteSet(wad, SPECS.imp.prefix, palette),
            zombie: loadSpriteSet(wad, SPECS.zombie.prefix, palette),
        },
        sounds,
    }
}

const pick = (set: Map<string, Sprite>, frame: string, rotation: number): Sprite | undefined =>
    set.get(`${frame}${rotation}`) ?? set.get(`${frame}0`)

class Doomguy implements DoomguyController {
    enabled = false

    private phase: Phase = 'hidden'
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
    private phaseSince = 0
    private lastOof = 0
    private effects: Effect[] = []
    private tracers: Tracer[] = []
    private fxDirty = false

    /** auto: he roams, fights and blasts things himself; manual: only the keyboard moves him. */
    mode: DoomguyMode = 'auto'
    private readonly autopilot = new Autopilot()
    private readonly elements = new ElementTargets(host)
    private readonly monsters = new Monsters()
    private particles: Particle[] = []
    private nextScan = 0
    private nextSpawn = 0
    private totalKills = 0
    private totalBlasts = 0

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
                if (pref.mode === 'auto' || pref.mode === 'manual') this.mode = pref.mode
                if (pref.enabled) await this.setEnabled(true, false)
            })
            .catch(() => undefined)
    }

    onChange(listener: (enabled: boolean) => void): () => void {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    stats(): { steps: number; shots: number; kills: number; blasts: number } {
        return { steps: this.totalSteps, shots: this.totalShots, kills: this.totalKills, blasts: this.totalBlasts }
    }

    setMode(mode: DoomguyMode, persist = true): void {
        if (mode === this.mode) return
        this.mode = mode
        for (const listener of this.listeners) listener(this.enabled)
        if (persist) setDoomguyMode(mode).catch(() => undefined)
        this.autopilot.reset(performance.now())
        if (mode === 'manual') {
            this.vanishMonsters()
            this.toast('DOOMGUY: MANUAL  (WASD / arrows, Space fires, Ctrl+Alt+M for autopilot)')
        } else {
            this.nextSpawn = performance.now() + FIRST_MONSTER_MS
            this.toast('DOOMGUY: AUTOPILOT  (Ctrl+Alt+M for manual)')
        }
    }

    toggleMode(): DoomguyMode {
        this.setMode(this.mode === 'auto' ? 'manual' : 'auto')
        return this.mode
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
            this.toast(
                `DOOMGUY: ON, ${this.mode === 'auto' ? 'AUTOPILOT' : 'MANUAL'}  (Ctrl+Alt+M switches, Ctrl+Alt+D dismisses)`
            )
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
            console.warn('[x_417611_doom] doomguy assets failed to load', error)
            return
        }
        if (!this.enabled || this.phase === 'arriving' || this.phase === 'alive') return

        this.mount()
        this.x = Math.max(120, host.innerWidth - 200)
        this.y = Math.max(160, host.innerHeight - 48)
        this.sector = 2
        this.setPhase('arriving')
        this.effects.push({
            sprites: [...'ABCDEFGHIJ'].map((f) => assets.fog.get(`${f}0`)).filter((s): s is Sprite => !!s),
            x: this.x,
            y: this.y,
            start: performance.now(),
            frameMs: 70,
        })
        this.play('teleport')
        this.lastTime = performance.now()
        this.autopilot.reset(this.lastTime)
        this.nextSpawn = this.lastTime + FIRST_MONSTER_MS
        this.nextScan = 0
        host.requestAnimationFrame(this.tick)
        this.telemetryTimer ??= host.setInterval(() => this.flushTelemetry(false), TELEMETRY_MS)
    }

    private depart(): void {
        if (this.phase === 'hidden') return
        this.keys.clear()
        this.flushTelemetry(false)
        this.elements.restoreAll()
        this.monsters.clear()
        this.particles = []
        this.setPhase('dying')
        this.play('death')
    }

    /** Monsters leave the way they came: in a puff of teleport fog. */
    private vanishMonsters(): void {
        const fog = this.assets && [...'ABCDEFGHIJ'].map((f) => this.assets!.fog.get(`${f}0`)).filter((s): s is Sprite => !!s)
        const now = performance.now()
        if (fog) {
            for (const m of this.monsters.monsters) this.effects.push({ sprites: fog, x: m.x, y: m.y, start: now, frameMs: 70 })
        }
        this.monsters.clear()
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
        this.particles = []
        this.setPhase('hidden')
    }

    private setPhase(phase: Phase): void {
        this.phase = phase
        this.phaseSince = performance.now()
        if (this.root) this.root.dataset.mode = phase
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
        if (event.ctrlKey && event.altKey && event.code === 'KeyM') {
            event.preventDefault()
            event.stopPropagation()
            if (!event.repeat) this.toggleMode()
            return
        }
        if (this.phase !== 'alive' && this.phase !== 'arriving') return
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
        if (this.phase === 'hidden' || !this.marineCanvas) return
        const dt = Math.min(0.05, (now - this.lastTime) / 1000)
        this.lastTime = now

        if (this.phase === 'arriving' && now - this.phaseSince > 560) this.setPhase('alive')
        if (this.phase === 'dying' && now - this.phaseSince > DEATH_FRAMES.length * 130 + 1400) {
            this.unmount()
            return
        }

        let moving = false
        if (this.phase === 'alive') {
            this.updateWorld(now, dt)
            const intent = this.decide(now)
            moving = this.move(dt, intent)
            this.shoot(now, intent)
        }
        this.walkClock = moving ? this.walkClock + dt * 1000 : 0
        this.drawMarine(now, moving)
        this.drawFx(now)
        host.requestAnimationFrame(this.tick)
    }

    /** Autopilot decides, unless the player is on the keys (or has switched autopilot off). */
    private decide(now: number): Intent {
        const held = (...codes: string[]): number => (codes.some((c) => this.keys.has(c)) ? 1 : 0)
        const manual: Intent = {
            dx: held('ArrowRight', 'KeyD') - held('ArrowLeft', 'KeyA'),
            dy: held('ArrowDown', 'KeyS') - held('ArrowUp', 'KeyW'),
            run: this.keys.has('Run'),
            fire: this.keys.has('Fire'),
            aim: null,
        }
        const onTheKeys = manual.dx !== 0 || manual.dy !== 0 || manual.fire
        if (this.mode !== 'auto' || onTheKeys) {
            this.autopilot.reset(now) // let go cleanly; it picks something new when the keys are released
            return manual
        }
        return this.autopilot.update(now, { x: this.x, y: this.y }, this.autoTargets(), this.bounds())
    }

    private bounds(): { minX: number; maxX: number; minY: number; maxY: number } {
        const margin = (ANCHOR_X * SCALE) / 2
        return {
            minX: margin,
            maxX: host.innerWidth - margin,
            minY: ANCHOR_Y * SCALE * 0.7,
            maxY: host.innerHeight - 6,
        }
    }

    private autoTargets(): AutoTarget[] {
        return [...this.monsters.targets(), ...this.elements.list().map((e) => e.target)]
    }

    // ---- the world around him: things to shoot, things that fall apart --------------------------

    private updateWorld(now: number, dt: number): void {
        if (now >= this.nextScan) {
            this.nextScan = now + SCAN_MS
            this.elements.scan(host.__xDoomFrames ?? [], IGNORE_FRAMES, now)
        }
        for (const spot of this.elements.restoreDue(now)) this.fog(spot.x, spot.y, now)

        if (this.mode === 'auto') {
            if (now >= this.nextSpawn && this.monsters.canSpawn()) {
                const monster = this.monsters.spawn(this.bounds(), now)
                this.fog(monster.x, monster.y, now)
                this.play(SPECS[monster.kind].sight)
                this.nextSpawn = now + 7000 + Math.random() * 8000
            }
            this.monsters.update(now, dt, { x: this.x, y: this.y }, this.bounds())
        }
        this.particles = this.particles.filter((p) => now - p.born < p.life)
    }

    private fog(x: number, y: number, now: number): void {
        const sprites = [...'ABCDEFGHIJ'].map((f) => this.assets?.fog.get(`${f}0`)).filter((s): s is Sprite => !!s)
        if (sprites.length) this.effects.push({ sprites, x, y, start: now, frameMs: 70 })
    }

    /** First thing a ray from (x, y) heading (dx, dy) runs into, within `range`. */
    private rayHit(
        x: number,
        y: number,
        dx: number,
        dy: number,
        range: number,
        now: number
    ): { distance: number; monster?: Monster; element?: ElementEntry } | null {
        let best: { distance: number; monster?: Monster; element?: ElementEntry } | null = null
        for (const monster of this.monsters.alive) {
            const d = this.monsters.rayHit(monster, x, y, dx, dy)
            if (d !== null && d <= range && (!best || d < best.distance)) best = { distance: d, monster }
        }
        for (const element of this.elements.list()) {
            const box = this.elements.box(element, now)
            const d = box ? rayBox(x, y, dx, dy, box) : null
            if (d !== null && d <= range && (!best || d < best.distance)) best = { distance: d, element }
        }
        return best
    }

    private blast(element: ElementEntry, now: number): void {
        const gone = this.elements.damage(element, now)
        if (!gone || !this.assets) return
        this.totalBlasts += 1
        this.play('explode')
        const sprites = [...'ABCDE'].map((f) => this.assets!.explosion.get(`${f}0`)).filter((s): s is Sprite => !!s)
        if (sprites.length) this.effects.push({ sprites, x: gone.center.x, y: gone.center.y + 28, start: now, frameMs: 80, scale: 1 })
        // The letters fly apart, with a few sparks.
        const letters = [...gone.text.replace(/\s+/g, '')].slice(0, 14)
        for (const ch of letters) this.particle(gone.center, now, ch, gone.color, 14)
        for (const color of ['#ffd23c', '#ff7a1a', '#ff7a1a', '#b32017', '#b32017', '#555', '#555', '#ffd23c']) {
            this.particle(gone.center, now, '', color, 5)
        }
    }

    private particle(from: Point, now: number, text: string, color: string, size: number): void {
        const angle = Math.random() * Math.PI * 2
        const speed = 120 + Math.random() * 320
        this.particles.push({
            x: from.x + (Math.random() - 0.5) * 20,
            y: from.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 220,
            born: now,
            life: 900 + Math.random() * 700,
            rot: Math.random() * 6,
            vr: (Math.random() - 0.5) * 14,
            text,
            color,
            size,
        })
    }

    private hitMonster(monster: Monster, now: number): void {
        const result = this.monsters.hit(monster, now)
        if (result === 'pain') {
            this.play('pain')
            return
        }
        this.totalKills += 1
        this.play(SPECS[monster.kind].dies)
    }

    // ---- movement and shooting ----------------------------------------------------------------

    private move(dt: number, intent: Intent): boolean {
        const { dx, dy } = intent
        if (dx === 0 && dy === 0) {
            // Standing and shooting something: turn to face it.
            if (intent.aim) {
                this.sector = (Math.round(Math.atan2(intent.aim.y - (this.y - 46), intent.aim.x - this.x) / (Math.PI / 4)) + 8) % 8
            }
            return false
        }

        const length = Math.hypot(dx, dy)
        const speed = intent.run ? RUN_SPEED : WALK_SPEED
        const nx = this.x + (dx / length) * speed * dt
        const ny = this.y + (dy / length) * speed * dt
        const bounds = this.bounds()
        const cx = Math.min(bounds.maxX, Math.max(bounds.minX, nx))
        const cy = Math.min(bounds.maxY, Math.max(bounds.minY, ny))
        if ((cx !== nx || cy !== ny) && this.mode === 'manual' && performance.now() - this.lastOof > 700) {
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

    private shoot(now: number, intent: Intent): void {
        if (!intent.fire || now < this.nextShot || !this.assets) return
        this.nextShot = now + FIRE_COOLDOWN_MS
        this.fireStart = now
        this.pendingShots += 1
        this.totalShots += 1
        this.play('pistol')

        const facing = (this.sector * Math.PI) / 4
        const x1 = this.x + Math.cos(facing) * 22
        const y1 = this.y - 46 + Math.sin(facing) * 12
        // Autopilot aims at its target (with a little wobble); the keyboard fires along the facing.
        const angle = intent.aim ? Math.atan2(intent.aim.y - y1, intent.aim.x - x1) + (Math.random() - 0.5) * 0.05 : facing
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)

        let reach = SHOT_RANGE
        for (let d = 30; d < SHOT_RANGE; d += 8) {
            const px = x1 + dx * d
            const py = y1 + dy * d
            if (px < 0 || py < 0 || px > host.innerWidth || py > host.innerHeight) {
                reach = d
                break
            }
        }
        const hit = this.rayHit(x1, y1, dx, dy, reach, now)
        if (hit) reach = hit.distance
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
        if (hit?.monster) this.hitMonster(hit.monster, now + 40)
        if (hit?.element) this.blast(hit.element, now + 40)
    }

    // ---- drawing ------------------------------------------------------------------------------

    private drawMarine(now: number, moving: boolean): void {
        const canvas = this.marineCanvas!
        const assets = this.assets!
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, CELL, CELL)

        let sprite: Sprite | undefined
        let frame = 'A'
        if (this.phase === 'arriving') {
            sprite = undefined // hidden inside the teleport fog
        } else if (this.phase === 'dying') {
            const index = Math.min(DEATH_FRAMES.length - 1, Math.floor((now - this.phaseSince) / 130))
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
            this.phase === 'dying'
                ? Math.min(1, Math.max(0, (now - this.phaseSince - DEATH_FRAMES.length * 130 - 600) / 800))
                : 0
        canvas.style.opacity = String(1 - fade)
        canvas.style.transform = `translate(${Math.round(this.x - ANCHOR_X * SCALE)}px, ${Math.round(this.y - ANCHOR_Y * SCALE)}px)`

        const root = this.root!
        root.dataset.x = String(Math.round(this.x))
        root.dataset.y = String(Math.round(this.y))
        root.dataset.sector = String(this.sector)
        root.dataset.frame = this.phase === 'arriving' ? '-' : frame
        root.dataset.rotation = String(ROTATION_BY_SECTOR[this.sector])
    }

    private drawFx(now: number): void {
        const canvas = this.fxCanvas!
        const active =
            this.effects.length > 0 || this.tracers.length > 0 || this.particles.length > 0 || this.monsters.monsters.length > 0
        if (!active && !this.fxDirty) return
        this.fxDirty = false
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.imageSmoothingEnabled = false

        this.monsters.draw(ctx, now, this.assets?.monsters ?? {}, SCALE)

        this.effects = this.effects.filter((effect) => {
            const index = Math.floor((now - effect.start) / effect.frameMs)
            if (index >= effect.sprites.length) return false
            if (index < 0) return true
            const sprite = effect.sprites[index]!
            const scale = effect.scale ?? SCALE
            ctx.drawImage(
                sprite.image,
                Math.round(effect.x - sprite.left * scale),
                Math.round(effect.y - sprite.top * scale),
                sprite.width * scale,
                sprite.height * scale
            )
            return true
        })

        this.drawParticles(ctx, now)

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
        this.fxDirty = active && this.effects.length === 0 && this.tracers.length === 0 && this.monsters.monsters.length === 0
    }

    private drawParticles(ctx: CanvasRenderingContext2D, now: number): void {
        const dt = 1 / 60 // close enough for a handful of scraps; keeps the update inside the draw pass
        for (const p of this.particles) {
            p.vy += GRAVITY * dt
            p.x += p.vx * dt
            p.y += p.vy * dt
            p.rot += p.vr * dt
            ctx.globalAlpha = Math.max(0, Math.min(1, (p.life - (now - p.born)) / 400))
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rot)
            if (p.text) {
                ctx.fillStyle = p.color
                ctx.font = `bold ${p.size}px ui-monospace, Menlo, Consolas, monospace`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(p.text, 0, 0)
            } else {
                ctx.fillStyle = p.color
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
            }
            ctx.restore()
        }
        ctx.globalAlpha = 1
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

// The settings page (x_417611_doom_doomguy.do) shares this entry so the global UI Script has one stable asset to load.
const settingsRoot = document.getElementById('doomguy-settings')
if (settingsRoot) void initSettingsPage(settingsRoot, getController)
