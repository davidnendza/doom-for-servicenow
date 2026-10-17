// Harmless sparring partners for autopilot mode: imps and zombiemen (sprites decoded from the WAD)
// that shuffle around the marine, snarl, and die when shot. They never hurt anything.
import type { AutoTarget, Bounds, Point } from './autopilot'
import type { Sprite } from './wad'

export type MonsterKind = 'imp' | 'zombie'
type State = 'walk' | 'attack' | 'pain' | 'dying' | 'dead'

interface Spec {
    prefix: string
    walk: string
    attack: string
    pain: string
    death: string
    gib: string
    hp: number
    speed: number
    sight: string
    dies: string
}

export const SPECS: Record<MonsterKind, Spec> = {
    imp: { prefix: 'TROO', walk: 'ABCD', attack: 'EFG', pain: 'H', death: 'IJKLM', gib: 'NOPQRSTU', hp: 3, speed: 70, sight: 'impSight', dies: 'impDeath' },
    zombie: { prefix: 'POSS', walk: 'ABCD', attack: 'EF', pain: 'G', death: 'HIJKL', gib: 'MNOPQRSTU', hp: 2, speed: 55, sight: 'zombieSight', dies: 'zombieDeath' },
}

export interface Monster {
    id: string
    kind: MonsterKind
    x: number
    y: number
    sector: number
    state: State
    hp: number
    since: number
    clock: number
    goal: Point
    gibbed: boolean
    removeAt: number
    target: AutoTarget
}

export type HitResult = 'pain' | 'killed' | 'gibbed'

const MAX_MONSTERS = 2
const CORPSE_MS = 7000
const FADE_MS = 1500
const BODY_HEIGHT = 40
const BODY_RADIUS = 30
const ROTATION_BY_SECTOR = [7, 8, 1, 2, 3, 4, 5, 6]

