// Weapons lying on the floor for Doomguy to grab: dropped by dead monsters, or airdropped now and then.
import type { AutoTarget, Point } from './autopilot'
import type { WeaponId } from './weapons'
import type { Sprite } from './wad'

export interface Pickup {
    id: string
    weapon: WeaponId
    x: number
    y: number
    since: number
    expiresAt: number
    taken: boolean
    target: AutoTarget
}

const LIFETIME_MS = 50000
const FADE_MS = 3000
const MAX_PICKUPS = 3
/** How close the marine's feet must be to the item. */
export const GRAB_RADIUS = 34

export class Pickups {
    items: Pickup[] = []
    private counter = 0

    canSpawn(): boolean {
        return this.items.filter((p) => !p.taken).length < MAX_PICKUPS
    }

    spawn(weapon: WeaponId, at: Point, now: number): Pickup {
        const pickup: Pickup = {
            id: `pick${(this.counter += 1)}`,
            weapon,
            x: at.x,
            y: at.y,
            since: now,
            expiresAt: now + LIFETIME_MS,
            taken: false,
            target: undefined as unknown as AutoTarget,
        }
        pickup.target = {
            id: pickup.id,
            kind: 'pickup',
            position: () => ({ x: pickup.x, y: pickup.y }),
            alive: () => !pickup.taken,
        }
        this.items.push(pickup)
        return pickup
    }

    targets(): AutoTarget[] {
        return this.items.filter((p) => !p.taken).map((p) => p.target)
    }

    /** Removes and returns the nearest item the marine is standing on, if any. */
    take(at: Point): Pickup | null {
        let best: Pickup | null = null
        let bestDist = GRAB_RADIUS
        for (const p of this.items) {
            if (p.taken) continue
            const d = Math.hypot(p.x - at.x, p.y - at.y)
            if (d < bestDist) {
                best = p
                bestDist = d
            }
        }
        if (best) best.taken = true
        return best
    }

    update(now: number): void {
        this.items = this.items.filter((p) => !p.taken && now < p.expiresAt)
    }

    clear(): void {
        this.items = []
    }

    draw(ctx: CanvasRenderingContext2D, now: number, sprites: Partial<Record<WeaponId, Sprite>>, scale: number): void {
        for (const p of this.items) {
            const sprite = sprites[p.weapon]
            if (!sprite) continue
            const bob = Math.sin((now - p.since) / 260) * 3
            const fade = Math.min(1, Math.max(0, (p.expiresAt - now) / FADE_MS))
            ctx.globalAlpha = fade
            // Soft glow so it reads as an item on any background.
            ctx.fillStyle = 'rgba(255, 220, 120, 0.25)'
            ctx.beginPath()
            ctx.ellipse(p.x, p.y + 2, 34, 9, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.drawImage(
                sprite.image,
                Math.round(p.x - sprite.left * scale),
                Math.round(p.y - sprite.top * scale + bob),
                sprite.width * scale,
                sprite.height * scale
            )
        }
        ctx.globalAlpha = 1
    }
}
