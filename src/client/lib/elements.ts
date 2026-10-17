// Things on the page the marine can shoot: record links such as the incident numbers in a list.
//
// "Blasting" one is purely visual. The element is hidden with an inline `visibility` style (nothing
// is clicked, edited, removed or sent anywhere), and it comes back by itself after RESPAWN_MS, or at
// once when Doomguy is dismissed. A page reload also brings everything back.
import type { AutoTarget, Point } from './autopilot'
import { ELEMENT_HP } from './weapons'

export interface Box {
    x: number
    y: number
    w: number
    h: number
}

export interface ElementEntry {
    id: string
    el: HTMLElement
    win: Window
    text: string
    hp: number
    /** Reusable handle for the autopilot. */
    target: AutoTarget
    cache?: { at: number; box: Box | null }
}

interface Destroyed {
    el: HTMLElement
    value: string
    priority: string
    center: Point
    restoreAt: number
}

const CANDIDATES = 'a.linked, a.formlink, a[href*="sys_id="], a[href*="sys_id%3D"]'
const MAX_TARGETS = 80
export const RESPAWN_MS = 30000
const CACHE_MS = 120

/** Where a frame's top-left corner sits in the top window, or null when it can't be worked out. */
export function frameOffset(win: Window, host: Window): Point | null {
    let x = 0
    let y = 0
    let current: Window = win
    try {
        for (let depth = 0; current !== host; depth += 1) {
            const frame = current.frameElement
            if (!frame || depth > 5) return null
            const rect = frame.getBoundingClientRect()
            x += rect.left + frame.clientLeft
            y += rect.top + frame.clientTop
            current = current.parent
        }
    } catch {
        return null
    }
    return { x, y }
}

export class ElementTargets {
    private readonly entries = new Map<HTMLElement, ElementEntry>()
    private destroyed: Destroyed[] = []
    private readonly dead = new WeakSet<HTMLElement>()
    private counter = 0
    private readonly host: Window

    constructor(host: Window) {
        this.host = host
    }

    list(): ElementEntry[] {
        return [...this.entries.values()]
    }

    /** Refreshes the set of shootable elements from every live, visible, same-origin frame. */
    scan(frames: Window[], skip: RegExp, now: number): void {
        const seen = new Set<HTMLElement>()
        for (const win of new Set([this.host, ...frames])) {
            try {
                if (win.closed || skip.test(win.location.pathname)) continue
                if (win !== this.host && win.frameElement?.isConnected !== true) continue
                const origin = frameOffset(win, this.host)
                if (!origin) continue
                for (const el of Array.from(win.document.querySelectorAll<HTMLElement>(CANDIDATES))) {
                    if (seen.size >= MAX_TARGETS) break
                    if (this.dead.has(el)) continue
                    const box = this.measure(el, win, origin)
                    if (!box) continue
                    seen.add(el)
                    const existing = this.entries.get(el)
                    if (existing) {
                        existing.cache = { at: now, box }
                    } else {
                        this.add(el, win, box, now)
                    }
                }
            } catch {
                /* cross-origin or navigating frame */
            }
        }
        for (const el of this.entries.keys()) if (!seen.has(el)) this.entries.delete(el)
    }

    /** Current position of an element in top-window coordinates, or null when it is not shootable now. */
    box(entry: ElementEntry, now: number): Box | null {
        if (entry.cache && now - entry.cache.at < CACHE_MS) return entry.cache.box
        let box: Box | null = null
        try {
            const origin = frameOffset(entry.win, this.host)
            if (origin && entry.el.isConnected && !entry.win.closed) box = this.measure(entry.el, entry.win, origin)
        } catch {
            box = null
        }
        entry.cache = { at: now, box }
        return box
    }

    /** Applies a hit. Returns where it blew up (and what it said) when this hit destroyed it. */
    damage(entry: ElementEntry, now: number, amount = 1): { center: Point; text: string; color: string } | null {
        entry.hp -= amount
        if (entry.hp > 0) return null
        const box = this.box(entry, now) ?? entry.cache?.box ?? null
        const center = box ? { x: box.x + box.w / 2, y: box.y + box.h / 2 } : { x: 0, y: 0 }
        let color = '#222'
        try {
            color = entry.win.getComputedStyle(entry.el).color || color
        } catch {
            /* ignore */
        }
        const style = entry.el.style
        this.destroyed.push({
            el: entry.el,
            value: style.getPropertyValue('visibility'),
            priority: style.getPropertyPriority('visibility'),
            center,
            restoreAt: now + RESPAWN_MS,
        })
        style.setProperty('visibility', 'hidden', 'important')
        this.dead.add(entry.el)
        this.entries.delete(entry.el)
        return { center, text: entry.text, color }
    }