const sectorOf = (dx: number, dy: number): number => (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8
const pick = (set: Map<string, Sprite> | undefined, frame: string, rotation: number): Sprite | undefined =>
    set && (set.get(`${frame}${rotation}`) ?? set.get(`${frame}0`))

export class Monsters {
    monsters: Monster[] = []
    private counter = 0
    private readonly rng: () => number

    constructor(rng: () => number = Math.random) {
        this.rng = rng
    }

    get alive(): Monster[] {
        return this.monsters.filter((m) => m.state !== 'dying' && m.state !== 'dead')
    }

    canSpawn(): boolean {
        return this.alive.length < MAX_MONSTERS
    }

    spawn(bounds: Bounds, now: number): Monster {
        const kind: MonsterKind = this.rng() < 0.6 ? 'imp' : 'zombie'
        const fromLeft = this.rng() < 0.5
        const x = fromLeft ? bounds.minX + 40 : bounds.maxX - 40
        const y = bounds.minY + this.rng() * (bounds.maxY - bounds.minY)
        const monster: Monster = {
            id: `mon${(this.counter += 1)}`,
            kind,
            x,
            y,
            sector: fromLeft ? 0 : 4,
            state: 'walk',
            hp: SPECS[kind].hp,
            since: now,
            clock: 0,
            goal: { x, y },
            gibbed: false,
            removeAt: Infinity,
            target: undefined as unknown as AutoTarget,
        }
        monster.target = {
            id: monster.id,
            kind: 'monster',
            position: () => ({ x: monster.x, y: monster.y - BODY_HEIGHT }),
            alive: () => monster.state !== 'dying' && monster.state !== 'dead',
        }
        this.monsters.push(monster)
        return monster
    }

    targets(): AutoTarget[] {
        return this.alive.map((m) => m.target)
    }

    clear(): void {
        this.monsters = []
    }

    update(now: number, dt: number, marine: Point, bounds: Bounds): void {
        this.monsters = this.monsters.filter((m) => now < m.removeAt)
        for (const m of this.monsters) {
            m.clock += dt * 1000
            if (m.state === 'dying') {
                if (now - m.since > 1000) {
                    m.state = 'dead'
                    m.removeAt = now + CORPSE_MS
                }
                continue
            }
            if (m.state === 'dead') continue
            if (m.state === 'pain') {
                if (now - m.since > 280) this.setState(m, 'walk', now)
                continue
            }
            if (m.state === 'attack') {
                if (now - m.since > 1300) {
                    this.setState(m, 'walk', now)
                    m.goal = this.pickGoal(marine, bounds)
                }
                m.sector = sectorOf(marine.x - m.x, marine.y - m.y)
                continue
            }
            // walking
            const toMarine = Math.hypot(marine.x - m.x, marine.y - m.y)
            if (toMarine < 170 && this.rng() < dt * 0.9) {
                this.setState(m, 'attack', now)
                continue
            }
            const dx = m.goal.x - m.x
            const dy = m.goal.y - m.y
            const length = Math.hypot(dx, dy)
            if (length < 12) {
                m.goal = this.pickGoal(marine, bounds)
                continue
            }
            const speed = SPECS[m.kind].speed
            m.x += (dx / length) * speed * dt
            m.y += (dy / length) * speed * dt
            m.sector = sectorOf(dx, dy)
        }
    }

    /** Shot at: returns what happened so the caller can play sounds. */
    hit(m: Monster, now: number): HitResult {
        m.hp -= 1
        if (m.hp > 0) {
            this.setState(m, 'pain', now)
            return 'pain'
        }
        m.gibbed = this.rng() < 0.25
        this.setState(m, 'dying', now)
        return m.gibbed ? 'gibbed' : 'killed'
    }

    /** Distance along a ray (from x, y heading dx, dy) at which it hits this monster, or null. */
    rayHit(m: Monster, x: number, y: number, dx: number, dy: number): number | null {
        if (m.state === 'dying' || m.state === 'dead') return null
        const cx = m.x - x
        const cy = m.y - BODY_HEIGHT - y
        const along = cx * dx + cy * dy
        if (along < 0) return null
        const off = Math.abs(cx * dy - cy * dx)
        return off <= BODY_RADIUS ? Math.max(0, along - BODY_RADIUS * 0.5) : null
    }

    draw(ctx: CanvasRenderingContext2D, now: number, sets: Partial<Record<MonsterKind, Map<string, Sprite>>>, scale: number): void {
        for (const m of [...this.monsters].sort((a, b) => a.y - b.y)) {
            const spec = SPECS[m.kind]
            const rotation = ROTATION_BY_SECTOR[m.sector]!
            let frame: string
            if (m.state === 'walk') frame = spec.walk[Math.floor(m.clock / 170) % spec.walk.length]!
            else if (m.state === 'attack') frame = spec.attack[Math.floor((now - m.since) / 190) % spec.attack.length]!
            else if (m.state === 'pain') frame = spec.pain
            else {
                const frames = m.gibbed ? spec.gib : spec.death
                frame = frames[Math.min(frames.length - 1, Math.floor((now - m.since) / (m.gibbed ? 85 : 120)))]!
            }
            const sprite = pick(sets[m.kind], frame, rotation)
            if (!sprite) continue
            const fade = m.state === 'dead' ? Math.min(1, Math.max(0, (now - (m.removeAt - FADE_MS)) / FADE_MS)) : 0
            ctx.globalAlpha = 1 - fade
            ctx.drawImage(
                sprite.image,
                Math.round(m.x - sprite.left * scale),
                Math.round(m.y - sprite.top * scale),
                sprite.width * scale,
                sprite.height * scale
            )
        }
        ctx.globalAlpha = 1
    }

    private setState(m: Monster, state: State, now: number): void {
        m.state = state
        m.since = now
    }

    private pickGoal(marine: Point, bounds: Bounds): Point {
        const angle = this.rng() * Math.PI * 2
        const radius = 120 + this.rng() * 260
        return {
            x: Math.min(bounds.maxX, Math.max(bounds.minX, marine.x + Math.cos(angle) * radius)),
            y: Math.min(bounds.maxY, Math.max(bounds.minY, marine.y + Math.sin(angle) * radius * 0.6)),
        }
    }
}
