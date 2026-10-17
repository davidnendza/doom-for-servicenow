// The marine's brain for autopilot mode: wander, pick something to fight or blast, walk to a firing
// position, shoot it until it is gone, then wander again. Pure logic (no DOM) so it can be tested.

export interface Point {
    x: number
    y: number
}

export interface Bounds {
    minX: number
    maxX: number
    minY: number
    maxY: number
}

export interface AutoTarget {
    id: string
    kind: 'monster' | 'element' | 'pickup'
    /** Where it is right now (the marine's feet are at `y`, so aim a little above for monsters). */
    position(): Point
    alive(): boolean
}

export interface Intent {
    /** Walk direction, each -1..1 (not normalised). 0,0 means stand still. */
    dx: number
    dy: number
    run: boolean
    fire: boolean
    /** Where to point the gun, when something is being shot at. */
    aim: Point | null
}

type State = 'idle' | 'wander' | 'approach' | 'attack'

/** Default distance the marine stands from what he is shooting, in px (each weapon has its own). */
const STAND_OFF = 190
const ARRIVE = 16
/** A monster this close (px) interrupts whatever the marine was doing. */
const MONSTER_NOTICE = 700

const NO_INTENT: Intent = { dx: 0, dy: 0, run: false, fire: false, aim: null }

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

export class Autopilot {
    private state: State = 'idle'
    private until = 0
    private waypoint: Point | null = null
    private target: AutoTarget | null = null
    private attackEnds = 0
    private readonly rng: () => number
    private standOff = STAND_OFF

    constructor(rng: () => number = Math.random) {
        this.rng = rng
    }

    /** For tests and for logging. */
    current(): { state: string; target: string | null } {
        return { state: this.state, target: this.target ? this.target.id : null }
    }

    reset(now: number): void {
        this.state = 'idle'
        this.target = null
        this.waypoint = null
        this.until = now + 400
    }

    update(now: number, pos: Point, targets: AutoTarget[], bounds: Bounds, standOff: number = STAND_OFF): Intent {
        this.standOff = standOff
        if (this.target && !this.target.alive()) {
            this.target = null
            this.state = 'idle'
            this.until = now + this.between(250, 900)
        }

        // Fighting comes first: a monster in range pre-empts wandering and element-blasting.
        if (!this.target || this.target.kind !== 'monster') {
            const monster = this.nearest(pos, targets.filter((t) => t.kind === 'monster'), MONSTER_NOTICE)
            if (monster && (this.state === 'idle' || this.state === 'wander' || this.target)) {
                this.startApproach(monster, now)
            }
        }

        // Then loot: a weapon on the floor beats blasting links.
        if (!this.target || this.target.kind === 'element') {
            const loot = this.nearest(pos, targets.filter((t) => t.kind === 'pickup'), 1500)
            if (loot && (this.state === 'idle' || this.state === 'wander' || this.target)) this.startApproach(loot, now)
        }

        switch (this.state) {
            case 'idle':
                return this.idle(now, pos, targets, bounds)
            case 'wander':
                return this.wander(now, pos, bounds)
            case 'approach':
                return this.approach(now, pos, bounds)
            default:
                return this.attack(now, pos)
        }
    }

    private idle(now: number, pos: Point, targets: AutoTarget[], bounds: Bounds): Intent {
        if (now < this.until) return NO_INTENT
        const elements = targets.filter((t) => t.kind === 'element' && t.alive())
        if (elements.length > 0 && this.rng() < 0.65) {
            // Mostly go for something near, sometimes anything at all.
            const pool = this.rng() < 0.7 ? this.sortedByDistance(pos, elements).slice(0, 4) : elements
            this.startApproach(pool[Math.floor(this.rng() * pool.length)]!, now)
            return NO_INTENT
        }
        this.waypoint = {
            x: this.between(bounds.minX, bounds.maxX),
            y: this.between(bounds.minY, bounds.maxY),
        }
        this.state = 'wander'
        this.until = now + 7000
        return NO_INTENT
    }

    private wander(now: number, pos: Point, bounds: Bounds): Intent {
        const wp = this.waypoint
        if (!wp || now > this.until || Math.hypot(wp.x - pos.x, wp.y - pos.y) < ARRIVE) {
            this.state = 'idle'
            this.waypoint = null
            this.until = now + this.between(500, 2200)
            return NO_INTENT
        }
        const far = Math.hypot(wp.x - pos.x, wp.y - pos.y) > 420
        return this.walkTo(wp, pos, far, null, bounds)
    }

    private approach(now: number, pos: Point, bounds: Bounds): Intent {
        const target = this.target
        if (!target) {
            this.state = 'idle'
            return NO_INTENT
        }
        const where = target.position()
        const dist = Math.hypot(where.x - pos.x, where.y - pos.y)
        if (target.kind === 'pickup') {
            // Walk right onto it; the game picks it up and the target stops being alive.
            if (dist < ARRIVE) {
                this.target = null
                this.state = 'idle'
                this.until = now + 300
                return NO_INTENT
            }
            return this.walkTo(where, pos, dist > 300, null, bounds)
        }
        if (dist <= this.standOff + 40) {
            this.state = 'attack'
            this.attackEnds = now + (target.kind === 'monster' ? 9000 : this.between(2200, 4200))
            return NO_INTENT
        }
        // Walk to a spot STAND_OFF away from it, on our side.
        const stand = {
            x: clamp(where.x - ((where.x - pos.x) / dist) * this.standOff, bounds.minX, bounds.maxX),
            y: clamp(where.y - ((where.y - pos.y) / dist) * this.standOff, bounds.minY, bounds.maxY),
        }
        return this.walkTo(stand, pos, dist > 500, where, bounds)
    }

    private attack(now: number, pos: Point): Intent {
        const target = this.target
        if (!target || now > this.attackEnds) {
            this.target = null
            this.state = 'idle'
            this.until = now + this.between(500, 1600)
            return NO_INTENT
        }
        const where = target.position()
        if (Math.hypot(where.x - pos.x, where.y - pos.y) > this.standOff + 160) {
            this.state = 'approach'
            return NO_INTENT
        }
        return { dx: 0, dy: 0, run: false, fire: true, aim: where }
    }

    private walkTo(spot: Point, pos: Point, run: boolean, aim: Point | null, _bounds: Bounds): Intent {
        const dx = spot.x - pos.x
        const dy = spot.y - pos.y
        const length = Math.hypot(dx, dy)
        if (length < ARRIVE) return { dx: 0, dy: 0, run: false, fire: false, aim }
        return { dx: dx / length, dy: dy / length, run, fire: false, aim: null }
    }

    private startApproach(target: AutoTarget, now: number): void {
        this.target = target
        this.state = 'approach'
        this.waypoint = null
        this.until = now
    }

    private nearest(pos: Point, targets: AutoTarget[], within: number): AutoTarget | undefined {
        let best: AutoTarget | undefined
        let bestDist = within
        for (const t of targets) {
            if (!t.alive()) continue
            const p = t.position()
            const d = Math.hypot(p.x - pos.x, p.y - pos.y)
            if (d < bestDist) {
                best = t
                bestDist = d
            }
        }
        return best
    }

    private sortedByDistance(pos: Point, targets: AutoTarget[]): AutoTarget[] {
        const d = (t: AutoTarget): number => {
            const p = t.position()
            return Math.hypot(p.x - pos.x, p.y - pos.y)
        }
        return [...targets].sort((a, b) => d(a) - d(b))
    }

    private between(min: number, max: number): number {
        return min + this.rng() * (max - min)
    }
}