    /** Every live element whose box touches a circle (used for blast damage). */
    inRadius(center: Point, radius: number, now: number): ElementEntry[] {
        const hit: ElementEntry[] = []
        for (const entry of this.entries.values()) {
            const box = this.box(entry, now)
            if (!box) continue
            const nearestX = Math.min(box.x + box.w, Math.max(box.x, center.x))
            const nearestY = Math.min(box.y + box.h, Math.max(box.y, center.y))
            if (Math.hypot(nearestX - center.x, nearestY - center.y) <= radius) hit.push(entry)
        }
        return hit
    }

    /** Brings back whatever has been gone long enough. Returns where each one reappeared. */
    restoreDue(now: number): Point[] {
        const back: Point[] = []
        this.destroyed = this.destroyed.filter((d) => {
            if (now < d.restoreAt) return true
            this.restore(d)
            if (d.el.isConnected) back.push(d.center)
            return false
        })
        return back
    }

    restoreAll(): void {
        for (const d of this.destroyed) this.restore(d)
        this.destroyed = []
        this.entries.clear()
    }

    private restore(d: Destroyed): void {
        try {
            if (d.value) d.el.style.setProperty('visibility', d.value, d.priority)
            else d.el.style.removeProperty('visibility')
        } catch {
            /* frame gone */
        }
        this.dead.delete(d.el)
    }

    private add(el: HTMLElement, win: Window, box: Box, now: number): void {
        const entry: ElementEntry = {
            id: `el${(this.counter += 1)}`,
            el,
            win,
            text: (el.textContent ?? '').trim(),
            hp: ELEMENT_HP,
            cache: { at: now, box },
            target: undefined as unknown as AutoTarget,
        }
        const clock = (): number => performance.now()
        entry.target = {
            id: entry.id,
            kind: 'element',
            position: () => {
                const b = this.box(entry, clock())
                return b ? { x: b.x + b.w / 2, y: b.y + b.h / 2 } : { x: -9999, y: -9999 }
            },
            alive: () => entry.hp > 0 && this.entries.has(entry.el) && this.box(entry, clock()) !== null,
        }
        this.entries.set(el, entry)
    }

    /** The element's box in top-window coordinates, or null if it is hidden, tiny, huge, off-screen or covered. */
    private measure(el: HTMLElement, win: Window, origin: Point): Box | null {
        const text = (el.textContent ?? '').trim()
        if (text.length < 1 || text.length > 40) return null
        const rect = el.getBoundingClientRect()
        if (rect.width < 14 || rect.height < 8 || rect.width > 420 || rect.height > 80) return null
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        if (cx < 0 || cy < 0 || cx > win.innerWidth || cy > win.innerHeight) return null
        const hit = el.ownerDocument.elementFromPoint(cx, cy)
        if (!hit || !(hit === el || el.contains(hit))) return null
        const x = origin.x + rect.left
        const y = origin.y + rect.top
        if (x + rect.width / 2 > this.host.innerWidth || y + rect.height / 2 > this.host.innerHeight) return null
        return { x, y, w: rect.width, h: rect.height }
    }
}

/** Where a ray from (x, y) heading (dx, dy) first enters a box, as a distance, or null if it misses. */
export function rayBox(x: number, y: number, dx: number, dy: number, box: Box): number | null {
    let tmin = 0
    let tmax = Infinity
    for (const [origin, dir, lo, hi] of [
        [x, dx, box.x, box.x + box.w],
        [y, dy, box.y, box.y + box.h],
    ] as const) {
        if (Math.abs(dir) < 1e-9) {
            if (origin < lo || origin > hi) return null
        } else {
            const t1 = (lo - origin) / dir
            const t2 = (hi - origin) / dir
            tmin = Math.max(tmin, Math.min(t1, t2))
            tmax = Math.min(tmax, Math.max(t1, t2))
            if (tmin > tmax) return null
        }
    }
    return tmin
}
